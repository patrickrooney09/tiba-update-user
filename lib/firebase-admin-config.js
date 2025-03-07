import { initializeApp, cert, getApps } from "firebase-admin/app";

export function getFirebaseAdminApp() {
  // Skip initialization during build time
  if (process.env.GOOGLE_NODE_RUN_SCRIPTS === "") {
    console.log("Skipping Firebase Admin initialization during build");
    return null;
  }

  try {
    const apps = getApps();
    if (apps.length > 0) {
      return apps[0];
    }

    // Debug logging
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Firebase Admin Environment Variables:");
    console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
    console.log(
      "Client Email:",
      process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 10) + "..."
    );
    console.log("Private Key exists:", !!process.env.FIREBASE_PRIVATE_KEY);

    // Validate configuration
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      throw new Error("Missing Firebase Admin configuration");
    }

    // Initialize the app
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });

    // Verify initialization
    if (!app) {
      throw new Error("Firebase Admin initialization failed");
    }

    return app;
  } catch (error) {
    console.error("Firebase Admin initialization error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    // In production, we should throw the error to prevent silent failures
    if (process.env.NODE_ENV === "production") {
      throw error;
    }
    return null;
  }
}
