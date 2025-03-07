// lib/firebase-config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Safer initialization that works during both build and runtime
export function getFirebaseApp() {
  // Only initialize if we have the required config and haven't already initialized
  if (getApps().length === 0 && typeof window !== "undefined") {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Only initialize with complete config
    if (firebaseConfig.apiKey) {
      return initializeApp(firebaseConfig);
    }
  }

  // Return existing app or null during build
  return getApps()[0] || null;
}

// Lazy-loaded auth that only works at runtime
export function getFirebaseAuth() {
  const app = getFirebaseApp();
  return app ? getAuth(app) : null;
}

export function getFirebaseDb() {
  const app = getFirebaseApp();
  return app ? getFirestore(app) : null;
}

// These will be null during build time and populated at runtime
export const auth = typeof window === "undefined" ? null : getFirebaseAuth();
export const db = typeof window === "undefined" ? null : getFirebaseDb();
