import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { OverviewModal } from "./DoctorModals";

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [doctor, setDoctor] = useState({});
  const [showOverview, setShowOverview] = useState(false);
  const [overviewText, setOverviewText] = useState("");
  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const navigate = useNavigate();
  const { logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const fetchDoctor = async () => {
      const newToken = localStorage.getItem("token");
      try {
        const res = await axios.get(`${base_url}/doctors/profile`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setDoctor(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };
    
    fetchDoctor();
    
  }, []);

  const handleOverviewClick = () => {
    if (doctor?.overview) {
      setOverviewText(doctor.overview);
    }
    setShowOverview(true);
  };

  const handleSaveOverview = async () => {
    try {
      const res = await axios.put(`${base_url}/doctors/update/${doctor.doctorId}`, {
        overview: overviewText,
      });
      setDoctor({ ...doctor, overview: overviewText });
      setShowOverview(false);
      alert("Overview saved successfully");
    } catch (err) {
      console.error("Failed to update overview", err);
      alert("Failed to update overview.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
    logout();
    alert("Logged out successfully");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0">
        <Header toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          doctor={doctor}
          handleOverviewClick={handleOverviewClick}
          handleLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <Outlet />
        </main>
      </div>

      {/* Overview Modal */}
      <OverviewModal
        show={showOverview}
        onClose={() => setShowOverview(false)}
        description={overviewText}
        setDescription={setOverviewText}
        onSave={handleSaveOverview}
      />
    </div>
  );
};

export default DashboardLayout;
