import { Link } from "react-router-dom";

function Sidebar({ role }) {
  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      <h5 className="mb-4">Menu</h5>

      {role === "Doctor" ? (
        <>
          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/doctor-dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patients"
          >
            Patients
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/appointments"
          >
            Appointments
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/reports"
          >
            Reports
          </Link>
        </>
      ) : (
        <>
          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/patient-dashboard"
          >
            Dashboard
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/my-appointments"
          >
            My Appointments
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/medical-records"
          >
            Medical Records
          </Link>

          <Link
            className="d-block text-white mb-3 text-decoration-none"
            to="/prescriptions"
          >
            Prescriptions
          </Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;