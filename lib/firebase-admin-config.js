import { initializeApp, cert, getApps } from "firebase-admin/app";

export function getFirebaseAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0];
  }

  // Debug logging
  console.log("Firebase Admin Environment Variables:");
  console.log("Project ID:", process.env.FIREBASE_PROJECT_ID);
  console.log(
    "Client Email:",
    process.env.FIREBASE_CLIENT_EMAIL?.substring(0, 10) + "..."
  );
  console.log("Private Key exists:", !!process.env.FIREBASE_PRIVATE_KEY);

  if (
    !process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_CLIENT_EMAIL ||
    !process.env.FIREBASE_PRIVATE_KEY
  ) {
    throw new Error(
      "Missing required Firebase Admin configuration. Please check environment variables."
    );
  }

  try {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
}
