
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { signIn } from "next-auth/react";

export const signInWithGoogleAndCalendar = async () => {
    try {
        // This will trigger the NextAuth.js Google provider flow,
        // which is configured server-side to get the refresh_token.
        await signIn("google", {
            callbackUrl: "/dashboard/sessions", // Redirect back to sessions after login
        });

    } catch (error) {
        console.error("Error initiating Google sign-in:", error);
        throw error;
    }
};
