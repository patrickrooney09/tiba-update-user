import { initializeApp, cert, getApps } from "firebase-admin/app";

export function getFirebaseAdminApp() {
  // Skip initialization during build time
  if (
    process.env.NODE_ENV === "development" ||
    process.env.GOOGLE_NODE_RUN_SCRIPTS === ""
  ) {
    console.log("Skipping Firebase Admin initialization during build");
    return null;
  }

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

  // Continue with initialization only at runtime
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
    // Return null instead of throwing during build
    return null;
  }
}
