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
              className="link link-hover text-sm"
              onClick={async () => {
                try {
                  setError("");
                  setSuccessMessage("");
                  if (!email) {
                    setError("Please enter your email address first");
                    return;
                  }
                  const auth = getFirebaseAuth();
                  await sendPasswordResetEmail(auth, email);
                  setSuccessMessage(
                    "Password reset email sent! Please check your inbox."
                  );
                } catch (error) {
                  setError(
                    "Failed to send password reset email. Please try again."
                  );
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
