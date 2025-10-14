import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  OverviewModal,
  RejectModal,
  PrescriptionModal,
  ViewPrescriptionModal,
} from "./DoctorModals";

import JitsiMeetModal from "../../Meeting/JitsiMeetModal";
import { CheckCircleIcon, AccessTimeIcon } from "@mui/icons-material";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const DoctorDashboard = () => {
  const location = useLocation();
  const [doctor, setDoctor] = useState({});
  const [doctorId, setDoctorId] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);

  const [showOverview, setShowOverview] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showViewPrescription, setShowViewPrescription] = useState(false);

  const [rejectionReason, setRejectionReason] = useState("");
  const [description, setDescription] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [prescriptionIndex, setPrescriptionIndex] = useState(null);
  const [currentPrescription, setCurrentPrescription] = useState("");
  const [viewedPrescription, setViewedPrescription] = useState("");
  const [viewedPatientName, setViewedPatientName] = useState("");

  const [jitsiRoom, setJitsiRoom] = useState("");
  const [showJitsi, setShowJitsi] = useState(false);

  const handleOpenJitsi = (meetLink) => {
    const roomName = meetLink?.split("https://meet.jit.si/")[1];
    if (!roomName || roomName === "Link") {
      alert("Invalid or missing Meet link for this appointment.");
      return;
    }
    setJitsiRoom(roomName);
    setShowJitsi(true);
  };

  const handleCloseJitsi = () => {
    setShowJitsi(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const idFromRoute =
      location.state?.doctor?.doctorId || location.state?.doctorId;
    const idFromStorage = localStorage.getItem("doctorId");
    const finalDoctorId = idFromRoute || idFromStorage;

    if (!finalDoctorId) return;

    setDoctorId(finalDoctorId);

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors/public/${finalDoctorId}`);
        if (res.status === 200) {
          setDoctor(res.data.doctor);
          localStorage.setItem("doctorId", res.data.doctor.doctorId);
        }
      } catch (err) {
        console.error("Failed to fetch doctor profile:", err);
      }
    };

    fetchDoctor();
  }, [location.state]);

  const fetchAppointments = useCallback(async () => {
    if (!doctor?.doctorId) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const todayURL = `${base_url}/appointments/pending/${today}?doctorId=${doctor.doctorId}`;
      const prevURL = `${base_url}/appointments/previous?doctorId=${doctor.doctorId}`;

      console.log("Requesting:", todayURL);

      const [todayRes, prevRes] = await Promise.all([
        axios.get(todayURL),
        axios.get(prevURL),
      ]);

      console.log("Fetched today's appointments:", todayRes.data);
      setTodayAppointments(todayRes.data || []);
      setPreviousAppointments(prevRes.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, [doctor]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const updateAppointmentStatus = async (
    appointmentId,
    status,
    reason = "",
    prescriptionText = ""
  ) => {
    try {
      await axios.put(
        `${base_url}/appointments/update-status/${appointmentId}`,
        {
          appStatus: status,
          rejectionReason: reason,
          prescription: prescriptionText,
        }
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

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

  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    const appt = todayAppointments[currentIndex];
    await updateAppointmentStatus(
      appt.appointmentId,
      "Rejected",
      rejectionReason
    );
    moveToPrevious(currentIndex, "Rejected", rejectionReason);
    setShowRejectModal(false);
    setRejectionReason("");
    setCurrentIndex(null);
  };

  const handleSavePrescription = async () => {
    const appt = todayAppointments[prescriptionIndex];
    try {
      await updateAppointmentStatus(
        appt.appointmentId,
        "Completed",
        "",
        currentPrescription
      );
      moveToPrevious(prescriptionIndex, "Completed", "", currentPrescription);
      setShowPrescriptionModal(false);
      setCurrentPrescription("");
      setPrescriptionIndex(null);
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };

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

  return (
    <Container fluid className="p-0" style={{ overflowX: "hidden" }}>
      <div className="p-4">
        <Row className="mb-4">
          <Col md={6} lg={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Total Patients</Card.Title>
                <h4>
                  {
                    previousAppointments.filter(
                      (a) => a.appStatus === "Completed"
                    ).length
                  }
                </h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>Today's Appointments</Card.Title>
                <h4>{todayAppointments.length}</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="text-primary mb-0">Today's Appointments</h5>
              <IconButton size="sm" onClick={fetchAppointments}>
                <RefreshIcon />
              </IconButton>
            </div>
            {todayAppointments.length === 0 ? (
              <p>No appointments for today.</p>
            ) : (
              todayAppointments.map((appt, idx) => (
                <Card
                  key={appt.appointmentId || idx}
                  className="mb-3 shadow-sm"
                >
                  <Card.Body className="d-flex justify-content-between">
                    <div>
                      <div><strong>Name:</strong> {appt.name}</div>
                      <div><strong>Date:</strong> {appt.date}</div>
                      <div><strong>Slot:</strong> {appt.slotNumber}</div>
                    </div>
                    <div>
                      <div className="pb-2 ">
                        <Button
                          className="me-2"
                          size="sm"
                          variant="success"
                          onClick={() => handleStatusChange(idx, "Completed")}
                        >
                          Done
                        </Button>
                        <Button
                          className="me-2"
                          size="sm"
                          variant="danger"
                          onClick={() => handleStatusChange(idx, "Rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => handleStatusChange(idx, "Rescheduled")}
                        >
                          Reschedule
                        </Button>
                      </div>
                      <div className="pl-32">
                        <button
                          className="sm pl-1.5 pr-1.5 bg-blue-500 rounded-1 pt-0.5 pb-0.5 "
                          onClick={() => handleOpenJitsi(appt.MeetLink)}
                        >
                          Join Meet
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
          </Col>

          <Col md={6}>
            <h5 className="text-primary">Previous Appointments</h5>
            {previousAppointments.map((appt, idx) => (
              <Card
                key={idx}
                className="mb-3 border-start border-4 border-primary shadow-sm"
              >
                <Card.Body>
                  <p>
                    <strong>Patient ID:</strong> {appt.patientId}
                  </p>
                  <p>
                    <strong>Date:</strong> {appt.date}
                  </p>
                  <p>
                    <strong>Slot:</strong> {appt.slotNumber}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge bg-${
                        appt.appStatus === "Completed"
                          ? "success"
                          : appt.appStatus === "Rejected"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {appt.appStatus}
                    </span>
                  </p>
                  {appt.reasonForReject && (
                    <p className="text-danger">
                      <strong>Reason:</strong> {appt.reasonForReject}
                    </p>
                  )}
                  {appt.prescription && (
                    <p className="text-success">
                      <strong>Prescription:</strong> {appt.prescription}
                    </p>
                  )}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
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
        name={todayAppointments[prescriptionIndex]?.patientId || ""}
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
    </Container>
  );
};

export default DoctorDashboard;
