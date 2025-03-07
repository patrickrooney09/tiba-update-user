"use client";

import { useState, useEffect } from "react";

/**
 * Component for editing monthly user profiles
 */
export default function UserProfileForm({ user, onUpdateSuccess }) {
  const [accessProfiles, setAccessProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [carPlates, setCarPlates] = useState(["", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load access profiles on component mount
  useEffect(() => {
    const fetchAccessProfiles = async () => {
      try {
        const response = await fetch("/api/smartpark/access-profiles");
        const data = await response.json();

        if (data.ListItems) {
          setAccessProfiles(data.ListItems);
        }
      } catch (error) {
        console.error("Error fetching access profiles:", error);
        setError("Failed to load access profiles");
      }
    };

    fetchAccessProfiles();
  }, []);

  // Initialize form values when user data changes
  useEffect(() => {
    if (user) {
      // Set initial car plates from user data
      const plates = [
        user.CarPlate1 || "",
        user.CarPlate2 || "",
        user.CarPlate3 || "",
        user.CarPlate4 || "",
        user.CarPlate5 || "",
      ];
      setCarPlates(plates);

      // Set initial selected profile
      setSelectedProfile(user.AccessProfileNum);
    }
  }, [user]);

  const validatePlate = (plate) => {
    // Only allow uppercase letters and numbers, no spaces or dashes
    return /^[A-Z0-9]*$/.test(plate);
  };

  const handlePlateChange = (index, value) => {
    // Convert to uppercase
    const upperValue = value.toUpperCase();

    if (validatePlate(upperValue) || upperValue === "") {
      const newPlates = [...carPlates];
      newPlates[index] = upperValue;
      setCarPlates(newPlates);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare update data
      const updateData = {
        MonthlyID: user.MonthlyID,
        MonthlyDBID: user.MonthlyDBID,
        CompanyID: user.CompanyID,
        SubCompanyID: user.SubCompanyID || "",
        FirstName: user.FirstName,
        LastName: user.LastName,
        IDNum: user.IDNum,
        Badge: user.Badge,
        ValidFrom: user.ValidFromStr,
        ValidTo: user.ValidToStr,
        MType: user.MType,
        CategoryID: user.CategoryID,
        RateID: user.RateID,
        AccessProfileNum: selectedProfile,
        LoopFlag: user.LoopFlag === "1",
        PayOnExit: user.PayOnExit === "1",
        PassBackFlag: user.PassBackFlag === "1",
        WalletBalance: user.WalletBalance,
        Cars: carPlates
          .filter((plate) => plate.trim() !== "")
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
        Badge1: user.Badge1 || 0,
        Badge2: user.Badge2 || 0,
        Badge3: user.Badge3 || 0,
        Badge4: user.Badge4 || 0,
        QR: user.QR || "",
        Mobile: user.Mobile || "",
        AddUnits: user.AddUnits || 0,
        MonthlyPrice: user.MonthlyPrice || 0,
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
        throw new Error(data.error || "Failed to update user");
      }

      setSuccess("User updated successfully");

      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      setError(error.message || "Error updating user profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Update Profile</h2>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-bold">Access Profile</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedProfile || ""}
              onChange={(e) => setSelectedProfile(Number(e.target.value))}
              required>
              <option value="" disabled>
                Select access profile
              </option>
              {accessProfiles.map((profile) => (
                <option key={profile.AccessProfileID} value={profile.Num}>
                  {profile.Description}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="label">
              <span className="label-text font-bold">License Plates</span>
              <span className="label-text-alt">
                Uppercase letters & numbers only
              </span>
            </label>

            <div className="space-y-2">
              {carPlates.map((plate, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`License Plate ${index + 1}`}
                  className="input input-bordered w-full"
                  value={plate}
                  onChange={(e) => handlePlateChange(index, e.target.value)}
                  maxLength={10}
                />
              ))}
            </div>
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
