import { auth, db } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events.readonly');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

export const signInWithGoogleAndCalendar = async () => {
    try {
        if (!auth || !db) {
            throw new Error("Firebase no está inicializado.");
        }

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const accessToken = credential?.accessToken;

        if (user && accessToken) {
            const userDocRef = doc(db, 'users', user.uid);
            // Guardamos o actualizamos el token de acceso en el perfil del usuario.
            await setDoc(userDocRef, { googleAccessToken: accessToken }, { merge: true });
            
            // Verificamos si es un nuevo usuario para almacenar información adicional
            const additionalInfo = getAdditionalUserInfo(result);
            if (additionalInfo?.isNewUser) {
                await setDoc(userDocRef, {
                    fullName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                }, { merge: true });
            }
        }

        console.log("Inicio de sesión con Google y Calendar exitoso.");
        return { user, accessToken };

    } catch (error) {
        console.error("Error al iniciar sesión con Google y Calendar:", error);
        throw error;
    }
};
