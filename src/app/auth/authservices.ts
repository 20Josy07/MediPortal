
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getGoogleAuthUrl } from "@/lib/google";


export const handleGoogleSignIn = async () => {
    const authUrl = getGoogleAuthUrl();
    window.location.href = authUrl;
};

export const signInWithGoogleAndCalendar = async () => {
    try {
        if (!auth || !db) {
            throw new Error("Firebase no está inicializado.");
        }

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            const dataToSet = {
                fullName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
            };
            await setDoc(userDocRef, dataToSet, { merge: true });
        }

        console.log("Inicio de sesión con Google exitoso.");
        return { user };

    } catch (error) {
        console.error("Error al iniciar sesión con Google:", error);
        throw error;
    }
};
