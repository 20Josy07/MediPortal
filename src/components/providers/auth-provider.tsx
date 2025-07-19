
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, onSnapshot, type Firestore } from "firebase/firestore";
import { AuthContext } from "@/context/auth-context";
import { auth, db } from "@/lib/firebase";
import type { UserProfile } from "@/lib/types";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
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
          // This might happen for a brief moment for new users
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

  const fullUser = useMemo(() => {
    if (!user) return null;
    return {
      ...user,
      displayName: userProfile?.fullName ?? user.displayName,
      photoURL: userProfile?.photoURL ?? user.photoURL,
      email: userProfile?.email ?? user.email,
    } as User;
  }, [user, userProfile]);

  const value = useMemo(
    () => ({
      user: fullUser,
      loading,
      logout,
      auth,
      db,
    }),
    [fullUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
