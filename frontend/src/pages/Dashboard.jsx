import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0 p-5">
        <div className="d-flex justify-content-between align-items-center">
          <h1>🏥 Saanvi HMS Dashboard</h1>

          <button
            className="btn btn-danger"
            onClick={() => navigate("/")}
          >
            Logout
          </button>
        </div>

        <hr />

        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h3>120</h3>
                <p>Patients</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h3>25</h3>
                <p>Doctors</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h3>15</h3>
                <p>Appointments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;