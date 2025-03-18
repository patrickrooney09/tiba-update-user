"use client";

import { useState, useEffect } from "react";

export default function ApplyDiscount({ user, onUpdate }) {
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-hide success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleDiscountChange = (amount) => {
    const newAmount = discountAmount + amount;
    if (newAmount >= 0 && newAmount <= 20) {
      setDiscountAmount(newAmount);
      // Clear any existing error/success messages when changing amount
      setError("");
      setSuccess("");
    }
  };

  const handleApplyDiscount = async () => {
    if (discountAmount > 0) {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        // Store the amount we're adding for later use
        const amountToAdd = discountAmount;
        // Reset discount amount immediately to prevent double-updates
        setDiscountAmount(0);
        setShowConfirm(false);

        // Convert dollar amount to cents for the API (1 dollar = 100 cents)
        const amountInCents = Math.round(amountToAdd * 100);

        // Prepare update data with all required fields
        const updateData = {
          MonthlyID: user.MonthlyID,
          MonthlyDBID: user.MonthlyDBID,
          CompanyID: user.CompanyID,
          SubCompanyID: user.SubCompanyID || "",
          FirstName: user.FirstName,
          LastName: user.LastName,
          IDNum: user.IDNum,
          Badge: parseInt(user.Badge || 0),
          ValidFrom: user.ValidFromStr,
          ValidTo: user.ValidToStr,
          MType: parseInt(user.MType || 0),
          CategoryID: parseInt(user.CategoryID || 0),
          RateID: parseInt(user.RateID || 0),
          AccessProfileNum: parseInt(user.AccessProfileNum || 0),
          LoopFlag: Boolean(user.LoopFlag === "1"),
          PayOnExit: Boolean(user.PayOnExit === "1"),
          PassBackFlag: Boolean(user.PassBackFlag === "1"),
          WalletBalance: amountInCents,
          Cars: [
            user.CarPlate1,
            user.CarPlate2,
            user.CarPlate3,
            user.CarPlate4,
            user.CarPlate5,
          ]
            .filter((plate) => plate && plate.trim() !== "")
            .map((plate) => ({
              PlateID: plate,
              ModelDescription: "",
              ColorDescription: "",
              ModelID: 0,
              ColorID: 0,
            })),
          IntsertIfNotFound: false,
          InsertIfNotFound: false,
          UpdateBalanceMethod: "Update",
          Badge1: parseInt(user.Badge1 || 0),
          Badge2: parseInt(user.Badge2 || 0),
          Badge3: parseInt(user.Badge3 || 0),
          Badge4: parseInt(user.Badge4 || 0),
          QR: user.QR || "",
          Mobile: user.Mobile || "",
          AddUnits: parseInt(user.AddUnits || 0),
          MonthlyPrice: parseFloat(user.MonthlyPrice || 0),
        };

        const response = await fetch("/api/smartpark/update-monthly", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to apply discount");
        }

        // Show success message with the amount we stored earlier
        setSuccess(`Successfully added $${amountToAdd} to wallet balance!`);
        if (onUpdate) onUpdate();
      } catch (error) {
        setError(error.message || "Error applying discount");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <h2 className="card-title">Apply Discount</h2>

        {error && (
          <div className="alert alert-error mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <div className="form-control mt-4 p-4 bg-base-200 rounded-lg">
          <div className="flex items-center gap-4 my-2">
            <button
              className="btn btn-circle btn-lg text-2xl"
              onClick={() => handleDiscountChange(-1)}
              disabled={discountAmount <= 0 || loading}>
              -
            </button>
            <span className="text-2xl font-bold min-w-[4rem] text-center">
              ${discountAmount}
            </span>
            <button
              className="btn btn-circle btn-lg text-2xl"
              onClick={() => handleDiscountChange(1)}
              disabled={discountAmount >= 20 || loading}>
              +
            </button>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Current Wallet Balance: $
            {(Math.round(Number(user.WalletBalance || 0)) / 100).toFixed(2)}
          </div>
          <button
            className={`btn btn-primary mt-4 ${loading ? "loading" : ""}`}
            onClick={() => {
              setError("");
              setSuccess("");
              setShowConfirm(true);
            }}
            disabled={discountAmount === 0 || loading}>
            {loading ? "Applying..." : "Apply Discount"}
          </button>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Confirm Discount</h3>
              <p className="py-4">
                Are you sure you want to apply ${discountAmount} discount? This
                will add ${discountAmount} to their wallet balance.
              </p>
              <div className="modal-action">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowConfirm(false);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={loading}>
                  Cancel
                </button>
                <button
                  className={`btn btn-primary ${loading ? "loading" : ""}`}
                  onClick={handleApplyDiscount}
                  disabled={loading}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
