import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { getFirebaseAdminApp } from "@/lib/firebase-admin-config";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin first
const adminApp = getFirebaseAdminApp();

// Create the auth options configuration
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Firebase",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use Firebase Admin to verify the email/password
          const auth = getAuth(adminApp);
          const userRecord = await auth.getUserByEmail(credentials.email);

          if (!userRecord || !userRecord.email) {
            return null;
          }

          return {
            id: userRecord.uid,
            name: userRecord.displayName || userRecord.email.split("@")[0],
            email: userRecord.email,
            image: userRecord.photoURL,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter(),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

// Create and export the route handlers
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
