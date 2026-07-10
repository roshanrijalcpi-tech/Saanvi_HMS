import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";

function MyAppointments() {
  const { isDarkMode } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/appointments/patient/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Appointments Data:", response.data); // ← Check this in console
      setAppointments(response.data);
    } catch (error) {
      toast.error("Failed to load appointments");
    }
  };

  const upcomingAppointments = appointments.filter(a => a.status === "Pending");
  const previousAppointments = appointments.filter(a => 
    a.status === "Approved" || a.status === "Rejected"
  );

  return (
    <DashboardLayout role="Patient">
      <div className={`container-fluid ${isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>

        <div className="mb-4">
          <h2 className="fw-bold">📋 My Appointments</h2>
        </div>

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
              Upcoming Appointment
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'previous' ? 'active' : ''}`} onClick={() => setActiveTab('previous')}>
              Previous Appointment
            </button>
          </li>
        </ul>

        {(activeTab === 'upcoming' ? upcomingAppointments : previousAppointments).length > 0 ? (
          (activeTab === 'upcoming' ? upcomingAppointments : previousAppointments).map(appt => (
            <div key={appt.id} className="mb-3">
              <div className={`card shadow-sm border-0 ${isDarkMode ? 'bg-secondary text-light' : 'bg-white'}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="mb-1">{appt.doctorName}</h5>
                      
                      {/* Improved Specialization Display */}
                      <p className={`mb-1 ${isDarkMode ? 'text-light-50' : 'text-muted'}`}>
                        <strong>Specialization:</strong> {appt.doctorSpecialization || appt.specialization || appt.DoctorSpecialization || "Not Available"}
                      </p>

                      <p className={`mb-0 ${isDarkMode ? 'text-light-50' : 'text-muted'}`}>
                        {appt.appointmentDate}
                      </p>
                    </div>
                    <span className={`badge ${appt.status === "Approved" ? "bg-success" : "bg-warning"}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className={`fs-5 ${isDarkMode ? 'text-light-50' : 'text-muted'}`}>
              No {activeTab} appointments found.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default MyAppointments;