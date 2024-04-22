import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatMessages } from "./ChatMessages";
import { useChatStore } from "@/stores/useChatStore";

export function ChatApp() {
  const chatId = useChatStore((state) => state.chatId);

  return (
    <div className="grid h-dvh w-dvw md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col h-full max-h-screen">
        <Header />
        {chatId && <ChatMessages />}
      </div>
    </div>
  );
}
