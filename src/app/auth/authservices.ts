import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');

export const signInWithGoogleAndCalendar = async () => {
    try {
        const result = await signInWithPopup(auth!, provider);
        const user = result.user;
        
        // Obtener el token de Google OAuth
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        const oauthToken = await user.getIdToken();
        
        // Guardar el token de OAuth
        if (oauthToken) {
            localStorage.setItem('googleOAuthToken', oauthToken);
        }

        console.log("Inicio de sesión exitoso con permisos de Calendar");
        return { 
            user, 
            accessToken: oauthToken 
        };

    } catch (error) {
        console.error("Error al iniciar sesión con Google y Calendar:", error);
        throw error;
    }
};