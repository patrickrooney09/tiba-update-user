"use client";

/**
 * Component to display monthly user details
 */
export default function MonthlyUserDetails({ user }) {
  if (!user) return null;

  return (
    <div className="card bg-base-100 shadow-lg mb-6">
      <div className="card-body">
        <h2 className="card-title">User Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Monthly ID</span>
            </label>
            <p>{user.MonthlyID}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Name</span>
            </label>
            <p>{`${user.FirstName} ${user.LastName}`}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">ID Number</span>
            </label>
            <p>{user.IDNum}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">
                Current Access Profile
              </span>
            </label>
            <p>{user.AccessProfileDescription}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Valid From</span>
            </label>
            <p>{user.ValidFromStr}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Valid To</span>
            </label>
            <p>{user.ValidToStr}</p>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">Wallet Balance</span>
            </label>
            <p>
              ${(Math.round(Number(user.WalletBalance || 0)) / 100).toFixed(2)}
            </p>
          </div>

          <div className="form-control col-span-full">
            <label className="label">
              <span className="label-text font-bold">License Plates</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const licensePlates = [
                  user.CarPlate1,
                  user.CarPlate2,
                  user.CarPlate3,
                  user.CarPlate4,
                  user.CarPlate5,
                ].filter((plate) => plate && plate.trim() !== "");

                return licensePlates.length > 0 ? (
                  licensePlates.map((plate, index) => (
                    <span key={index} className="badge badge-neutral">
                      {plate}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">
                    No license plates registered
                  </span>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
