import { create } from "zustand";

export type ModalType = "createServer";

interface ModalStore {
  userId: string | null;
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (userId: string, type: ModalType) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  userId: null,
  type: null,
  isOpen: false,
  onOpen: (userId, type) => set({ userId, isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
