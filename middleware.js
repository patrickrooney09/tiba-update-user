import { withAuth } from "next-auth/middleware";

/**
 * Middleware to protect routes that require authentication
 */
export default withAuth({
  pages: {
    signIn: "/",
  },
});

// Specify which routes should be protected
export const config = {
  matcher: ["/dashboard/:path*"],
};
