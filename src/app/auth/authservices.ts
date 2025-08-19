
import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signInWithGoogleAndCalendar = async () => {
    try {
        if (!auth || !db) {
            throw new Error("Firebase no está inicializado.");
        }

        const provider = new GoogleAuthProvider();
        // Solicitar acceso offline para obtener un refresh_token
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
            
            // Construir el objeto de tokens, asegurándose de que todos los campos relevantes estén allí.
            const googleTokens = {
                access_token: credential.accessToken,
                refresh_token: (credential as any).refreshToken, // El refresh_token puede no estar siempre presente
                scope: (credential as any).scope,
                token_type: (credential as any).tokenType,
                // expiry_date se calcula a partir de expiresIn
                expiry_date: Date.now() + ((credential as any).expiresIn * 1000)
            };

            const dataToSet = {
                fullName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                googleTokens: googleTokens, // Guardar el token de acceso
                googleAccessToken: credential.accessToken, // Para compatibilidad con la comprobación del botón
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
