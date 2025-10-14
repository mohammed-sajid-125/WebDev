// src/Pages/PatientDashboard/appointmentsPage.jsx
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import RecentAppointments from "./components/RecentAppointments";
import JitsiMeetModal from "../../Meeting/JitsiMeetModal";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [jitsiRoom, setJitsiRoom] = useState("");
  const [showJitsi, setShowJitsi] = useState(false);

  // Fetch todays’ pending appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${base_url}/patients/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const todayStr = new Date().toISOString().split("T")[0];
      const upcoming = res.data.filter((a) => {
        const apptDate = new Date(a.date).toISOString().split("T")[0];
        return apptDate
      });

      setAppointments(upcoming);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancel = async (appointmentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${base_url}/patients/cancel-appointment`,
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment Cancelled");
      fetchAppointments();
    } catch (err) {
      console.error("Cancel error:", err);
    }
  };

const handleOpenJitsi = (meetLink) => {
  console.log("Clicked Join with meetLink:", meetLink);

  if (!meetLink || meetLink === "Link") {
    alert("Invalid or missing Meet link for this appointment.");
    return;
  }


  let roomName = meetLink.startsWith("https://meet.jit.si/")
    ? meetLink.split("https://meet.jit.si/")[1]
    : meetLink;

  if (!roomName) {
    alert("Invalid meet link format.");
    return;
  }

  setJitsiRoom(roomName);
  setShowJitsi(true);
};


  const handleCloseJitsi = () => {
    setShowJitsi(false);
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>

      <RecentAppointments
        appointments={appointments}
        onCancel={handleCancel}
        handleOpenJitsi={handleOpenJitsi}
      />

      <JitsiMeetModal
        show={showJitsi}
        onHide={handleCloseJitsi}
        roomName={jitsiRoom}
      />
    </div>
  );
};

export default AppointmentsPage;
