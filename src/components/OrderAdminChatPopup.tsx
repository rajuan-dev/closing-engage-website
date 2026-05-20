import { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";

import {
  communicationService,
  type CommunicationConversation,
  type CommunicationMessage,
  type CommunicationSendResult,
  type CommunicationSocket,
} from "@/services/communicationService";
import { toast } from "@/store/useToastStore";

interface SocketAck<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const mergeMessage = (messages: CommunicationMessage[], next: CommunicationMessage) =>
  messages.some((message) => message.id === next.id) ? messages : [...messages, next];

export function OrderAdminChatPopup({ orderNumber }: { orderNumber: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<CommunicationConversation | null>(null);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socketRef = useRef<CommunicationSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || !orderNumber) return;

    let isActive = true;
    setIsLoading(true);

    communicationService
      .getOrderMessages(orderNumber)
      .then((loadedConversation) => {
        if (!isActive) return;
        setConversation(loadedConversation);

        const socket = communicationService.createSocket();
        socketRef.current = socket;
        if (!socket) return;

        socket.emit(
          "communications:join-order",
          orderNumber,
          (ack: SocketAck<CommunicationConversation>) => {
            if (ack.success && ack.data && isActive) setConversation(ack.data);
          },
        );
        socket.on("communications:message", (payload: CommunicationSendResult) => {
          if (!isActive || payload.thread.orderNumber !== orderNumber) return;
          setConversation((current) =>
            current
              ? { thread: payload.thread, messages: mergeMessage(current.messages, payload.message) }
              : { thread: payload.thread, messages: [payload.message] },
          );
        });
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : "Unable to load admin chat.");
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isOpen, orderNumber]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length, isOpen]);

  const sendMessage = () => {
    const body = draft.trim();
    if (!body || isSending) return;

    const socket = socketRef.current;
    setIsSending(true);

    const applySentMessage = (result: CommunicationSendResult) => {
      setConversation((current) =>
        current
          ? { thread: result.thread, messages: mergeMessage(current.messages, result.message) }
          : { thread: result.thread, messages: [result.message] },
      );
      setDraft("");
    };

    if (socket?.connected) {
      socket.emit(
        "communications:send-message",
        { orderNumber, body },
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
      .sendOrderMessage(orderNumber, body)
      .then(applySentMessage)
      .catch((error) => toast.error(error instanceof Error ? error.message : "Unable to send message."))
      .finally(() => setIsSending(false));
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <section className="flex h-[560px] w-[calc(100vw-2.5rem)] max-w-[390px] flex-col overflow-hidden rounded-[26px] border border-brand-100 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.24)]">
          <header className="flex items-center justify-between bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-5 py-4 text-white">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/70">Admin Chat</p>
              <h3 className="mt-1 text-base font-extrabold">Closing Engage Support</h3>
              <p className="text-xs text-white/75">{orderNumber}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-white/12 p-2 text-white transition hover:bg-white/20"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f4f7fb] px-4 py-5">
            {isLoading ? (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-ink-400">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading conversation
              </div>
            ) : conversation?.messages.length ? (
              conversation.messages.map((message) => {
                const mine = message.senderRole === "notary";
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[78%] rounded-[20px] px-4 py-3 text-sm shadow-sm ${
                        mine
                          ? "rounded-br-md bg-brand-600 text-white"
                          : "rounded-bl-md border border-ink-100 bg-white text-ink-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-5">{message.body}</p>
                      <p className={`mt-1 text-[10px] font-semibold ${mine ? "text-white/65" : "text-ink-300"}`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-ink-900">Start a conversation with admin</p>
                <p className="mt-1 text-xs leading-5 text-ink-400">
                  Ask questions about this closing, scanbacks, schedule, or document review.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <footer className="border-t border-ink-100 bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-ink-100 bg-ink-50 p-2">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                maxLength={4000}
                placeholder="Write a message..."
                className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-ink-800 outline-none placeholder:text-ink-300"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!draft.trim() || isSending}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </footer>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky-500 text-white shadow-[0_22px_55px_rgba(37,99,214,0.35)] transition hover:-translate-y-1"
          aria-label="Open admin chat"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
        </button>
      )}
    </div>
  );
}
