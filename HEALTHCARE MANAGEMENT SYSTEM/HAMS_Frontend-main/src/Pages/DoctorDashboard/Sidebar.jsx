import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LibraryBooksSharpIcon from '@mui/icons-material/LibraryBooksSharp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';

const Sidebar = ({
  doctor,
  sidebarCollapsed,
  setSidebarCollapsed,
  handleOverviewClick,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      if (window.innerWidth >= 640) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const effectiveCollapse = isMobile || sidebarCollapsed;

  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { label: "Appointments", icon: <LibraryBooksSharpIcon />, path: "/dashboard/appointments" },
    { label: "Slots", icon: <CalendarTodayIcon />, path: "/dashboard/slots" },
    { label: "EditProfile", icon: <EditIcon />, path: "/dashboard/editProfile"}
  ];

  const handleNavigation = (label, path, action) => {
    if (label === "Slots") {
      if (!doctor || !doctor.doctorId) {
        alert("Doctor ID missing from doctor object.");
        return;
      }
      navigate("/dashboard/slots", { state: { doctorId: doctor.doctorId } });
    } else if (path) {
      navigate(path);
    } else if (action) {
      action();
    }
    if (isMobile) setDrawerOpen(false);
  };

  // Hamburger for mobile
  const Hamburger = () => (
    <button
      className="sm:hidden p-2 m-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-900 text-white"
      onClick={() => setDrawerOpen(!drawerOpen)}
      aria-label="Toggle sidebar"
    >
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {drawerOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );

  // Sidebar content
  const SidebarContent = () => (
    <div
      className={`bg-gray-900 text-white shadow-md transition-all duration-300 ease-in-out h-full flex flex-col ${
        effectiveCollapse ? "w-20" : "w-56"
      }`}
    >
      <div className="p-4 text-center border-b border-gray-800">
        {!effectiveCollapse && <h1 className="text-lg font-bold">Welcome</h1>}
      </div>
      <div className="flex flex-col gap-2 p-4 flex-1">
        {navItems.map(({ label, icon, path, action }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 cursor-pointer transition-all"
            onClick={() => handleNavigation(label, path, action)}
          >
            <div className="text-xl">{icon}</div>
            {!effectiveCollapse && <span>{label}</span>}
          </div>
        ))}
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 cursor-pointer text-yellow-400 transition-all mt-auto"
          onClick={handleLogout}
        >
          <div className="text-xl">
            <LogoutIcon />
          </div>
          {!effectiveCollapse && <span>Logout</span>}
        </div>
      </div>
    </div>
  );

  // Drawer overlay for mobile
  if (isMobile) {
    return (
      <>
        <Hamburger />
        {drawerOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setDrawerOpen(false)} />
            <div className="relative z-50 h-full">
              <SidebarContent />
            </div>
          </div>
        )}
      </>
    );
  }

  // Desktop sidebar
  return <SidebarContent />;
};

export default Sidebar;
