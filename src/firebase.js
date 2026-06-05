import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Only initialize Firebase if configuration variables are present (we use VITE_FIREBASE_PROJECT_ID as our test)
const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_PROJECT_ID;

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const db = isFirebaseConfigured ? getFirestore(app) : null;
const auth = isFirebaseConfigured ? getAuth(app) : null;

export { db, auth, isFirebaseConfigured };
