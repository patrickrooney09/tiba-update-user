// lib/firebase-admin-config.js
import { initializeApp, cert, getApps } from "firebase-admin/app";

export function getFirebaseAdminApp() {
  // Check if we're in a build/bundling process
  const isBuildProcess =
    process.env.NODE_ENV === "production" &&
    typeof process.env.FIREBASE_PROJECT_ID === "undefined";

  // If it's the build process, skip initialization
  if (isBuildProcess) {
    console.log("Build process detected, skipping Firebase initialization");
    return null;
  }

  // Only run on the server
  if (typeof window !== "undefined") {
    return null;
  }

  // Only initialize if needed and credentials are available
  if (getApps().length === 0) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      );

      // If credentials are missing, assume we're in build process
      if (!projectId || !clientEmail || !privateKey) {
        console.log("Firebase credentials not found, skipping initialization");
        return null;
      }

      return initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
    } catch (error) {
      console.error("Firebase admin initialization error:", error);
      return null;
    }
  }

  return getApps()[0];
}
