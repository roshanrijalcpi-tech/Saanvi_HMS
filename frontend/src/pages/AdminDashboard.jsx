import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [users, setUsers] = useState([]);

  const [doctorForm, setDoctorForm] =
    useState({
      fullname: "",
      email: "",
      phone: "",
      password: "",
    });
  const [editingDoctorId,
    setEditingDoctorId] =
    useState(null);
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // RBAC
  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Unauthorized Access</h3>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="container mt-5">
        <h3>Access Denied - Admin Only</h3>
      </div>
    );
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/auth/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setUsers(response.data);
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to load users"
      );
    }
  };

  const createDoctor = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/doctors",
        doctorForm,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Doctor Added Successfully"
      );

      setDoctorForm({
        fullname: "",
        email: "",
        phone: "",
        password: "",
      });

      fetchUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed To Add Doctor"
      );
    }
  };

  const deleteDoctor = async (id) => {
    if (
      !window.confirm(
        "Delete this doctor?"
      )
    )
      return;

    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/admin/doctors/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Doctor Deleted Successfully"
      );

      fetchUsers();
    } catch (error) {
      toast.error(
        "Failed To Delete Doctor"
      );
    }
  };
  const editDoctor = (doctor) => {
    setEditingDoctorId(
      doctor.id
    );

    setDoctorForm({
      fullname:
        doctor.fullname,
      email: doctor.email,
      phone: doctor.phone,
      password: "",
    });
  };
  const updateDoctor = async () => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/doctors/${editingDoctorId}`,
        {
          fullname:
            doctorForm.fullname,
          email:
            doctorForm.email,
          phone:
            doctorForm.phone,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Doctor Updated Successfully"
      );

      setEditingDoctorId(null);

      setDoctorForm({
        fullname: "",
        email: "",
        phone: "",
        password: "",
      });

      fetchUsers();
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed To Update Doctor"
      );
    }
  };

  const doctors = users.filter(
    (u) => u.role === "doctor"
  );

  const patients = users.filter(
    (u) => u.role === "patient"
  );

  return (
    <DashboardLayout role="Admin">
      <div className="container-fluid">

        {/* Welcome */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <h2>
              👨‍💼 Welcome {user.fullname}
            </h2>

            <p className="text-muted">
              Manage Doctors,
              Patients and Users
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card bg-primary text-white shadow">
              <div className="card-body text-center">
                <h2>{users.length}</h2>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-success text-white shadow">
              <div className="card-body text-center">
                <h2>{doctors.length}</h2>
                <p>Total Doctors</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-warning shadow">
              <div className="card-body text-center">
                <h2>{patients.length}</h2>
                <p>Total Patients</p>
              </div>
            </div>
          </div>

        </div>

        {/* Add Doctor */}
        <div className="card shadow border-0 mb-4">

          <div className="card-header bg-success text-white">
            <h4 className="mb-0">
              ➕ Add Doctor
            </h4>
          </div>

          <div className="card-body">

            <div className="row g-2">

              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  value={
                    doctorForm.fullname
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      fullname:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={
                    doctorForm.email
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      email:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Phone"
                  value={
                    doctorForm.phone
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      phone:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-2">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={
                    doctorForm.password
                  }
                  onChange={(e) =>
                    setDoctorForm({
                      ...doctorForm,
                      password:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-2">
                <button
                  className={`btn w-100 ${editingDoctorId
                    ? "btn-warning"
                    : "btn-success"
                    }`}
                  onClick={
                    editingDoctorId
                      ? updateDoctor
                      : createDoctor
                  }
                >
                  {editingDoctorId
                    ? "Update Doctor"
                    : "Add Doctor"}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* Users Table */}
        <div className="card shadow border-0">

          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">
              👥 All Users
            </h4>
          </div>

          <div className="card-body table-responsive">

            <table className="table table-hover">

              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>

                      <td>{user.id}</td>

                      <td>
                        {user.fullname}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.phone}
                      </td>

                      <td>
                        <span
                          className={`badge ${user.role ===
                            "admin"
                            ? "bg-danger"
                            : user.role ===
                              "doctor"
                              ? "bg-success"
                              : "bg-primary"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        {user.role === "doctor" ? (
                          <>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() =>
                                editDoctor(user)
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                deleteDoctor(user.id)
                              }
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center"
                    >
                      No Users Found
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;