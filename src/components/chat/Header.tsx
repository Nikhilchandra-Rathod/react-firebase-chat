import { auth } from "@/lib/firebase";
import { useChatStore } from "@/stores/useChatStore";
import { useUserStore } from "@/stores/useUserStore";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ChatAvatar } from "./ChatAvatar";
import { UserChats } from "./UserChats";

export const Header = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const user = useChatStore((state) => state.user);
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className=" flex flex-col p-0"
        >
          <nav className=" text-lg font-medium">
            <div className="p-4 flex items-center gap-2 text-lg font-semibold">
              <ChatAvatar name={currentUser?.name} />
              <span>{currentUser?.name}</span>
            </div>
            <div className="mt-4">
              <UserChats />
            </div>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <div className="flex items-center gap-2">
          <ChatAvatar name={user?.name} />
          <span className="font-semibold">{user?.name}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full"
          >
            <ChatAvatar name={currentUser?.name} />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              auth.signOut();
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
