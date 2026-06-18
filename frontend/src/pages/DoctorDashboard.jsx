import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";

function DoctorDashboard() {
  const [appointments, setAppointments] =
    useState([]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  // RBAC Access Control
  if (!user) {
    return (
      <div className="container mt-5">
        <h3>Unauthorized Access</h3>
      </div>
    );
  }

  if (user.role !== "doctor") {
    return (
      <div className="container mt-5">
        <h3>
          Access Denied - Doctor Only
        </h3>
      </div>
    );
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          `http://localhost:5000/api/appointments/doctor/${user.id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setAppointments(response.data);
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to load appointments"
      );
    }
  };

  const updateStatus = async (
    appointmentId,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        `Appointment ${status}`
      );

      fetchAppointments();
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to update status"
      );
    }
  };

  const pendingCount =
    appointments.filter(
      (a) => a.status === "Pending"
    ).length;

  const approvedCount =
    appointments.filter(
      (a) => a.status === "Approved"
    ).length;

  const rejectedCount =
    appointments.filter(
      (a) => a.status === "Rejected"
    ).length;

  return (
    <DashboardLayout role="Doctor">
      <div className="container-fluid">

        {/* Welcome */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <h2>
              👨‍⚕️ Welcome Dr.
              {" "}
              {user.fullname}
            </h2>

            <p className="text-muted">
              Manage patient appointments
              and requests.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3">

          <div className="col-lg-3 col-md-6">
            <div className="card bg-primary text-white shadow border-0">
              <div className="card-body text-center">
                <h1>📅</h1>
                <h3>
                  {appointments.length}
                </h3>
                <p>Total Appointments</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card bg-warning shadow border-0">
              <div className="card-body text-center">
                <h1>⏳</h1>
                <h3>
                  {pendingCount}
                </h3>
                <p>Pending</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card bg-success text-white shadow border-0">
              <div className="card-body text-center">
                <h1>✅</h1>
                <h3>
                  {approvedCount}
                </h3>
                <p>Approved</p>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card bg-danger text-white shadow border-0">
              <div className="card-body text-center">
                <h1>❌</h1>
                <h3>
                  {rejectedCount}
                </h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>

        </div>

        {/* Appointments Table */}
        <div className="card shadow border-0 mt-4">

          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">
              📋 My Appointments
            </h4>
          </div>

          <div className="card-body table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-light">
                <tr>
                  <th>Patient</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {appointments.length >
                0 ? (
                  appointments.map(
                    (appointment) => (
                      <tr
                        key={
                          appointment.id
                        }
                      >
                        <td>
                          {
                            appointment.patientName
                          }
                        </td>

                        <td>
                          {
                            appointment.patientEmail
                          }
                        </td>

                        <td>
                          {
                            appointment.appointmentDate
                          }
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              appointment.status ===
                              "Approved"
                                ? "bg-success"
                                : appointment.status ===
                                  "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {
                              appointment.status
                            }
                          </span>
                        </td>

                        <td>

                          {appointment.status ===
                          "Pending" ? (
                            <>
                              <button
                                className="btn btn-success btn-sm me-2"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "Approved"
                                  )
                                }
                              >
                                Approve
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  updateStatus(
                                    appointment.id,
                                    "Rejected"
                                  )
                                }
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span>
                              Completed
                            </span>
                          )}

                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center"
                    >
                      No Appointments Found
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

export default DoctorDashboard;