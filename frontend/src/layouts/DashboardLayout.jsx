import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function DashboardLayout({ role, children }) {
  return (
    <div>
      <Navbar role={role} />

      <div className="d-flex">
        <Sidebar role={role} />

        <div
          className="flex-grow-1 p-4"
          style={{
            minHeight: "calc(100vh - 56px)",
            background: "#f8f9fa",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;