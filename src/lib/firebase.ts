
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, updateProfile, type User, GoogleAuthProvider, signInWithPopup, deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getFirestore, type Firestore, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDoc, setDoc } from "firebase/firestore";
import type { Note, UserProfile } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    console.error("Firebase config is missing, please check your .env file");
    // You might want to throw an error here or handle it gracefully
}


export const signInWithGoogle = async (auth: Auth, db: Firestore): Promise<User> => {
  console.log("Iniciando proceso de autenticación con Google...");
  const provider = new GoogleAuthProvider();

  // Scopes necesarios
  provider.addScope("email");
  provider.addScope("profile");
  provider.addScope("https://www.googleapis.com/auth/calendar");
  provider.addScope("https://www.googleapis.com/auth/calendar.events");

  // Nota: access_type=offline + prompt=consent NO garantiza refresh token en cliente
  provider.setCustomParameters({
    access_type: "offline",
    prompt: "consent",
  });

  try {
    console.log("Abriendo ventana de autenticación...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    console.log("Usuario autenticado:", {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    });

    // Credenciales de Google (cliente)
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken ?? null;
    const idToken = credential?.idToken ?? null;

    // Firebase maneja internamente el refresh token del usuario en cliente.
    // Si lo necesitas (no recomendado), está en user.refreshToken (prop interna/no estable).
    const refreshToken = result.user?.refreshToken ?? null;

    console.log("Tokens obtenidos:", {
      accessToken: accessToken ? "✅ Token de acceso recibido" : "❌ Sin accessToken",
      idToken: idToken ? "✅ ID token recibido" : "❌ Sin idToken",
      refreshToken: refreshToken ? "⚠️ refreshToken (cliente)" : "—",
    });

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    const baseData = {
      fullName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    };

    if (!docSnap.exists()) {
      console.log("Usuario no existe en Firestore, creando documento...");
      await setDoc(userDocRef, {
        ...baseData,
        validated: false,
        // Guarda tokens SOLO si realmente los usas en cliente (no recomendado persistir tokens sensibles)
        calendarAccessToken: accessToken,
        // Evita guardar refresh tokens del cliente; si insistes, entiende el riesgo:
        // calendarRefreshToken: refreshToken,
        createdAt: serverTimestamp(),
      });
      console.log("Documento de usuario creado en Firestore");
    } else {
      console.log("Usuario encontrado en Firestore, actualizando tokens...");
      await updateDoc(userDocRef, {
        // Actualiza solo lo necesario
        calendarAccessToken: accessToken,
        // calendarRefreshToken: refreshToken,
      });
      console.log("Tokens actualizados en Firestore");
    }

    console.log("Proceso de autenticación completado con éxito");
    return user;
  } catch (error) {
    console.error("❌ Error durante el inicio de sesión con Google:", { errorDetails: error });
    throw error;
  }
};

export const addNote = async (db: Firestore, userId: string, patientId: string, noteData: Omit<Note, 'id'>): Promise<Note> => {
  const notesCollection = collection(db, `users/${userId}/patients/${patientId}/notes`);
  const docRef = await addDoc(notesCollection, {
    ...noteData,
    createdAt: serverTimestamp(),
  });
  return {
    id: docRef.id,
    ...noteData,
    createdAt: new Date(), // Return optimistic date
  };
};

export const updateNote = async (db: Firestore, userId: string, patientId: string, noteId: string, data: Partial<Omit<Note, 'id'>>) => {
  const noteDoc = doc(db, `users/${userId}/patients/${patientId}/notes`, noteId);
  await updateDoc(noteDoc, data);
};

export const deleteNote = async (db: Firestore, userId: string, patientId: string, noteId: string) => {
  const noteDoc = doc(db, `users/${userId}/patients/${patientId}/notes`, noteId);
  await deleteDoc(noteDoc);
};

export const getUserProfile = async (db: Firestore, userId: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, `users/${userId}`);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  user: User,
  db: Firestore,
  profileData: Partial<UserProfile>
) => {
  // 1. Prepare the data for Firestore.
  // This can include the long Data URL for the photo.
  const firestoreData = { ...profileData };
  const userDocRef = doc(db, `users/${user.uid}`);
  await setDoc(userDocRef, firestoreData, { merge: true });

  // 2. Prepare the data for Firebase Auth profile update.
  // IMPORTANT: Do NOT include the photoURL if it's a long Data URL.
  // Firebase Auth has a length limit on photoURL.
  const authUpdate: { displayName?: string } = {};
  if (profileData.fullName && profileData.fullName !== user.displayName) {
    authUpdate.displayName = profileData.fullName;
  }

  // 3. Update Auth profile only if there are changes.
  if (Object.keys(authUpdate).length > 0) {
    await updateProfile(user, authUpdate);
  }
};

export const deleteUserAccount = async (user: User) => {
  try {
    await deleteUser(user);
  } catch (error: any) {
    console.error("Error al eliminar la cuenta del usuario:", error);
    if (error.code === 'auth/requires-recent-login') {
        const password = prompt("Por seguridad, por favor, introduce tu contraseña para confirmar:");
        if (password && user.email) {
            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(user, credential);
            // Retry deletion
            await deleteUser(user);
        } else {
             throw new Error("Contraseña no proporcionada o email no disponible.");
        }
    } else {
        throw error;
    }
  }
};


export { app, auth, db };
