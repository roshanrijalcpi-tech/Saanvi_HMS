import { useNavigate } from "react-router-dom";

function Navbar({ role }) {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <span className="navbar-brand">
        🏥 Saanvi HMS - {role}
      </span>

      <button
        className="btn btn-light"
        onClick={logout}
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;