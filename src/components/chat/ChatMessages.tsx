import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Input } from "../ui/input";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Chat, Message, UserChat } from "@/types";
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";

export const ChatMessages = () => {
  const chatId = useChatStore((state) => state.chatId);
  const currentUser = useUserStore((state) => state.currentUser);
  const user = useChatStore((state) => state.user);
  const endMessagesRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<string>("");
  const [, setChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const handleAddMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() === "" || !currentUser || !user) return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser?.id,
          text: message,
          createdAt: Date.now(),
        }),
      });

      const userIds = [currentUser.id, user.id];

      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const userChats = userChatsData.chats as UserChat[];
          const chatIndex = userChats.findIndex((c) => c.chatId === chatId);
          userChats[chatIndex].lastMessage = message;
          userChats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChats,
          });
        }
      });
    } catch (error) {
      toast.error("Something went wrong! Please try again later.");
    }

    setMessage("");
  };

  useEffect(() => {
    const unSubscribe = onSnapshot(doc(db, "chats", chatId), (response) => {
      const chat = response.data() as Chat;
      setChat(chat);
      setChatMessages(chat.messages);

      // if any unread message then set isSeen = false
    });
    return () => {
      unSubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    endMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="flex flex-col flex-1 overflow-y-auto">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {chatMessages.map((chatMessage) => (
          <ChatMessage
            key={chatMessage.createdAt}
            message={chatMessage}
          />
        ))}
        <div ref={endMessagesRef}></div>
      </div>
      <div className="mt-auto p-4 border-t bg-muted/40">
        <form onSubmit={handleAddMessage}>
          <Input
            placeholder="Type a message"
            value={message}
            onInput={(e) => setMessage(e.currentTarget.value)}
          />
        </form>
      </div>
    </main>
  );
};
