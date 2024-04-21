import { useUserStore } from "@/stores/useUserStore";
import { ChatAvatar } from "./ChatAvatar";
import { UserChats } from "./UserChats";

export const Sidebar = () => {
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-2 font-semibold ">
            <ChatAvatar name={currentUser?.name} />
            <span className="">{currentUser?.name}</span>
          </div>
        </div>
        <UserChats />
      </div>
    </div>
  );
};
