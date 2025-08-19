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

  const setSessionCookie = useCallback(async (user: User | null) => {
    if (user) {
        const idToken = await user.getIdToken(true);
        const idTokenResult = await user.getIdTokenResult();
        const expiresIn = new Date(idTokenResult.expirationTime).getTime() - Date.now();
        document.cookie = `__session=${idToken}; path=/; max-age=${expiresIn / 1000}; SameSite=Lax; Secure`;
        document.cookie = `idToken=${idToken}; path=/; max-age=${expiresIn / 1000}; SameSite=Lax; Secure`;
    } else {
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'idToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setSessionCookie(currentUser);
      if (!currentUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, [setSessionCookie]);

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
      setSessionCookie(null);
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
