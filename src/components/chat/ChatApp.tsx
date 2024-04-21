import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatMessages } from "./ChatMessages";
import { useChatStore } from "@/stores/useChatStore";

export function ChatApp() {
  const chatId = useChatStore((state) => state.chatId);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col h-full max-h-screen">
        {chatId && (
          <>
            <Header />
            <ChatMessages />
          </>
        )}
      </div>
    </div>
  );
}
