import { useConfirmStore } from "@/store/useConfirmStore";
import { Modal, Button } from "./common";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalConfirmModal() {
  const { isOpen, title, message, onConfirm, close, confirmLabel, cancelLabel, type } = useConfirmStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    close();
  };

  return (
    <Modal isOpen={isOpen} onClose={close} title={title} maxWidth="480px">
      <div className="px-7 pb-8">
        <div className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5">
          <div className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
            type === "danger" && "bg-rose-100 text-rose-600",
            type === "warning" && "bg-amber-100 text-amber-600",
            type === "info" && "bg-brand-100 text-brand-600"
          )}>
            {type === "danger" && <AlertTriangle className="h-6 w-6" />}
            {type === "warning" && <AlertCircle className="h-6 w-6" />}
            {type === "info" && <Info className="h-6 w-6" />}
          </div>
          <div className="text-[15px] leading-[1.6] text-ink-500">
            {message}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" onClick={close} className="flex-1 h-[48px] rounded-[12px]">
            {cancelLabel || "Cancel"}
          </Button>
          <Button 
            onClick={handleConfirm} 
            className={cn(
              "flex-1 h-[48px] rounded-[12px]",
              type === "danger" && "bg-rose-600 hover:bg-rose-700 shadow-rose-200"
            )}
          >
            {confirmLabel || "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
