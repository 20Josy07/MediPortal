
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, updateProfile, type User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
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

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId
) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.error(
    "Firebase configuration is missing or incomplete. Make sure to set up your environment variables."
  );
}

export const signInWithGoogle = async (auth: Auth, db: Firestore): Promise<User> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      await setDoc(userDocRef, {
        fullName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
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


export { app, auth, db };
