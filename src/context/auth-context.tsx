
"use client";

import { createContext, useContext } from "react";
import type { User, Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
  auth: Auth | null;
  db: Firestore | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
  deleteUserAccount: async () => {},
  auth: null,
  db: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
