"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "../lib/firebase-config";

/**
 * Login form component using DaisyUI
 */
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Smart Park Monthly User Management
          </h2>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          {successMessage && (
            <div className="alert alert-success mt-4">
              <span>{successMessage}</span>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              type="button"
              className={`link link-hover text-sm ${
                loading ? "opacity-50" : ""
              }`}
              disabled={loading}
              onClick={async () => {
                try {
                  setError("");
                  setSuccessMessage("");
                  setLoading(true);

                  console.log(
                    "[Password Reset] Starting password reset process"
                  );

                  if (!email) {
                    setError("Please enter your email address first");
                    return;
                  }

                  console.log("[Password Reset] Initializing Firebase auth");
                  const auth = getFirebaseAuth();

                  if (!auth) {
                    console.error(
                      "[Password Reset] Firebase auth initialization failed"
                    );
                    setError(
                      "Authentication service is not available. Please try again later."
                    );
                    return;
                  }

                  console.log("[Password Reset] Sending reset email");
                  await sendPasswordResetEmail(auth, email);
                  console.log("[Password Reset] Reset email sent successfully");

                  setSuccessMessage(
                    "Password reset email sent! Please check your inbox."
                  );
                } catch (error) {
                  console.error("[Password Reset] Error:", {
                    code: error.code,
                    message: error.message,
                    stack: error.stack,
                  });

                  // Handle specific Firebase auth errors
                  switch (error.code) {
                    case "auth/user-not-found":
                      setError("No account exists with this email address.");
                      break;
                    case "auth/invalid-email":
                      setError("Please enter a valid email address.");
                      break;
                    case "auth/network-request-failed":
                      setError(
                        "Network error. Please check your connection and try again."
                      );
                      break;
                    case "auth/too-many-requests":
                      setError("Too many attempts. Please try again later.");
                      break;
                    default:
                      setError(
                        `Failed to send reset email: ${
                          error.message || "Unknown error"
                        }`
                      );
                  }
                } finally {
                  setLoading(false);
                }
              }}>
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
