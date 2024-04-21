export interface User {
  id: string;
  name: string;
  email: string;
  blocked: string[];
}

export interface UserChat {
  chatId: string;
  receiverId: string;
  updatedAt: number;
  lastMessage: string;
  isSeen: boolean;
  user: User;
}

export interface Chat {
  messages: Message[];
}

export interface Message {
  createdAt: number;
  text: string;
  senderId: string;
}
