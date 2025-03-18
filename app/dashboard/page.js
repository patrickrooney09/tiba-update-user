"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase-config";
import MonthlyUserSearch from "@/components/MonthlyUserSearch";
import MonthlyUserDetails from "@/components/MonthlyUserDetails";
import UserProfileForm from "@/components/UserProfileForm";
import ApplyDiscount from "@/components/ApplyDiscount";
/**
 * Dashboard page with user search and profile editing functionality
 */
export default function Dashboard() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);
  const [resetSent, setResetSent] = useState(false);
  const handlePasswordReset = async () => {
    try {
      const auth = getFirebaseAuth();
      if (auth && session?.user?.email) {
        await sendPasswordResetEmail(auth, session.user.email);
        setResetSent(true);
        // Reset the notification after 5 seconds
        setTimeout(() => setResetSent(false), 5000);
      }
    } catch (error) {
      console.error("Error sending password reset email:", error);
    }
  };

  const handleUserFound = (userData) => {
    setUser(userData);
  };

  const handleUpdateSuccess = () => {
    // Refresh user data after successful update with a slight delay
    if (user && user.MonthlyID) {
      // Add a small delay to ensure the update has propagated
      setTimeout(() => {
        fetch("/api/smartpark/monthly-details", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ monthlyId: user.MonthlyID }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch updated user data");
            }
            return response.json();
          })
          .then((data) => {
            if (data.ListItems && data.ListItems.length > 0) {
              const updatedUser = data.ListItems[0];
              // Ensure wallet balance is a valid number
              if (typeof updatedUser.WalletBalance === "number") {
                setUser(updatedUser);
              } else {
                console.error(
                  "Invalid wallet balance in response:",
                  updatedUser.WalletBalance
                );
              }
            }
          })
          .catch((error) => {
            console.error("Error refreshing user data:", error);
          });
      }, 1000); // 1 second delay
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-md">
        <div className="flex-1">
          <a className="btn  normal-case text-xl text-base-content hover:bg-base-300">
            Smart Park Monthly User Management
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-primary btn-circle avatar placeholder hover:bg-base-300">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <span>{session?.user?.name?.charAt(0) || "U"}</span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              {resetSent && (
                <li className="text-success text-sm p-2">
                  Password reset email sent!
                </li>
              )}
              <li>
                <a
                  className="text-base-content hover:bg-base-300"
                  onClick={handlePasswordReset}>
                  Reset Password
                </a>
              </li>
              <li>
                <a
                  className="text-base-content hover:bg-base-300"
                  onClick={() => signOut()}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <MonthlyUserSearch onUserFound={handleUserFound} />

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MonthlyUserDetails user={user} />
              <ApplyDiscount user={user} onUpdate={handleUpdateSuccess} />
            </div>
            <div>
              <UserProfileForm
                user={user}
                onUpdateSuccess={handleUpdateSuccess}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
