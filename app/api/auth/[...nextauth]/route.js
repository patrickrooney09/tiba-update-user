// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { getFirebaseAdminApp } from "@/lib/firebase-admin-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase-config";

// Initialize Firebase Admin once
getFirebaseAdminApp();

export const authOptions = {
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
          // Authenticate with Firebase
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );

          const user = userCredential.user;

          if (!user || !user.email) {
            return null;
          }

          // Return a user object that NextAuth can use
          return {
            id: user.uid,
            name: user.displayName || user.email.split("@")[0],
            email: user.email,
            image: user.photoURL,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    // You can add other providers like Google, GitHub, etc.
  ],
  adapter: FirestoreAdapter({
    // No need to pass any parameters with the latest version
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is defined, a sign in is happening and we can add custom fields
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
