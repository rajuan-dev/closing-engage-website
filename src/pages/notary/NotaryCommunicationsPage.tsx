import { useEffect, useRef, useState } from "react";
import { Paperclip, SendHorizontal, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge, Button, Surface } from "@/components/common";
import { useStore } from "@/store/useStore";

export function NotaryCommunicationsPage() {
  const { chatMessages, addChatMessage } = useStore();
  const [draftMessage, setDraftMessage] = useState("");
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAdminTyping]);

  const sendMessage = () => {
    if (!draftMessage.trim()) return;

    const userMsg = {
      sender: "You (Notary)",
      role: "you" as const,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      body: draftMessage.trim(),
    };

    addChatMessage(userMsg);
    setDraftMessage("");

    // Simulate reactive, backend-ready replies from the Ops/Admin team
    setIsAdminTyping(true);

    setTimeout(() => {
      setIsAdminTyping(false);
      addChatMessage({
        sender: "Sarah Johnson",
        role: "admin" as const,
        time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        body: "Confirmed. Thanks for the quick update! I have notified the title officer. We will review the signature block and move the file forward. I'll post here as soon as it's completed.",
      });
    }, 2500); // 2.5 second delay
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.28fr_0.34fr] h-[calc(100vh-140px)] min-h-[500px] overflow-hidden">
      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-0 shadow-[0_12px_30px_rgba(20,48,112,0.05)] flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#edf1f7] px-6 py-4 flex-shrink-0">
          <div className="text-[20px] font-bold tracking-tight text-ink-900">Communication Center</div>
          <div className="mt-1 text-[13px] text-ink-500">Chat with Closing Engage team regarding active files.</div>
        </div>

        {/* Message body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-slate-50/20">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-[#eef2f8] px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-500">
              Today
            </div>
          </div>

          <div className="space-y-6">
            {chatMessages.map((message, idx) => (
              <div 
                key={`${message.sender}-${idx}-${message.body.slice(0, 10)}`} 
                className={message.role === "you" ? "ml-auto max-w-[76%]" : "max-w-[68%]"}
              >
                <div className={`mb-2 flex items-end gap-2.5 ${message.role === "you" ? "justify-end" : ""}`}>
                  {message.role === "admin" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e6eeff] text-[10px] font-bold text-brand-600">
                      {message.sender.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                  ) : null}
                  <div className={`text-[13px] font-semibold text-ink-900 ${message.role === "you" ? "text-right" : ""}`}>
                    {message.sender}
                    <span className="ml-2 text-[11px] font-normal text-ink-400">{message.time}</span>
                  </div>
                  {message.role === "you" ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6ea8ff] text-[10px] font-bold text-white">
                      ME
                    </div>
                  ) : null}
                </div>
                <div className={`rounded-[16px] px-4 py-3 text-[14px] leading-relaxed ${
                  message.role === "you"
                    ? "bg-brand-600 text-white shadow-[0_8px_20px_rgba(24,90,188,0.12)]"
                    : "bg-[#f3f6fb] text-ink-700"
                }`}>
                  {message.body}
                </div>
              </div>
            ))}
            {isAdminTyping && (
              <div className="flex items-center gap-3 text-[13px] text-ink-500">
                <div className="flex gap-1 items-center justify-center py-1 pl-1">
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-brand-500 animate-bounce" />
                </div>
                <span className="font-medium text-ink-400">Sarah Johnson is typing...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input box area */}
        <div className="border-t border-[#edf1f7] px-6 py-4 bg-white flex-shrink-0">
          <div className="flex items-center gap-4 rounded-xl border border-[#dfe6f2] bg-[#f7f9fd] px-4 py-3.5 focus-within:border-brand-300 focus-within:bg-white transition-all duration-200 shadow-sm">
            <Paperclip className="h-4.5 w-4.5 text-ink-500 hover:text-brand-600 cursor-pointer" />
            <input
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              className="flex-1 bg-transparent text-[14px] text-ink-700 outline-none placeholder:text-ink-400"
              placeholder="Type a message..."
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!draftMessage.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-600 text-white shadow-[0_8px_16px_rgba(24,90,188,0.14)] hover:bg-brand-700 disabled:opacity-40 disabled:hover:translate-y-0 disabled:shadow-none transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <SendHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-500">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-600" />
            Your messages are encrypted end-to-end.
          </div>
        </div>
      </Surface>

      <Surface className="rounded-[18px] border border-[#e4ebf5] bg-white p-5 shadow-[0_12px_30px_rgba(20,48,112,0.05)] flex flex-col justify-between h-full">
        <div>
          <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
            Active File Context
          </div>
          <div className="mt-3.5 h-px bg-[#edf1f7]" />
          <div className="mt-4 space-y-4 text-[13px]">
            <div>
              <div className="text-ink-400">File Number</div>
              <div className="mt-1 text-[16px] font-semibold text-ink-900">CE-99283-SL</div>
            </div>
            <div>
              <div className="text-ink-400">Principal Signer</div>
              <div className="mt-1 text-[16px] font-semibold text-ink-900">Robert J. Smith</div>
            </div>
            <div>
              <div className="text-ink-400">Current Status</div>
              <div className="mt-2.5"><Badge status="Pending Review" /></div>
            </div>
          </div>
        </div>
        <Link to="/notary/orders/CE-99283-SL">
          <Button variant="outline" className="mt-6 h-[40px] w-full rounded-[10px] border-[#bfd1f6] text-[13px] font-semibold text-brand-600">
            View Full Dossier
          </Button>
        </Link>
      </Surface>
    </div>
  );
}
