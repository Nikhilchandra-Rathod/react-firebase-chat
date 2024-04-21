import { db } from "@/lib/firebase";
import { SearchUserSchema } from "@/lib/schemas";
import { User, UserChat } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { arrayUnion, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { ChatAvatar } from "./ChatAvatar";
import { useUserStore } from "@/stores/useUserStore";
import { useChatStore } from "@/stores/useChatStore";

export const AddNewChatDialog = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const changeChat = useChatStore((state) => state.chageChat);
  const [open, setOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof SearchUserSchema>>({
    resolver: zodResolver(SearchUserSchema),
    defaultValues: {
      searchTerm: "",
    },
  });

  const handleSearchUser = async (values: z.infer<typeof SearchUserSchema>) => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      //const usersQuery = query(usersRef, where("name".toLocaleLowerCase(), "==", values.searchTerm.toLocaleLowerCase()));
      const querySnapShot = await getDocs(usersRef);
      if (!querySnapShot.empty) {
        const allSeachedUsers: User[] = await Promise.all(
          querySnapShot.docs.map(async (doc) => {
            return (await doc.data()) as User;
          })
        );
        setUsers(allSeachedUsers.filter((user) => user.name.toLowerCase().startsWith(values.searchTerm.toLowerCase())));
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again later!");
    } finally {
      setLoading(false);
      form.reset();
    }
  };

  const getExistingChatId = async (currentUserId: string, receiverId: string) => {
    const userChatRef = doc(db, "userchats", currentUserId);
    const userChatSnapshot = await getDoc(userChatRef);
    if (userChatSnapshot.exists()) {
      const userChatData = userChatSnapshot.data();
      const chats = userChatData.chats as UserChat[];
      const isAnychatAvailable = chats.find((c) => c.receiverId === receiverId);
      if (isAnychatAvailable) {
        return isAnychatAvailable.chatId;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const handleAddUserChat = async (user: User) => {
    if (!currentUser) return;
    try {
      const existingChatId = await getExistingChatId(currentUser.id, user.id);

      if (existingChatId.trim() !== "") {
        const chatUserRef = doc(db, "users", user.id);
        const chatUserSnapshot = await getDoc(chatUserRef);
        if (chatUserSnapshot.exists()) {
          changeChat(existingChatId, chatUserSnapshot.data() as User);
          setOpen(false);
        }
      } else {
        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");
        const newChatRef = doc(chatRef);
        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        });

        await updateDoc(doc(userChatsRef, user.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            isSeen: false,
            receiverId: currentUser.id,
            updatedAt: Date.now(),
          }),
        });

        await updateDoc(doc(userChatsRef, currentUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: "",
            isSeen: false,
            receiverId: user.id,
            updatedAt: Date.now(),
          }),
        });

        setOpen(false);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Something went wrong! Please try again later!");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search user to chat</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSearchUser)}
              className="w-full"
            >
              <FormField
                control={form.control}
                name="searchTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          placeholder="Search user..."
                          {...field}
                          disabled={loading}
                        />
                        <Button>{loading ? "Wait..." : "Search"}</Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <div className="mt-4 space-y-4 w-full">
          {users.length > 0 &&
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-2 "
              >
                <ChatAvatar name={user.name} />
                <div className="flex items-center gap-4 justify-between flex-1">
                  <div>
                    <div>{user.name}</div>
                    <div className="text-sm">{user.email}</div>
                  </div>
                  <Button onClick={() => handleAddUserChat(user)}>Add User</Button>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
