
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signInWithGoogleAndCalendar = async () => {
    try {
        if (!auth || !db) {
            throw new Error("Firebase no está inicializado.");
        }

        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/calendar.events');
        provider.setCustomParameters({
            access_type: 'offline',
            prompt: 'consent' 
        });

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        if (user && credential) {
            const userDocRef = doc(db, 'users', user.uid);
            const userDocSnap = await getDoc(userDocRef);
            const existingTokens = userDocSnap.exists() ? userDocSnap.data()?.googleTokens : {};

            const tokensToSave = {
              access_token: credential.accessToken,
              // Conserva el refresh_token existente si no se proporciona uno nuevo
              refresh_token: (credential as any).refreshToken || existingTokens?.refresh_token,
              scope: (credential as any).scope,
              token_type: (credential as any).tokenType,
              expiry_date: Date.now() + ((credential as any).expiresIn * 1000)
            };
            
            console.log("Tokens a guardar:", tokensToSave);

            const dataToSet = {
                fullName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                googleTokens: tokensToSave,
                googleAccessToken: credential.accessToken,
            };
            
            await setDoc(userDocRef, dataToSet, { merge: true });
        }

        console.log("Inicio de sesión con Google y vinculación de calendario exitosos.");
        return { user };

    } catch (error) {
        console.error("Error al iniciar sesión con Google y vincular calendario:", error);
        throw error;
    }
};
