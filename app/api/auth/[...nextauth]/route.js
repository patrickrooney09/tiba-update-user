import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * NextAuth configuration that sets up a simple username/password authentication
 * In a production app, you would connect to a real user database
 */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In a production app, you would check against a database
        if (
          credentials.username === process.env.AUTH_USERNAME &&
          credentials.password === process.env.AUTH_PASSWORD
        ) {
          return {
            id: "1",
            name: credentials.username,
            email: `${credentials.username}@example.com`,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
