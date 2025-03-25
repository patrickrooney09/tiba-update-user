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

    // Direct debug logging
    console.log("[Firebase Debug] Environment check starting...", {
      nodeEnv: process.env.NODE_ENV,
      windowDefined: typeof window !== "undefined",
    });

    // Check environment variables
    const envVarStatus = {
      NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
        !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
        !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Direct console logging for debugging
    console.log("[Firebase Debug] Environment variables status:", envVarStatus);

    const missingVars = Object.entries(envVarStatus)
      .filter(([_, exists]) => !exists)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      console.error("[Firebase Error] Missing environment variables:", {
        missing: missingVars,
        environment: process.env.NODE_ENV,
      });
      return null;
    }

    // Log successful environment check
    console.log("[Firebase Debug] All environment variables present");

    // Create Firebase config using actual env values
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Additional debug logging
    console.log("[Firebase Debug] Config created:", {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
      environment: process.env.NODE_ENV,
    });

    logInitInfo("Firebase configuration loaded", {
      hasConfig: Object.keys(firebaseConfig).every(
        (key) => !!firebaseConfig[key]
      ),
      projectId: firebaseConfig.projectId,
    });

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
