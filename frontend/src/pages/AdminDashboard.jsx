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

  const user = JSON.parse(localStorage.getItem("user"));

  const specializations = [
    "Cardiologist", "Neurologist", "Orthopedic", "Pediatrician",
    "Gynecologist", "Dermatologist", "Physician", "Surgeon",
    "ENT Specialist", "Ophthalmologist", "Psychiatrist", "General Practitioner"
  ];

  // RBAC
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

  // Sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered and Sorted Users
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

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // ... (keep your existing createDoctor, updateDoctor, editDoctor, deleteDoctor, resetForm functions)

  return (
    <DashboardLayout role="Admin">
      <div className={`container-fluid ${isDarkMode ? 'text-light' : ''}`}>

        {/* Search */}
        <div className="d-flex justify-content-between mb-4">
          <input
            type="text"
            className={`form-control w-50 ${isDarkMode ? 'bg-dark text-light' : ''}`}
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add/Edit Doctor Form - (Your existing form with specialization) */}

        {/* Users Table with Sorting & Pagination */}
        <div className={`card shadow border-0 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
          <div className="card-header bg-dark text-white d-flex justify-content-between">
            <h4>👥 All Users ({filteredUsers.length})</h4>
          </div>

          <div className="card-body table-responsive">
            <table className={`table ${isDarkMode ? 'table-dark' : 'table-hover'}`}>
              <thead>
                <tr>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('fullname')}>
                    Full Name {sortConfig.key === 'fullname' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th style={{cursor: 'pointer'}} onClick={() => requestSort('email')}>
                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Phone</th>
                  <th>Specialization</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>{userItem.fullname}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.phone}</td>
                    <td>{userItem.specialization || "-"}</td>
                    <td>
                      <span className={`badge ${userItem.role === "admin" ? "bg-danger" : userItem.role === "doctor" ? "bg-success" : "bg-primary"}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td>
                      {userItem.role === "doctor" && (
                        <>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => editDoctor(userItem)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteDoctor(userItem.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>Page {currentPage} of {totalPages || 1}</span>
              <div>
                <button 
                  className="btn btn-outline-secondary btn-sm me-2" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;