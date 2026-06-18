import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] =
    useState("patient");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
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
        "http://localhost:5000/api/auth/register",
        {
          fullname: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: selectedRole,
        }
      );

      alert(response.data.message);

      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #20c997, #0d6efd)",
      }}
    >
      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div
            className="card border-0 shadow-lg p-4"
            style={{
              borderRadius: "20px",
            }}
          >
            <div className="text-center mb-4">
              <h1>🏥</h1>

              <h2 className="fw-bold">
                {selectedRole === "doctor"
                  ? "Doctor Registration"
                  : "Patient Registration"}
              </h2>

              <p className="text-muted">
                Create your Saanvi HMS account
              </p>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                className={`btn ${
                  selectedRole === "doctor"
                    ? "btn-primary"
                    : "btn-outline-primary"
                } flex-fill`}
                onClick={() =>
                  setSelectedRole("doctor")
                }
              >
                👨‍⚕️ Doctor
              </button>

              <button
                type="button"
                className={`btn ${
                  selectedRole === "patient"
                    ? "btn-success"
                    : "btn-outline-success"
                } flex-fill`}
                onClick={() =>
                  setSelectedRole("patient")
                }
              >
                🧑 Patient
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="fullName"
                className="form-control mb-3"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                className="form-control mb-3"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="phone"
                className="form-control mb-3"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                className="form-control mb-4"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className={`btn w-100 py-2 ${
                  selectedRole === "doctor"
                    ? "btn-primary"
                    : "btn-success"
                }`}
              >
                Register as{" "}
                {selectedRole === "doctor"
                  ? "Doctor"
                  : "Patient"}
              </button>
            </form>

            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;