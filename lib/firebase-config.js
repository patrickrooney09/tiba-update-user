// lib/firebase-config.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function logInitInfo(message, data = {}) {
  console.log(`[Firebase Init] ${message}`, {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    ...data,
  });
}

function logInitError(message, error = null) {
  console.error(`[Firebase Init Error] ${message}`, {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    error: error
      ? {
          code: error.code,
          message: error.message,
          stack: error.stack,
        }
      : null,
  });
}

// Safer initialization that works during both build and runtime
export function getFirebaseApp() {
  try {
    // Check for existing app first
    if (getApps().length > 0) {
      logInitInfo("Returning existing Firebase app");
      return getApps()[0];
    }

    // Only initialize in browser environment
    if (typeof window === "undefined") {
      logInitInfo("Skipping Firebase init - server environment");
      return null;
    }

    logInitInfo("Starting Firebase initialization");
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Validate config
    if (!firebaseConfig.apiKey) {
      logInitError("Missing Firebase configuration");
      return null;
    }

    // Initialize app
    try {
      const app = initializeApp(firebaseConfig);
      logInitInfo("Firebase initialized successfully", {
        projectId: firebaseConfig.projectId,
      });
      return app;
    } catch (error) {
      logInitError("Firebase initialization failed", error);
      return null;
    }
  } catch (error) {
    logInitError("Unexpected error during Firebase setup", error);
    return null;
  }
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
