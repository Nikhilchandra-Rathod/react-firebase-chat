import { useUserStore } from "@/stores/useUserStore";
import { Message } from "@/types";

export const ChatMessage = ({ message }: { message: Message }) => {
  const currentUser = useUserStore((state) => state.currentUser);
  return <div className={`flex p-2 bg-gray-200 rounded-sm w-4/5 ${message.senderId === currentUser?.id ? "self-end" : "self-start"}`}>{message.text}</div>;
};
