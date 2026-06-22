import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function Register() {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [selectedRole, setSelectedRole] = useState("patient");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const specializations = [
    "Cardiologist", "Neurologist", "Orthopedic", "Pediatrician",
    "Gynecologist", "Dermatologist", "Physician", "Surgeon",
    "ENT Specialist", "Ophthalmologist", "Psychiatrist", "General Practitioner"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        fullname: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole,
        specialization: selectedRole === "doctor" ? formData.specialization : null
      });

      toast.success("Registration Successful!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container-fluid min-vh-100 d-flex align-items-center justify-content-center ${isDarkMode ? "bg-dark" : ""}`}
      style={{ background: isDarkMode ? "linear-gradient(135deg, #0f172a, #1e2937)" : "linear-gradient(135deg, #20c997, #0d6efd)" }}>

      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-lg-5">
          <div className="card border-0 shadow-lg p-4" style={{ borderRadius: "20px" }}>

            <div className="d-flex justify-content-end mb-3">
              <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
                {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
            </div>

            <div className="text-center mb-4">
              <h1>🏥</h1>
              <h2 className="fw-bold">
                {selectedRole === "doctor" ? "Doctor Registration" : "Patient Registration"}
              </h2>
            </div>

            <div className="d-flex gap-2 mb-4">
              <button className={`btn flex-fill ${selectedRole === "doctor" ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => setSelectedRole("doctor")}>Doctor</button>
              <button className={`btn flex-fill ${selectedRole === "patient" ? "btn-success" : "btn-outline-success"}`}
                onClick={() => setSelectedRole("patient")}>Patient</button>
            </div>

            <form onSubmit={handleSubmit}>
              <input type="text" name="fullName" className="form-control mb-3" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              <input type="email" name="email" className="form-control mb-3" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <input type="text" name="phone" className="form-control mb-3" placeholder="Phone" value={formData.phone} onChange={handleChange} required />

              {selectedRole === "doctor" && (
                <select name="specialization" className="form-select mb-3" value={formData.specialization} onChange={handleChange} required>
                  <option value="">Select Specialization</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              )}

              <input type="password" name="password" className="form-control mb-4" placeholder="Password" value={formData.password} onChange={handleChange} required />

              <button type="submit" className={`btn w-100 py-2 ${selectedRole === "doctor" ? "btn-primary" : "btn-success"}`} disabled={loading}>
                {loading ? "Registering..." : `Register as ${selectedRole === "doctor" ? "Doctor" : "Patient"}`}
              </button>
            </form>

            <p className="text-center mt-4">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;