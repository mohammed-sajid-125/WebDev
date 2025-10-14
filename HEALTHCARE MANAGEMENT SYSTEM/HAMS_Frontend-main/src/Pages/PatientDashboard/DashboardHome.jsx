import AppointmentBanner from "./components/appointmentBanner";
import HealthReport from "./components/HealthReports";
import HeartRateGraph from "./components/HeartRateGraph";
import RecentAppointments from "./components/RecentAppointments";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const DashboardHome = () => {
  const [appointments, setAppointments] = useState([]);
  const { handleOpenJitsi } = useOutletContext();

  const fetchAppointments = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${base_url}/patients/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res);

      const todayStr = new Date().toISOString().split("T")[0];
      const upcoming = res.data.filter((a) => {
        const apptDate = new Date(a.date).toISOString().split("T")[0];
        return apptDate === todayStr && (
          a.appStatus === "Pending" || 
          a.appStatus === "Confirmed" || 
          a.appStatus === "Request for Rescheduling" ||
          a.appStatus === "Requested"
        );
      });

      setAppointments(upcoming);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, []);

  const handleCancel = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${base_url}/appointments/cancel`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment Cancelled");
      fetchAppointments();
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <div className="flex flex-1 p-6 gap-6">
      <div className="w-2/3 space-y-6">
        <AppointmentBanner appointment={appointments[0]} />
        <HealthReport />
        <HeartRateGraph />
      </div>

      <div className="w-1/3">
        <RecentAppointments
          appointments={appointments}
          onCancel={handleCancel}
          handleOpenJitsi={handleOpenJitsi}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
