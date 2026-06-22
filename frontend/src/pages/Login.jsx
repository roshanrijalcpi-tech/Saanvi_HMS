import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";   // ← Added

function Login() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();   // ← Global Theme

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login Successful!");

      // Role-based redirection
      const role = response.data.user.role;
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`container-fluid min-vh-100 d-flex align-items-center justify-content-center ${
        isDarkMode ? "bg-dark" : ""
      }`}
      style={{
        background: isDarkMode
          ? "linear-gradient(135deg, #0f172a, #1e2937)"
          : "linear-gradient(135deg, #0d6efd, #20c997)",
      }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "20px" }}
          >
            {/* Global Dark Mode Toggle */}
            <div className="d-flex justify-content-end mb-3">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={toggleTheme}
              >
                {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>

            <div className="text-center mb-4">
              <h1>🩺</h1>
              <h2 className="fw-bold">Saanvi</h2>
              <p className="text-muted">Hospital Management System</p>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                className="form-control mb-3"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="form-control mb-3"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                className="btn btn-dark w-100 py-2 fw-medium"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;