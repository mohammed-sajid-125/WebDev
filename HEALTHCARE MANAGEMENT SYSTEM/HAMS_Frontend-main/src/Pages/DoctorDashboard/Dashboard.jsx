import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import DoctorProfileCard from "./components/DoctorProfileCard";
import dp from "../../assets/dp.jpg";
import VideocamIcon from "@mui/icons-material/Videocam";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  OverviewModal,
  RejectModal,
  PrescriptionModal,
  ViewPrescriptionModal,
} from "./DoctorModals";
import JitsiMeetModal from "../../Meeting/JitsiMeetModal";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  Tooltip,
  Legend
);

const lineData = {
  labels: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
  datasets: [
    {
      label: "Appointments",
      data: [80, 220, 180, 260, 140, 110, 130],
      fill: true,
      backgroundColor: "rgba(34,197,94,0.07)",
      borderColor: "#22c55e",
      pointRadius: 0,
      tension: 0.4,
    },
  ],
};
const lineOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: "#A1A1AA", font: { family: "inherit", size: 13 } },
    },
    y: {
      grid: { display: false },
      ticks: { display: false },
      min: 0,
      max: 300,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const doughnutData = {
  labels: ["Male", "Female"],
  datasets: [
    {
      data: [81, 177],
      backgroundColor: ["#fbbf24", "#3b82f6"],
      borderWidth: 0,
    },
  ],
};
const doughnutOptions = {
  cutout: "75%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState({});
  const [rev,setRev] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  // Modal states
  const [showOverview, setShowOverview] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showViewPrescription, setShowViewPrescription] = useState(false);

  // Modal form states
  const [rejectionReason, setRejectionReason] = useState("");
  const [description, setDescription] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [prescriptionIndex, setPrescriptionIndex] = useState(null);
  const [currentPrescription, setCurrentPrescription] = useState("");
  const [viewedPrescription, setViewedPrescription] = useState("");
  const [viewedPatientName, setViewedPatientName] = useState("");

  // Jitsi modal
  const [jitsiRoom, setJitsiRoom] = useState("");
  const [showJitsi, setShowJitsi] = useState(false);

  const newtoken = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors/profile`, {
          headers: { Authorization: `Bearer ${newtoken}` },
        });
        setRev(res.data.revenue);
        setDoctor(res.data.doctor);
      } catch (err) {
        console.error("Failed to fetch doctor profile", err);
      }
    };
    fetchDoctor();
  }, [newtoken]);

  // Fetch both today's and previous appointments
  const fetchAppointments = useCallback(async () => {
    if (!user?.id) return;
    const today = new Date().toISOString().split("T")[0];
    try {
      const todayURL = `${base_url}/appointments/pending/${today}`;
      const prevURL = `${base_url}/appointments/previous?doctorId=${user.id}`;
      const [todayRes, prevRes] = await Promise.all([
        axios.get(todayURL,{headers: { Authorization: `Bearer ${newtoken}` },}),
        axios.get(prevURL,{headers: { Authorization: `Bearer ${newtoken}` },}),
      ]);
      setTodayAppointments(todayRes.data || []);
      setPreviousAppointments(prevRes.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Update appointment status in backend
  const updateAppointmentStatus = async (
    appointmentId,
    status,
    reason = "",
    prescriptionText = ""
  ) => {
    try {
      const url = `${base_url}/appointments/update-status/${appointmentId}`;
      const payload = {
        appStatus: status,
        rejectionReason: reason,
        prescription: prescriptionText,
      };
      await axios.put(url, payload);
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Move appointment from today to previous
  const moveToPrevious = (index, status, reason = "", prescription = "") => {
    const appt = todayAppointments[index];
    const updatedToday = [...todayAppointments];
    updatedToday.splice(index, 1);
    setTodayAppointments(updatedToday);

    setPreviousAppointments((prev) => [
      ...prev,
      {
        ...appt,
        appStatus: status,
        reasonForReject: reason,
        prescription,
      },
    ]);
  };

  // Remove from today's appointments (for reschedule/reject/done)
  const removeFromTodayAppointments = (index) => {
    const updatedToday = [...todayAppointments];
    updatedToday.splice(index, 1);
    setTodayAppointments(updatedToday);
  };

  // Handle appointment status change
  const handleStatusChange = (index, status) => {
    setCurrentIndex(index);
    if (status === "Completed") {
      setPrescriptionIndex(index);
      setShowPrescriptionModal(true);
    } else if (status === "Rejected") {
      setShowRejectModal(true);
    } else if (status === "Rescheduled") {
      const appt = todayAppointments[index];
      updateAppointmentStatus(appt.appointmentId, "Rescheduled");
      moveToPrevious(index, "Rescheduled");
    }
  };

  // Confirm rejection
  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    const appt = todayAppointments[currentIndex];
    await updateAppointmentStatus(appt.appointmentId, "Rejected", rejectionReason);
    moveToPrevious(currentIndex, "Rejected", rejectionReason);
    setShowRejectModal(false);
    setRejectionReason("");
    setCurrentIndex(null);
  };

  // Save prescription and complete appointment
  const handleSavePrescription = async () => {
    const appt = todayAppointments[prescriptionIndex];
    await updateAppointmentStatus(appt.appointmentId, "Completed", "", currentPrescription);
    moveToPrevious(prescriptionIndex, "Completed", "", currentPrescription);
    setShowPrescriptionModal(false);
    setCurrentPrescription("");
    setPrescriptionIndex(null);
  };

  // View prescription (for previous appointments)
  const handleViewPrescription = (name, prescription) => {
    setViewedPatientName(name);
    setViewedPrescription(prescription);
    setShowViewPrescription(true);
  };

  // Jitsi Meet logic
  const handleOpenJitsi = (meetLink) => {
    const roomName = meetLink?.split("https://meet.jit.si/")[1];
    if (!roomName || roomName === "Link") {
      alert("Invalid or missing Meet link for this appointment.");
      return;
    }
    setJitsiRoom(roomName);
    setShowJitsi(true);
  };
  const handleCloseJitsi = () => setShowJitsi(false);

  // Save doctor's overview/description
  const handleSaveDescription = async () => {
    try {
      await axios.put(`${base_url}/doctors/update/${doctor.doctorId}`, {
        overview: description,
      });
      setDoctor((prev) => ({ ...prev, overview: description }));
      setShowOverview(false);
    } catch (err) {
      alert("Failed to save overview");
    }
  };
  var formattedDate = '';
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col lg:flex-row rounded-2xl">
        <div className="bg-[#fafbfc] w-full lg:w-3/4 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-3xl font-bold text-gray-900">Dashboard</div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarMonthIcon className="text-green-500" />
                  Appointments
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-800">{todayAppointments.length}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="money">
                    💰
                  </span>
                  Revenue
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-800">₹ {rev}</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <PeopleAltIcon className="text-green-500" />
                  Total Patients
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-800">
                {previousAppointments.filter((a) => a.appStatus === "Completed").length}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
              <div className="flex items-center justify-between text-gray-500 text-sm">
                <div className="flex items-center gap-2">
                  <PersonAddAltIcon className="text-green-500" />
                  New Patients
                </div>
              </div>
              <div className="mt-2 text-2xl font-bold text-gray-800">32</div>
            </div>
          </div>

          {/* Chart + Gender */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
            {/* Line Chart */}
            <div className="lg:col-span-4 bg-white rounded-xl shadow border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">Appointments</div>
                <div className="flex gap-4 text-sm text-gray-500">
                  <button className="font-semibold text-green-600 underline">
                    Week
                  </button>
                  <button>Day</button>
                  <button>Month</button>
                  <button>Year</button>
                  <button>
                    <svg
                      className="w-4 h-4 inline"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect
                        x="3"
                        y="4"
                        width="18"
                        height="18"
                        rx="2"
                        strokeWidth="2"
                      />
                      <path strokeWidth="2" d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="h-48">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
            {/* Doughnut Chart */}
            <div className="lg:col-span-1 mt-4 lg:mt-0 bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col items-center">
              <div className="font-semibold text-gray-900 mb-2">
                Consultation Mode
              </div>
              <div className="relative w-full max-w-[180px] aspect-square mx-auto">
                <Doughnut
                  data={doughnutData}
                  options={{
                    ...doughnutOptions,
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {previousAppointments.length + todayAppointments.length}
                  </span>
                  <span className="text-xs text-gray-400">week</span>
                </div>
              </div>
              {/* Legend */}
              <div className="flex flex-col gap-1 mt-4 text-xs w-full">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-400"></span>
                  Offline <span className="ml-2 text-gray-500">32%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  Online <span className="ml-2 text-gray-500">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/4 mt-6 lg:mt-0">
          <DoctorProfileCard doctor={doctor} />
        </div>
      </div>
      {/* Today's Appointments Table */}
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-semibold text-gray-900">
            Today's Appointments
          </div>
          <IconButton size="small" onClick={fetchAppointments}>
            <RefreshIcon />
          </IconButton>
        </div>
        {todayAppointments.length === 0 ? (
          <div>No Appointments for Today.</div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid min-w-[600px] grid-cols-6 gap-4 text-gray-500 text-sm font-medium py-2 border-b">
              <div>PATIENT</div>
              <div>REASON</div>
              <div>DATE</div>
              <div>TIME</div>
              <div>MEET LINK</div>
              <div className="text-center">ACTION</div>
            </div>
            {/* Appointment Rows */}
            {todayAppointments.map((appt, i) => (
              formattedDate = format(new Date(appt.date), 'dd/MM/yyyy'),
              <div
                key={i}
                className="grid min-w-[600px] grid-cols-6 gap-4 items-center py-3 border-b"
              >
                <div className="flex items-center gap-2 text-gray-800">
                  <img
                    src={appt?.avatar || dp}
                    alt={appt.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {appt.patientName}
                </div>
                <div
                  className={`text-sm flex justify-between items-center font-medium px-3 py-2 rounded-md shadow w-full ${
                    appt.appStatus === "Completed"
                      ? "bg-green-100 text-green-800"
                      : appt.appStatus === "Cancelled" || appt.appStatus === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : appt.appStatus === "Rescheduled"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {appt.reason}
                </div>
                <div className="text-gray-700">{formattedDate}</div>
                <div className="text-gray-700">{appt.slotNumber}</div>
                <div>
                  {appt.consultStatus === "Online" && appt.meetLink ? (
                    <button
                      className="sm pl-1.5 pr-1.5 bg-blue-500 rounded-1 pt-0.5 pb-0.5 text-white"
                      onClick={() => handleOpenJitsi(appt.meetLink)}
                    >
                      <VideocamIcon className="mx-2 text-white" />
                      Join Meet
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                    onClick={() => handleStatusChange(i, "Completed")}
                  >
                    Done
                  </button>
                  <button
                    className="px-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={() => handleStatusChange(i, "Rejected")}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition"
                    onClick={() => handleStatusChange(i, "Rescheduled")}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      

      {/* Modals */}
      <OverviewModal
        show={showOverview}
        onClose={() => setShowOverview(false)}
        description={doctor?.overview || ""}
        setDescription={setDescription}
        onSave={handleSaveDescription}
      />
      <RejectModal
        show={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onConfirm={handleRejectConfirm}
      />
      <PrescriptionModal
        show={showPrescriptionModal}
        onClose={() => setShowPrescriptionModal(false)}
        name={todayAppointments[prescriptionIndex]?.patientName || ""}
        prescription={currentPrescription}
        setPrescription={setCurrentPrescription}
        onSave={handleSavePrescription}
      />
      <ViewPrescriptionModal
        show={showViewPrescription}
        onClose={() => setShowViewPrescription(false)}
        name={viewedPatientName}
        prescription={viewedPrescription}
      />
      <JitsiMeetModal
        show={showJitsi}
        onHide={handleCloseJitsi}
        roomName={jitsiRoom}
      />
    </div>
  );
};

export default DoctorDashboard;
