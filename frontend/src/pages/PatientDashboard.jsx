import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { toast } from "react-toastify";

function PatientDashboard() {
  const [doctors, setDoctors] =
    useState([]);

  const [appointment, setAppointment] =
    useState({
      doctorId: "",
      doctorName: "",
      appointmentDate: "",
    });

  const [myAppointments,
    setMyAppointments] = useState([]);

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

  if (user.role !== "patient") {
    return (
      <div className="container mt-5">
        <h3>
          Access Denied - Patient Only
        </h3>
      </div>
    );
  }

  useEffect(() => {
    fetchDoctors();
    fetchMyAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "http://localhost:5000/api/auth/doctors",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setDoctors(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMyAppointments =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `http://localhost:5000/api/appointments/patient/${user.email}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setMyAppointments(
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const bookAppointment =
    async () => {
      if (
        !appointment.doctorId ||
        !appointment.appointmentDate
      ) {
        return toast.warning(
          "Please select doctor and date"
        );
      }

      try {
        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "http://localhost:5000/api/appointments",
          {
            patientName:
              user.fullname,
            patientEmail:
              user.email,
            doctorId:
              appointment.doctorId,
            doctorName:
              appointment.doctorName,
            appointmentDate:
              appointment.appointmentDate,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Appointment Booked Successfully"
        );

        fetchMyAppointments();

        setAppointment({
          doctorId: "",
          doctorName: "",
          appointmentDate: "",
        });
      } catch (error) {
        toast.error(
          error.response?.data
            ?.message ||
            "Booking Failed"
        );
      }
    };

  const pendingCount =
    myAppointments.filter(
      (a) => a.status === "Pending"
    ).length;

  const approvedCount =
    myAppointments.filter(
      (a) => a.status === "Approved"
    ).length;

  return (
    <DashboardLayout role="Patient">
      <div className="container-fluid">

        {/* Welcome */}
        <div className="card shadow border-0 mb-4">
          <div className="card-body">
            <h2>
              👋 Welcome {user.fullname}
            </h2>

            <p className="text-muted">
              Book and manage your
              appointments.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="row g-3 mb-4">

          <div className="col-md-4">
            <div className="card bg-primary text-white shadow border-0">
              <div className="card-body text-center">
                <h2>
                  {
                    myAppointments.length
                  }
                </h2>
                <p>
                  Total Appointments
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-warning shadow border-0">
              <div className="card-body text-center">
                <h2>
                  {pendingCount}
                </h2>
                <p>Pending</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-success text-white shadow border-0">
              <div className="card-body text-center">
                <h2>
                  {approvedCount}
                </h2>
                <p>Approved</p>
              </div>
            </div>
          </div>

        </div>

        {/* Book Appointment */}
        <div className="card shadow border-0">
          <div className="card-header bg-success text-white">
            <h4>
              📅 Book Appointment
            </h4>
          </div>

          <div className="card-body">

            <select
              className="form-select mb-3"
              value={
                appointment.doctorId
              }
              onChange={(e) => {
                const doctor =
                  doctors.find(
                    (d) =>
                      d.id ==
                      e.target.value
                  );

                setAppointment({
                  ...appointment,
                  doctorId:
                    doctor.id,
                  doctorName:
                    doctor.fullname,
                });
              }}
            >
              <option value="">
                Select Doctor
              </option>

              {doctors.map(
                (doctor) => (
                  <option
                    key={doctor.id}
                    value={
                      doctor.id
                    }
                  >
                    {
                      doctor.fullname
                    }
                  </option>
                )
              )}
            </select>

            <input
              type="date"
              className="form-control mb-3"
              value={
                appointment.appointmentDate
              }
              onChange={(e) =>
                setAppointment({
                  ...appointment,
                  appointmentDate:
                    e.target.value,
                })
              }
            />

            <button
              className="btn btn-success w-100"
              onClick={
                bookAppointment
              }
            >
              Book Appointment
            </button>

          </div>
        </div>

        {/* My Appointments */}
        <div className="card shadow border-0 mt-4">

          <div className="card-header bg-primary text-white">
            <h4>
              📋 My Appointments
            </h4>
          </div>

          <div className="card-body table-responsive">

            <table className="table table-hover">

              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {myAppointments.length >
                0 ? (
                  myAppointments.map(
                    (appt) => (
                      <tr
                        key={
                          appt.id
                        }
                      >
                        <td>
                          {
                            appt.doctorName
                          }
                        </td>

                        <td>
                          {
                            appt.appointmentDate
                          }
                        </td>

                        <td>
                          <span
                            className={`badge ${
                              appt.status ===
                              "Approved"
                                ? "bg-success"
                                : appt.status ===
                                  "Rejected"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                            }`}
                          >
                            {
                              appt.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="3"
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

export default PatientDashboard;