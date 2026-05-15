import { useToastStore } from "@/store/useToastStore";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "pointer-events-auto flex items-center gap-4 min-w-[320px] max-w-[420px] rounded-2xl border p-4 shadow-2xl transition-all duration-500 animate-in slide-in-from-right-10",
            t.type === "success" && "border-emerald-100 bg-emerald-50/90 backdrop-blur-md text-emerald-900",
            t.type === "error" && "border-rose-100 bg-rose-50/90 backdrop-blur-md text-rose-900",
            t.type === "info" && "border-brand-100 bg-brand-50/90 backdrop-blur-md text-brand-900"
          )}
        >
          <div className="shrink-0">
            {t.type === "success" && <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
            {t.type === "error" && <AlertCircle className="h-6 w-6 text-rose-500" />}
            {t.type === "info" && <Info className="h-6 w-6 text-brand-500" />}
          </div>
          <div className="flex-1 text-[15px] font-semibold leading-tight">{t.message}</div>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4 opacity-50" />
          </button>
        </div>
      ))}
    </div>
  );
}
