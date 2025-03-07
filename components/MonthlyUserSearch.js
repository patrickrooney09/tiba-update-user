"use client";

import { useState } from "react";

/**
 * Component for searching monthly users by ID
 */
export default function MonthlyUserSearch({ onUserFound }) {
  const [monthlyId, setMonthlyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!monthlyId.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/smartpark/monthly-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monthlyId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user details");
      }

      if (data.ListItems && data.ListItems.length > 0) {
        onUserFound(data.ListItems[0]);
      } else {
        setError("No user found with this ID");
      }
    } catch (error) {
      setError(error.message || "Error searching for user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <h2 className="card-title">Find Monthly User</h2>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSearch}
          className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter Monthly ID"
            className="input input-bordered flex-grow"
            value={monthlyId}
            onChange={(e) => setMonthlyId(e.target.value)}
            required
          />
          <button
            type="submit"
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>
    </div>
  );
}
