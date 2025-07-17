import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { Note } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.error(
    "Firebase configuration is missing or incomplete. Make sure to set up your environment variables."
  );
}

export const addNote = async (db: Firestore, userId: string, noteData: Omit<Note, 'id'>): Promise<Note> => {
  const notesCollection = collection(db, `users/${userId}/notes`);
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

export { app, auth, db };
