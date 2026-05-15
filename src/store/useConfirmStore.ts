import { create } from "zustand";

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: "danger" | "warning" | "info";
}

interface ConfirmStore extends ConfirmState {
  confirm: (options: Omit<ConfirmState, "isOpen">) => void;
  close: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  onConfirm: () => {},
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  type: "info",
  confirm: (options) => set({ ...options, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
