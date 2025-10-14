import React from "react";
import {
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useFloatingBarStore } from "../store/floatingBarStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Snackbar } from "@mui/material";

const navItems = [
  {
    label: "Dashboard",
    icon: <DashboardIcon fontSize="small" />,
    key: "dashboard",
  },
  { label: "Logout", icon: <LogoutIcon fontSize="small" />, key: "logout" },
];

const routeMap = {
  dashboard: "/dashboard",
};

const FloatingBar = () => {
  const [snackbarMessage, setsnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const close = useFloatingBarStore((state) => state.close);
  const isVisible = useFloatingBarStore((state) => state.isVisible);
  const [activeTab, setActiveTab] = React.useState("");

  const handleLogout = () => {
    close();
    localStorage.removeItem("token");
    navigate("/", { replace: true })
    
  };

  const handleTabChange = (key) => {
    if (key === "logout") {
      setSnackbarOpen(true);
    setsnackbarMessage("Logged out successfully");
    setTimeout(() => {
      handleLogout();
    }, 1000);
      
    } else {
      close();
      navigate(`/${key}`);
    }
  };

  if (!isVisible) return;

  return (
    <>
    <div
      className="fixed top-16 right-0 z-50 shadow-xl rounded-bl-2xl border border-gray-300 dark:border-white/10 
      bg-white backdrop-blur-lg flex flex-col overflow-hidden w-[160px]"
    >
      <div className="flex-1 divide-y divide-gray-200 dark:divide-white/10 w-full">
        {navItems.map(({ label, icon, key }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left text-blue-700 hover:bg-gray-100 transition-all
                ${key === "logout" ? "text-red-700" : ""}`}
            >
              {icon}
              {label}
              <hr />
            </button>
          );
        })}
      </div></div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => [setSnackbarOpen(false), setsnackbarMessage("")]}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "12px 16px",
            borderRadius: "4px",
          }}
        >
          {snackbarMessage}
        </div>
      </Snackbar>
    </>
  );
};

export default FloatingBar;
