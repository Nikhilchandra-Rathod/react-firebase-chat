import { db } from "@/lib/firebase";
import { useUserStore } from "@/stores/useUserStore";
import { User, UserChat } from "@/types";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { AddNewChatDialog } from "./AddNewChatDialog";
import { ChatAvatar } from "./ChatAvatar";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

export const Sidebar = () => {
  const [chats, setChats] = useState<UserChat[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const currentUser = useUserStore((state) => state.currentUser);
  const chageChat = useChatStore((state) => state.chageChat);

  useEffect(() => {
    const unSubscribe = onSnapshot(doc(db, "userchats", currentUser?.id ?? ""), async (response) => {
      const userChatsResponse = response.data();
      if (userChatsResponse) {
        const userChats = userChatsResponse.chats as UserChat[];

        const promises = userChats.map(async (userChat) => {
          const userDocRef = doc(db, "users", userChat.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data() as User;
          return {
            ...userChat,
            user,
          };
        });

        const chatData = await Promise.all(promises);
        chatData.sort((a, b) => b.updatedAt - a.updatedAt);
        setChats(chatData);
      }
    });

    return () => {
      unSubscribe();
    };
  }, [currentUser?.id]);

  const handleSelectUserChat = async (userChat: UserChat) => {
    if (!currentUser) return;

    const userChats = chats.map((userChat) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { user, ...rest } = userChat;
      return rest;
    });

    const chatIndex = chats.findIndex((c) => c.chatId === userChat.chatId);
    userChats[chatIndex].isSeen = true;
    try {
      const userChatsRef = doc(db, "userchats", currentUser.id);
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      chageChat(userChat.chatId, userChat.user);
    } catch (error) {
      toast.error("Something went wrong! Please try again later.");
    }
  };

  const filteredChats = chats.filter((c) => c.user.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 font-semibold ">
            <ChatAvatar name={currentUser?.name} />
            <span className="">{currentUser?.name}</span>
          </div>
        </div>
        <div className="px-4 flex items-center gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <AddNewChatDialog />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col text-sm font-medium">
            {filteredChats.map((chat) => (
              <button
                key={chat.chatId}
                className={`py-2 px-4  transition-all  ${chat.isSeen ? "bg-transparent text-muted-foreground hover:text-primary" : "bg-violet-500 text-white"}`}
                onClick={() => handleSelectUserChat(chat)}
              >
                <div className="flex items-center gap-3">
                  <ChatAvatar name={chat.user.name} />
                  <div className="flex-1 flex flex-col items-start">
                    <div className="line-clamp-1">{chat.user.name}</div>
                    <p className="text-xs line-clamp-1 p-0 m-0">{chat.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
