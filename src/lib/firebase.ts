
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, updateProfile, type User, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
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

export const updateUserProfile = async (db: Firestore, userId: string, data: Partial<UserProfile>) => {
  const userDocRef = doc(db, `users/${userId}`);
  // Use setDoc with merge: true to create the document if it doesn't exist, or update it if it does.
  await setDoc(userDocRef, data, { merge: true });
};

const uploadProfilePhoto = async (userId: string, file: File): Promise<string> => {
    const storage = getStorage(app);
    const storageRef = ref(storage, `users/${userId}/profile-photo/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

export const updateUserProfileAndPhoto = async (
  user: User,
  db: Firestore,
  profileData: Partial<UserProfile>,
  photoFile: File | null
) => {
  // Data for Firestore update
  const firestoreUpdate: Partial<UserProfile> = { ...profileData };
  
  // Data for Auth profile update
  const authUpdate: { displayName?: string; photoURL?: string } = {};

  if (profileData.fullName) {
    authUpdate.displayName = profileData.fullName;
  }
  
  // If a new photo is provided, upload it and get the URL
  if (photoFile) {
    const newPhotoURL = await uploadProfilePhoto(user.uid, photoFile);
    firestoreUpdate.photoURL = newPhotoURL;
    authUpdate.photoURL = newPhotoURL;
  }

  // Perform updates only if there's something to update
  if (Object.keys(firestoreUpdate).length > 0) {
    const userDocRef = doc(db, `users/${user.uid}`);
    await setDoc(userDocRef, firestoreUpdate, { merge: true });
  }

  if (Object.keys(authUpdate).length > 0) {
    await updateProfile(user, authUpdate);
  }
};


export { app, auth, db };
