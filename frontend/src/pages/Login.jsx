import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("patient");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (
        response.data.user.role ===
        "admin"
      ) {
        navigate("/admin-dashboard");
      }
      else if (
        response.data.user.role ===
        "doctor"
      ) {
        navigate("/doctor-dashboard");
      }
      else {
        navigate("/patient-dashboard");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #0d6efd, #20c997)",
      }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div
            className="card border-0 shadow-lg p-4"
            style={{ borderRadius: "20px" }}
          >
            <div className="text-center mb-4">
              <h1>🏥</h1>
              <h2 className="fw-bold">Saanvi HMS</h2>
              <p className="text-muted">
                Hospital Management System
              </p>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                className={`btn ${role === "doctor"
                    ? "btn-primary"
                    : "btn-outline-primary"
                  } flex-fill`}
                onClick={() => setRole("doctor")}
              >
                👨‍⚕️ Doctor
              </button>

              <button
                type="button"
                className={`btn ${role === "patient"
                    ? "btn-success"
                    : "btn-outline-success"
                  } flex-fill`}
                onClick={() => setRole("patient")}
              >
                🧑 Patient
              </button>
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
                className="btn btn-dark w-100"
                type="submit"
              >
                Login
              </button>
            </form>

            {role === "patient" && (
              <p className="text-center mt-4">
                Don't have an account?{" "}
                <Link to="/register">
                  Register
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;