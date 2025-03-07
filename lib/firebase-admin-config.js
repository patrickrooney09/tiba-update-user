// lib/firebase-admin-config.js
import { initializeApp, cert, getApps } from "firebase-admin/app";

// Initialize Firebase Admin
const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

export function getFirebaseAdminApp() {
  if (getApps().length === 0) {
    return initializeApp(firebaseAdminConfig);
  }
  return getApps()[0];
}
