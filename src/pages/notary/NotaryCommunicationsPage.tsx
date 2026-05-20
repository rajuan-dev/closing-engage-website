import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Loader2, MapPin, MessageCircle, Search, SendHorizontal, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge, Button, Surface } from "@/components/common";
import {
  communicationService,
  type CommunicationConversation,
  type CommunicationMessage,
  type CommunicationSendResult,
  type CommunicationSocket,
  type CommunicationThread,
} from "@/services/communicationService";
import { orderService, type OrderDetail } from "@/services/orderService";
import { toast } from "@/store/useToastStore";
import type { Order } from "@/types/models";

interface SocketAck<T> {
  success: boolean;
  data?: T;
  message?: string;
}

type ConversationRow = {
  id: string;
  clientName: string;
  propertyAddress: string;
  notary: string;
  status: string;
  date: string;
  thread?: CommunicationThread;
};

const mergeMessage = (messages: CommunicationMessage[], next: CommunicationMessage) =>
  messages.some((message) => message.id === next.id) ? messages : [...messages, next];

const contextFileNumber = (orderId: string) => {
  const clean = orderId.replace(/^#/, "");
  const parts = clean.split("-");
  if (parts.length < 2) return clean;
  return `CE-${parts.slice(1).join("-")}`;
};

const conversationTimeLabel = (thread?: CommunicationThread) => {
  if (!thread?.lastMessageAt) return "";
  const timestamp = new Date(thread.lastMessageAt);
  const now = new Date();
  const sameDay = timestamp.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (timestamp.toDateString() === yesterday.toDateString()) return "Yesterday";
  return sameDay
    ? timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : timestamp.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export function NotaryCommunicationsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [threads, setThreads] = useState<CommunicationThread[]>([]);
  const [threadOrderSet, setThreadOrderSet] = useState<Set<string>>(new Set());
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null);
  const [conversation, setConversation] = useState<CommunicationConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isConversationLoading, setIsConversationLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<CommunicationSocket | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const rows = useMemo<ConversationRow[]>(() => {
    const threadByOrder = new Map(threads.map((thread) => [thread.orderNumber, thread]));

    return orders
      .filter((order) => threadOrderSet.has(order.id))
      .map((order) => ({
        id: order.id,
        clientName: order.clientName,
        propertyAddress: order.propertyAddress,
        notary: order.notary,
        status: order.status,
        date: order.date,
        thread: threadByOrder.get(order.id),
      }))
      .filter((row) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return `${row.id} ${row.clientName} ${row.propertyAddress} ${row.thread?.lastMessage ?? ""}`
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => {
        const aTime = a.thread?.lastMessageAt ? new Date(a.thread.lastMessageAt).getTime() : 0;
        const bTime = b.thread?.lastMessageAt ? new Date(b.thread.lastMessageAt).getTime() : 0;
        if (aTime !== bTime) return bTime - aTime;
        return a.id.localeCompare(b.id);
      });
  }, [orders, searchQuery, threads]);

  const selectedRow = rows.find((row) => row.id === selectedOrderId) || rows[0] || null;

  useEffect(() => {
    let isMounted = true;

    const loadCommunications = async () => {
      try {
        setIsLoading(true);
        const assignedOrders = await orderService.getAssignedOrders();
        const liveThreads = await communicationService.getThreads();

        if (!isMounted) return;
        setOrders(assignedOrders);
        setThreads(liveThreads);
        setThreadOrderSet(new Set(liveThreads.map((thread) => thread.orderNumber)));
        setSelectedOrderId((current) => current || liveThreads[0]?.orderNumber || "");

        const socket = communicationService.createSocket();
        socketRef.current = socket;
        socket?.on("communications:message", (payload) => {
          if (!isMounted) return;
          setThreads((current) => {
            const withoutCurrent = current.filter((thread) => thread.id !== payload.thread.id);
            return [payload.thread, ...withoutCurrent];
          });
          setThreadOrderSet((current) => new Set([...current, payload.thread.orderNumber]));
          setConversation((current) => {
            if (!current || current.thread.orderNumber !== payload.thread.orderNumber) return current;
            return {
              thread: payload.thread,
              messages: mergeMessage(current.messages, payload.message),
            };
          });
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load communications.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadCommunications();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!selectedRow?.id) return;

    let isMounted = true;
    setIsConversationLoading(true);
    setDraftMessage("");

    Promise.all([
      orderService.getOrderDetail(selectedRow.id),
      communicationService.getOrderMessages(selectedRow.id),
    ])
      .then(([detail, loadedConversation]) => {
        if (!isMounted) return;
        setSelectedOrderDetail(detail);
        setConversation(loadedConversation);
        setThreads((current) => {
          const withoutCurrent = current.filter((thread) => thread.id !== loadedConversation.thread.id);
          return [loadedConversation.thread, ...withoutCurrent];
        });
        setThreadOrderSet((current) => new Set([...current, loadedConversation.thread.orderNumber]));
        socketRef.current?.emit("communications:join-order", selectedRow.id, (ack: SocketAck<CommunicationConversation>) => {
          if (ack.success && ack.data && isMounted) setConversation(ack.data);
        });
      })
      .catch((error) => {
        if (!isMounted) return;
        setConversation(null);
        setSelectedOrderDetail(null);
        toast.error(error instanceof Error ? error.message : "Unable to load order conversation.");
      })
      .finally(() => {
        if (isMounted) setIsConversationLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedRow?.id]);

  useEffect(() => {
    const messages = messagesRef.current;
    if (!messages) return;
    messages.scrollTop = messages.scrollHeight;
  }, [conversation?.messages.length, selectedRow?.id]);

  const sendMessage = () => {
    const body = draftMessage.trim();
    const orderId = selectedRow?.id;
    if (!body || !orderId || isSending) return;

    const applySentMessage = (result: CommunicationSendResult) => {
      setConversation((current) =>
        current
          ? { thread: result.thread, messages: mergeMessage(current.messages, result.message) }
          : { thread: result.thread, messages: [result.message] },
      );
      setThreads((current) => {
        const withoutCurrent = current.filter((thread) => thread.id !== result.thread.id);
        return [result.thread, ...withoutCurrent];
      });
      setThreadOrderSet((current) => new Set([...current, result.thread.orderNumber]));
      setDraftMessage("");
    };

    setIsSending(true);
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(
        "communications:send-message",
        { orderNumber: orderId, body },
        (ack: SocketAck<CommunicationSendResult>) => {
          setIsSending(false);
          if (!ack.success || !ack.data) {
            toast.error(ack.message || "Unable to send message.");
            return;
          }
          applySentMessage(ack.data);
        },
      );
      return;
    }

    communicationService
      .sendOrderMessage(orderId, body)
      .then(applySentMessage)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Unable to send message."))
      .finally(() => setIsSending(false));
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[0.42fr_0.98fr_0.34fr] min-h-[calc(100vh-140px)]">
      <Surface className="rounded-[20px] border border-[#e4ebf5] bg-white p-0 shadow-[0_12px_30px_rgba(20,48,112,0.05)] overflow-hidden">
        <div className="border-b border-[#edf1f7] px-5 py-4">
          <div className="text-[18px] font-extrabold tracking-tight text-ink-900">Conversations</div>
          <div className="mt-3 flex h-[44px] items-center gap-3 rounded-[14px] border border-[#dfe6f2] bg-white px-4 text-ink-400 shadow-sm">
            <Search className="h-4 w-4" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full bg-transparent text-[14px] text-ink-700 outline-none placeholder:text-ink-400"
              placeholder="Search conversations..."
            />
          </div>
        </div>

        <div className="max-h-[calc(100vh-260px)] min-h-[620px] overflow-y-auto bg-[#fbfcff]">
          {isLoading ? (
            <div className="flex h-[320px] items-center justify-center text-[14px] font-semibold text-ink-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading conversations...
            </div>
          ) : rows.length === 0 ? (
            <div className="flex h-[320px] flex-col items-center justify-center px-8 text-center">
              <MessageCircle className="mb-3 h-8 w-8 text-ink-300" />
              <div className="text-[14px] font-bold text-ink-900">No conversations yet</div>
              <div className="mt-1 text-[12px] leading-5 text-ink-400">Only real order conversations appear here after a message is started.</div>
            </div>
          ) : (
            rows.map((row) => {
              const isActive = row.id === selectedRow?.id;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedOrderId(row.id)}
                  className={`w-full border-b border-[#eef2f8] px-5 py-4 text-left transition ${
                    isActive ? "bg-[#eef5ff] shadow-[inset_3px_0_0_0_#1d5dc3]" : "bg-white hover:bg-[#f8fbff]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-extrabold text-ink-900">Order {row.id}</div>
                      <div className="mt-1 truncate text-[12px] font-semibold text-ink-700">{row.clientName || "Unknown signer"}</div>
                    </div>
                    <div className="shrink-0 text-[11px] font-medium text-ink-400">{conversationTimeLabel(row.thread)}</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold text-ink-400">
                    <MapPin className="h-3.5 w-3.5 text-brand-500" />
                    <span className="truncate">{row.propertyAddress}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="min-w-0 truncate text-[12px] text-ink-600">
                      {row.thread?.lastMessage ? row.thread.lastMessage : `No messages yet for ${row.clientName}`}
                    </div>
                    {row.thread?.unreadCount ? (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[11px] font-bold text-white">
                        {row.thread.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Surface>

      <Surface className="rounded-[20px] border border-[#e4ebf5] bg-white p-0 shadow-[0_12px_30px_rgba(20,48,112,0.05)] flex flex-col overflow-hidden">
        <div className="border-b border-[#edf1f7] px-6 py-4">
          <div className="text-[20px] font-bold tracking-tight text-ink-900">
            Communication Center{selectedRow ? ` - Order ${selectedRow.id}` : ""}
          </div>
          <div className="mt-1 text-[13px] text-ink-500">Chat with Closing Engage team regarding active files.</div>
        </div>

        <div ref={messagesRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-slate-50/20 min-h-[520px]">
          {isConversationLoading ? (
            <div className="flex h-full items-center justify-center text-[14px] font-semibold text-ink-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading conversation...
            </div>
          ) : conversation?.messages.length ? (
            <div className="space-y-5">
              {conversation.messages.map((message) => {
                const mine = message.senderRole === "notary";
                const initials = message.senderName
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div key={message.id} className={mine ? "ml-auto max-w-[74%]" : "max-w-[68%]"}>
                    <div className={`mb-2 flex items-end gap-2.5 ${mine ? "justify-end" : ""}`}>
                      {!mine ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6eeff] text-[10px] font-bold text-brand-600">
                          {initials}
                        </div>
                      ) : null}
                      <div className={`text-[13px] font-semibold text-ink-900 ${mine ? "text-right" : ""}`}>
                        {mine ? "You (Notary)" : message.senderName}
                        <span className="ml-2 text-[11px] font-normal text-ink-400">{message.time}</span>
                      </div>
                      {mine ? (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6ea8ff] text-[10px] font-bold text-white">
                          ME
                        </div>
                      ) : null}
                    </div>
                    <div
                      className={`rounded-[16px] px-4 py-3 text-[14px] leading-relaxed ${
                        mine
                          ? "bg-brand-600 text-white shadow-[0_8px_20px_rgba(24,90,188,0.12)]"
                          : "bg-[#f3f6fb] text-ink-700"
                      }`}
                    >
                      {message.body}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center px-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="text-[15px] font-bold text-ink-900">Start a conversation with admin</div>
              <div className="mt-1 max-w-[360px] text-[13px] leading-6 text-ink-400">
                Select an order from the left. Each order keeps its own conversation thread and history.
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#edf1f7] px-6 py-3.5 bg-white">
          <div className="flex items-center gap-4 rounded-xl border border-[#dfe6f2] bg-[#f7f9fd] px-4 py-3.5 focus-within:border-brand-300 focus-within:bg-white transition-all duration-200 shadow-sm">
            <textarea
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              disabled={!selectedRow}
              className="max-h-24 min-h-[24px] flex-1 resize-none bg-transparent text-[14px] text-ink-700 outline-none placeholder:text-ink-400"
              placeholder={selectedRow ? "Type a message..." : "Select an order to start messaging..."}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!draftMessage.trim() || !selectedRow || isSending}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-600 text-white shadow-[0_8px_16px_rgba(24,90,188,0.14)] hover:bg-brand-700 disabled:opacity-40 disabled:shadow-none transition-all flex-shrink-0"
              aria-label="Send message"
            >
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            Your messages are encrypted end-to-end.
          </div>
        </div>
      </Surface>

      <Surface className="rounded-[20px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)] flex flex-col justify-between">
        <div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-600">Active File Context</div>
          <div className="mt-3.5 h-px bg-[#edf1f7]" />
          {selectedOrderDetail ? (
            <div className="mt-4 space-y-4 text-[13px]">
              <div>
                <div className="text-ink-400">File Number</div>
                <div className="mt-1 text-[16px] font-semibold text-ink-900">{contextFileNumber(selectedOrderDetail.id)}</div>
              </div>
              <div>
                <div className="text-ink-400">Principal Signer</div>
                <div className="mt-1 text-[16px] font-semibold text-ink-900">{selectedOrderDetail.clientName || "Unknown Signer"}</div>
              </div>
              <div>
                <div className="text-ink-400">Current Status</div>
                <div className="mt-2.5">
                  <Badge status={selectedOrderDetail.status} />
                </div>
              </div>
              <div className="rounded-[14px] border border-[#edf1f7] bg-[#fbfcff] p-4">
                <div className="flex items-start gap-3 text-[13px] text-ink-500">
                  <Calendar className="mt-0.5 h-4 w-4 text-brand-600" />
                  <div>{selectedOrderDetail.date}{selectedOrderDetail.time ? `, ${selectedOrderDetail.time}` : ""}</div>
                </div>
                <div className="mt-3 flex items-start gap-3 text-[13px] text-ink-500">
                  <MapPin className="mt-0.5 h-4 w-4 text-brand-600" />
                  <div>{selectedOrderDetail.propertyAddress}</div>
                </div>
                <div className="mt-3 flex items-start gap-3 text-[13px] text-ink-500">
                  <UserRound className="mt-0.5 h-4 w-4 text-brand-600" />
                  <div>{selectedOrderDetail.notary === "--" ? "Notary assignment pending" : selectedOrderDetail.notary}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-[13px] leading-6 text-ink-400">Select a conversation to view the active file context.</div>
          )}
        </div>

        {selectedRow ? (
          <Link to={`/notary/orders/${selectedRow.id.replace(/^#/, "")}`}>
            <Button variant="outline" className="mt-6 h-[42px] w-full rounded-[12px] border-[#bfd1f6] text-[13px] font-semibold text-brand-600">
              View Full Dossier
            </Button>
          </Link>
        ) : null}
      </Surface>
    </div>
  );
}
