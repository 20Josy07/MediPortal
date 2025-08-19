"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { AuthContext, type AuthContextType } from "@/context/auth-context";

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
    let unsubscribeProfile: () => void = () => {};
    if (user && db) {
      const userDocRef = doc(db, 'users', user.uid);
      unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
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
    }
    return () => unsubscribeProfile();
  }, [user]);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  const value = useMemo<AuthContextType>(
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
