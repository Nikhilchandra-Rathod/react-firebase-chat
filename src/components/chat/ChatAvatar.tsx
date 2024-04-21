import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar } from "../ui/avatar";
import { getUserInitials } from "@/lib/utils";

export const ChatAvatar = ({ name }: { name: string | undefined }) => {
  if (!name) return null;
  return (
    <Avatar className="flex items-center justify-center bg-gray-200 text-primary">
      <AvatarFallback>{getUserInitials(name)}</AvatarFallback>
    </Avatar>
  );
};
