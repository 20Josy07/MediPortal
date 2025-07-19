
"use client";

import { createContext, useContext } from "react";
import type { User, Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  auth: Auth | null;
  db: Firestore | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  auth: null,
  db: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
