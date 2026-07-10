import { Link, useLocation } from "react-router-dom";

function Sidebar({ role }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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
          <Link className={`d-block mb-3 text-decoration-none ${isActive('/doctor-dashboard') ? 'text-info fw-bold' : 'text-white'}`} to="/doctor-dashboard">
            Dashboard
          </Link>
          <Link className={`d-block mb-3 text-decoration-none ${isActive('/patients') ? 'text-info fw-bold' : 'text-white'}`} to="/patients">
            Patients
          </Link>
          <Link className={`d-block mb-3 text-decoration-none ${isActive('/appointments') ? 'text-info fw-bold' : 'text-white'}`} to="/appointments">
            Appointments
          </Link>
          <Link className={`d-block mb-3 text-decoration-none ${isActive('/reports') ? 'text-info fw-bold' : 'text-white'}`} to="/reports">
            Reports
          </Link>
        </>
      ) : (
        <>
          <Link className={`d-block mb-3 text-decoration-none ${isActive('/patient-dashboard') ? 'text-info fw-bold' : 'text-white'}`} to="/patient-dashboard">
            Dashboard
          </Link>

          <Link className={`d-block mb-3 text-decoration-none ${isActive('/my-appointments') ? 'text-info fw-bold' : 'text-white'}`} to="/my-appointments">
            My Appointments
          </Link>

          <Link className={`d-block mb-3 text-decoration-none ${isActive('/medical-records') ? 'text-info fw-bold' : 'text-white'}`} to="/medical-records">
            Medical Records
          </Link>

          <Link className={`d-block mb-3 text-decoration-none ${isActive('/prescriptions') ? 'text-info fw-bold' : 'text-white'}`} to="/prescriptions">
            Prescriptions
          </Link>
        </>
      )}
    </div>
  );
}

export default Sidebar;