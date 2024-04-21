import { db } from "@/lib/firebase";
import { User } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";

interface UserStoreState {
  currentUser: User | null;
  isLoading: boolean;
  fetchUserInfo: (uid: string | undefined) => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid: string | undefined) => {
    if (!uid) {
      return set({
        currentUser: null,
        isLoading: false,
      });
    }

    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        set({
          currentUser: userDocSnapshot.data() as User,
          isLoading: false,
        });
      }
    } catch (error) {
      return set({
        currentUser: null,
        isLoading: false,
      });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
