"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot, type Firestore } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  auth: typeof auth;
  db: Firestore | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => {},
  auth: auth,
  db: db,
});

export const useAuth = () => {
  return useContext(AuthContext);
};


export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setUserProfile(doc.data() as UserProfile);
        } else {
           setUserProfile({
            fullName: user.displayName || "",
            email: user.email || "",
            photoURL: user.photoURL || "",
           });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error listening to profile changes:", error);
        setLoading(false);
      });

      return () => unsubscribeProfile();
    }
  }, [user]);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const value = useMemo(
    () => ({
      user,
      userProfile,
      loading,
      logout,
      auth,
      db,
    }),
    [user, userProfile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
