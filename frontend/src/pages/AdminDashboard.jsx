import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

function AdminDashboard() {
  const { isDarkMode } = useTheme();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fullname", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [doctorForm, setDoctorForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
  });

  const [editingDoctorId, setEditingDoctorId] = useState(null);

  // PDF Upload States
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const specializations = [
    "Cardiologist", "Neurologist", "Orthopedic", "Pediatrician",
    "Gynecologist", "Dermatologist", "Physician", "Surgeon",
    "ENT Specialist", "Ophthalmologist", "Psychiatrist", "General Practitioner"
  ];

  if (!user || user.role !== "admin") {
    return <div className="container mt-5"><h3>Access Denied - Admin Only</h3></div>;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredUsers = users
    .filter(user => 
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // ============== PDF UPLOAD ==============
  const uploadPDF = async () => {
    if (!selectedUserId || !selectedFile) {
      return toast.warning("Please select a user and PDF file");
    }

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:5000/api/documents/upload/${selectedUserId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("PDF uploaded successfully!");
      setSelectedFile(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  // ============== DOCTOR CRUD ==============
  const createOrUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingDoctorId) {
        await axios.put(`http://localhost:5000/api/admin/doctors/${editingDoctorId}`, doctorForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Doctor Updated Successfully");
      } else {
        await axios.post("http://localhost:5000/api/admin/doctors", doctorForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Doctor Added Successfully");
      }
      resetForm();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setEditingDoctorId(null);
    setDoctorForm({
      fullname: "",
      email: "",
      phone: "",
      password: "",
      specialization: "",
    });
  };

  const editDoctor = (doctor) => {
    setEditingDoctorId(doctor.id);
    setDoctorForm({
      fullname: doctor.fullname,
      email: doctor.email,
      phone: doctor.phone,
      password: "",
      specialization: doctor.specialization || "",
    });
  };

  const deleteDoctor = async (id) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Doctor deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout role="Admin">
      <div className={`container-fluid ${isDarkMode ? 'text-light' : ''}`}>

        {/* Search Bar */}
        <div className="d-flex justify-content-between mb-4">
          <input
            type="text"
            className={`form-control w-50 ${isDarkMode ? 'bg-dark text-light' : ''}`}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* PDF Upload Section */}
        <div className={`card shadow border-0 mb-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
          <div className="card-header bg-info text-white">
            <h4>📄 Upload PDF Document</h4>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-5">
                <select className="form-select" onChange={(e) => setSelectedUserId(e.target.value)}>
                  <option value="">Select User (Patient or Doctor)</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullname} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="form-control" 
                  onChange={(e) => setSelectedFile(e.target.files[0])} 
                />
              </div>
              <div className="col-md-2">
                <button 
                  className="btn btn-info w-100" 
                  onClick={uploadPDF}
                  disabled={!selectedFile}
                >
                  Upload PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add / Edit Doctor Form */}
        <div className={`card shadow border-0 mb-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              {editingDoctorId ? "✏️ Edit Doctor" : "➕ Add New Doctor"}
            </h4>
          </div>

          <div className="card-body">
            <form onSubmit={createOrUpdateDoctor}>
              <div className="row g-3">
                <div className="col-md-3">
                  <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`} placeholder="Full Name" value={doctorForm.fullname} onChange={(e) => setDoctorForm({ ...doctorForm, fullname: e.target.value })} required />
                </div>
                <div className="col-md-3">
                  <input type="email" className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`} placeholder="Email" value={doctorForm.email} onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })} required />
                </div>
                <div className="col-md-2">
                  <input type="text" className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`} placeholder="Phone" value={doctorForm.phone} onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })} required />
                </div>
                <div className="col-md-2">
                  <select className={`form-select ${isDarkMode ? 'bg-dark text-light' : ''}`} value={doctorForm.specialization} onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}>
                    <option value="">Specialization</option>
                    {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <input type="password" className={`form-control ${isDarkMode ? 'bg-dark text-light' : ''}`} placeholder="Password" value={doctorForm.password} onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })} />
                </div>
                <div className="col-12 text-end">
                  <button type="submit" className={`btn ${editingDoctorId ? "btn-warning" : "btn-success"} px-4`}>
                    {editingDoctorId ? "Update Doctor" : "Add Doctor"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Users Table */}
        <div className={`card shadow border-0 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
          <div className="card-header bg-dark text-white">
            <h4>👥 All Users ({filteredUsers.length})</h4>
          </div>
          <div className="card-body table-responsive">
            <table className={`table ${isDarkMode ? 'table-dark' : 'table-hover'}`}>
              <thead>
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('fullname')}>Full Name</th>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('email')}>Email</th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.specialization || "-"}</td>
                    <td>
                      <span className={`badge ${u.role === "admin" ? "bg-danger" : u.role === "doctor" ? "bg-success" : "bg-primary"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => editDoctor(u)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(u.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>Page {currentPage} of {totalPages || 1}</span>
              <div>
                <button className="btn btn-outline-secondary btn-sm me-2" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
                <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;