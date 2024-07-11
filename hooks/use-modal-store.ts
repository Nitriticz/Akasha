import { DocumentData } from "firebase-admin/firestore";
import { create } from "zustand";

export type ModalType =
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "createRoom"
  | "editRoom"
  | "deleteRoom"
  | "messageFile"
  | "deleteMessage"
  | "subscribe";

interface ModalData {
  space?: DocumentData;
  spaceId?: string;
  roomId?: string;
  channelId?: string;
  message?: DocumentData;
  channel?: {
    id: string;
    name: string;
    type: string;
  };
  room?: {
    id: string;
    name: string;
    description: string;
    image_path: string;
  };
  profile?:
    | DocumentData
    | {
        id_user: string;
        image_path: string | null | undefined;
        nickname: string | null | undefined;
        description: string;
        subscribed?: boolean;
      };
  role?: DocumentData | undefined;
  typeChannel?: string;
  members?: {
    id_user: string;
    image_path: string;
    nickname: string;
    description: string;
    role?: DocumentData;
  }[];
  roles?: {
    id: string;
    role: FirebaseFirestore.DocumentData;
  }[];
}

interface ModalStore {
  userId: string | null;
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (userId: string, type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  userId: null,
  data: {},
  type: null,
  isOpen: false,
  onOpen: (userId, type, data = {}) =>
    set({ userId, isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
