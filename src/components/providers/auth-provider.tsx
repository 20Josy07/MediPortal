
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";
import { AuthContext, type AuthContextType } from "@/context/auth-context";
import { useSession } from "next-auth/react";

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();


  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        // Only set loading to false if next-auth has also resolved
        if (status !== 'loading') {
          setLoading(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, [status]);

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
    } else if (!user && status !== 'loading') {
        // If there's no firebase user and next-auth is not loading, we are done.
        setLoading(false);
    }
    return () => unsubscribeProfile();
  }, [user, status]);

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth);
    }
  }, [auth]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      logout();
    }
  }, [status, logout]);


  const value = useMemo<AuthContextType>(
    () => ({
      user,
      userProfile,
      loading,
      logout,
      auth,
      db,
    }),
    [user, userProfile, loading, logout, auth, db]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
