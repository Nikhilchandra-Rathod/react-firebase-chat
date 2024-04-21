import { User } from "@/types";
import { create } from "zustand";
import { useUserStore } from "./useUserStore";

interface ChatStoreState {
  chatId: string;
  user: User | null;
  isCurrentUserBlocked: boolean;
  isReceiverBlocked: boolean;
  chageChat: (chatId: string, user: User) => void;
  changeBlock: () => void;
}

export const useChatStore = create<ChatStoreState>()((set) => ({
  chatId: "",
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
  chageChat: (chatId: string, user: User) => {
    const currentUser = useUserStore.getState().currentUser;
    if (!currentUser) return;

    if (user.blocked.includes(currentUser.id)) {
      return set({
        chatId,
        user: null,
        isCurrentUserBlocked: true,
        isReceiverBlocked: false,
      });
    } else if (currentUser.blocked.includes(user.id)) {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: true,
      });
    } else {
      return set({
        chatId,
        user: user,
        isCurrentUserBlocked: false,
        isReceiverBlocked: false,
      });
    }
  },
  changeBlock: () => {
    set((state) => {
      return {
        ...state,
        isReceiverBlocked: !state.isReceiverBlocked,
      };
    });
  },
}));
