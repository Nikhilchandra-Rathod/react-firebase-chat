import { useEffect } from "react";
import { Auth } from "./components/auth/Auth";
import { ChatApp } from "./components/chat/ChatApp";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./stores/useUserStore";

const App = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const fetchUserInfo = useUserStore((state) => state.fetchUserInfo);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSubscribe();
    };
  }, [fetchUserInfo]);

  if (isLoading) {
    return <div className="m-4 p-4 bg-blue-100 rounded-sm">Loading...</div>;
  }

  return currentUser ? <ChatApp /> : <Auth />;
};

export default App;
