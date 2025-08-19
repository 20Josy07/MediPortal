

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, updateProfile, type User, GoogleAuthProvider, signInWithPopup, deleteUser, reauthenticateWithCredential, EmailAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, type Firestore, collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDoc, setDoc, writeBatch, enableMultiTabIndexedDbPersistence } from "firebase/firestore";
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
    
    // Habilitar la persistencia multi-pestaña
    enableMultiTabIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          console.warn(
            'La persistencia de Firestore multi-pestaña falló porque ya hay otra pestaña activa. Esto es normal.'
          );
        } else if (err.code == 'unimplemented') {
          console.warn(
            'El navegador actual no soporta la persistencia multi-pestaña de Firestore.'
          );
        }
      });

} else {
    console.error("Firebase config is missing, please check your .env file");
    // You might want to throw an error here or handle it gracefully
}


export const signInWithGoogle = async (auth: Auth, db: Firestore): Promise<User> => {
  const provider = new GoogleAuthProvider();
  provider.addScope('email');
  provider.addScope('profile');

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        validated: false, // Default to not validated
        createdAt: serverTimestamp(),
      });
    }
    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

export const addNote = async (db: Firestore, userId: string, patientId: string, noteData: Omit<Note, 'id'>): Promise<Note> => {
  const notesCollection = collection(db, `users/${userId}/patients/${patientId}/notes`);
  const docRef = await addDoc(notesCollection, {
    ...noteData,
    createdAt: serverTimestamp(),
    hasHistory: false,
  });
  return {
    id: docRef.id,
    ...noteData,
    createdAt: new Date(), // Return optimistic date
  };
};

export const updateNote = async (db: Firestore, userId: string, patientId: string, noteId: string, data: Partial<Omit<Note, 'id'>>) => {
  const batch = writeBatch(db);
  const noteDocRef = doc(db, `users/${userId}/patients/${patientId}/notes`, noteId);

  // 1. Get current note content before updating
  const noteSnapshot = await getDoc(noteDocRef);
  if (noteSnapshot.exists()) {
      const currentNote = noteSnapshot.data() as Note;

      // 2. Create a new version in the 'versions' subcollection
      const versionCollectionRef = collection(noteDocRef, 'versions');
      const newVersionRef = doc(versionCollectionRef); // Auto-generate ID
      
      batch.set(newVersionRef, {
          title: currentNote.title,
          content: currentNote.content,
          versionCreatedAt: currentNote.createdAt,
      });

      // 3. Update the main note document with new data and mark that it has history
      const updateData = { ...data, hasHistory: true };
      batch.update(noteDocRef, updateData);

  } else {
    // If for some reason the note doesn't exist, just update (which will create it if it doesn't exist with set)
     batch.update(noteDocRef, data);
  }

  // 4. Commit the batch
  await batch.commit();
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


export { app, auth, db, sendPasswordResetEmail };
