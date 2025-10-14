import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import "./QueuePage.css";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const QueuePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [time, setTime] = useState(new Date());
  const [showGreeting, setShowGreeting] = useState(false);

  const token = localStorage.getItem("token");

  const handleRowClick = (appointmentId) => {
    navigate(`/dashboard/appointments/${appointmentId}`);
  }

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowGreeting((prev) => !prev);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
      }
    };

    if (token) fetchDoctor();
  }, [token]);

  useEffect(() => {
    const fetchAppointments = async () => {

      if (!doctor?.doctorId) {
        console.warn("No doctorId found.");
        return;
      }

      try {
        const url = `${base_url}/appointments/previous`;
        const res = await axios.get(url,{headers: { Authorization: `Bearer ${token}` },});
        setAppointments(res.data || []);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      }
    };

    if (doctor?.doctorId) fetchAppointments();
  }, [doctor?.doctorId]);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const awaiting = appointments.filter((a) => a.appStatus === "Pending").length;
  const confirmed = appointments.filter((a) => a.appStatus === "Confirmed").length;
  const rescheduleRequests = appointments.filter((a) => a.appStatus === "Request for Rescheduling").length;
  const cancelled = appointments.filter((a) => a.appStatus === "Rejected").length;
  const ended = appointments.filter((a) => a.appStatus === "Completed").length;
  const rescheduled = appointments.filter((a) => a.appStatus === "Rescheduled").length;
  const incomplete = appointments.filter((a) => a.appStatus === "Incomplete").length;
  const online = appointments.filter((a) => a.consultStatus === "Online").length;

  return (
    <div className="p-6 font-sans bg-blue-50 h-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1
          key={showGreeting ? "greeting" : "date"}
          className="text-3xl font-bold text-blue-900 dust-fade"
        >
          {showGreeting ? `Hello, ${user?.name || "Doctor"}` : formattedDate}
        </h1>
        <div className="clock-frame px-6 py-3 rounded-2xl border-4 border-pink-400">
          <span className="clock-text text-[38px] md:text-[48px] font-mono bg-clip-text text-transparent bg-gradient-to-br from-pink-300 to-yellow-200">
            {formattedTime}
          </span>
        </div>
      </div>

      <div className="flex justify-around mb-6 flex-wrap">
        <div className="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow w-64 mb-4">
          <p className="text-blue-600">Awaiting visits</p>
          <p className="text-3xl font-bold text-blue-800">{awaiting}</p>
        </div>
        <div className="bg-white border-l-4 border-red-500 rounded-lg p-4 shadow w-64 mb-4">
          <p className="text-red-600">Canceled visits</p>
          <p className="text-3xl font-bold text-red-800">{cancelled}</p>
        </div>
        <div className="bg-white border-l-4 border-green-500 rounded-lg p-4 shadow w-64 mb-4">
          <p className="text-green-600">Ended visits</p>
          <p className="text-3xl font-bold text-green-800">{ended}</p>
        </div>
        <div className="bg-white border-l-4 border-yellow-500 rounded-lg p-4 shadow w-64 mb-4">
          <p className="text-yellow-600">Online Slots</p>
          <p className="text-3xl font-bold text-yellow-800">{online}</p>
        </div>
      </div>

      <div className="overflow-auto max-h-[350px] rounded-lg shadow bg-white">
      <table className="w-full border-collapse bg-white shadow rounded-lg">
        <thead className="bg-blue-100 text-blue-800 text-left sticky top-0 z-10">
          <tr>
            <th className="p-3">Patient Name</th>
            <th className="p-3">Date</th>
            <th className="p-3">Slot</th>
            
            <th className="p-3">Consult Mode</th>
            <th className="p-3">Payment</th>
            <th className="p-3">Status</th>
            <th className="p-3">Reason</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, index) => (
            <tr
              key={index}
              className="border-t transition-colors duration-200 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleRowClick(appt.appointmentId)}
            >
          <td className="p-3">{appt.patientName}</td>
          <td className="p-3">
            {new Date(appt.date).toLocaleDateString("en-IN")}
          </td>
          <td className="p-3">{appt.slotNumber}</td>
          
          <td className="p-3">{appt.consultStatus}</td>
          <td className="p-3">
            <span
              className={`px-2 py-1 text-sm rounded-full ${
                appt.payStatus === "Paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appt.payStatus}
            </span>
          </td>
          <td className="p-3">
            <span
              className={`px-2 py-1 text-sm rounded-full ${
                appt.appStatus === "Pending"
                  ? "bg-blue-100 text-blue-800"
                  : appt.appStatus === "Confirmed"
                  ? "bg-green-100 text-green-800"
                  : appt.appStatus === "Request for Rescheduling"
                  ? "bg-orange-100 text-orange-800"
                  : appt.appStatus === "Rescheduled"
                  ? "bg-yellow-100 text-yellow-800"
                  : appt.appStatus === "Completed"
                  ? "bg-green-100 text-green-800"
                  : appt.appStatus === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : appt.appStatus === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : appt.appStatus === "Incomplete"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {appt.appStatus}
            </span>
          </td>
          <td className="p-3" title={appt.reason}>
            {appt.reason?.length > 20
              ? `${appt.reason.slice(0, 20)}...`
              : appt.reason}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>

    </div>
  );
};

export default QueuePage;
