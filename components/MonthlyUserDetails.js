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
        </div>
      </div>
    </div>
  );
}
