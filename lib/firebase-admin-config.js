import { initializeApp, cert, getApps } from "firebase-admin/app";

let app = null;

export function getFirebaseAdminApp() {
  // Return existing app instance if available
  if (app) {
    return app;
  }

  try {
    // Check for existing Firebase apps
    const apps = getApps();
    if (apps.length > 0) {
      app = apps[0];
      return app;
    }

    // Initialize only if we have all required config
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Process the private key to handle escaped newlines
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
      });
      return app;
    }

    console.warn("Missing Firebase Admin configuration");
    return null;
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    return null;
  }
}
