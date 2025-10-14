import { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from "axios";
import {
  RejectModal,
  PrescriptionModal,
  ViewPrescriptionModal
} from "./DoctorModals";
import { CheckCircleIcon, AccessTimeIcon } from "@mui/icons-material";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const DoctorDashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  
  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showViewPrescription, setShowViewPrescription] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [prescriptionIndex, setPrescriptionIndex] = useState(null);
  const [currentPrescription, setCurrentPrescription] = useState("");
  const [viewedPrescription, setViewedPrescription] = useState("");
  const [viewedPatientName, setViewedPatientName] = useState("");

  // Authentication setup
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  // Fetch appointments from backend
  const fetchAppointments = useCallback(async () => {
    const doctorId = localStorage.getItem("doctorId");
    if (!doctorId) return;

    try {
      const today = new Date().toISOString().split("T")[0];
      const [todayRes, prevRes] = await Promise.all([
        axios.get(`${base_url}/appointments/pending/${today}?doctorId=${doctorId}`),
        axios.get(`${base_url}/appointments/previous?doctorId=${doctorId}`),
      ]);
      setTodayAppointments(todayRes.data || []);
      setPreviousAppointments(prevRes.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Update appointment status in backend
  const updateAppointmentStatus = async (apptId, status, reason = "", prescriptionText = "") => {
    try {
      await axios.put(`${base_url}/appointments/update-status/${apptId}`, {
        appStatus: status,
        rejectionReason: reason,
        prescription: prescriptionText,
      });
      return true;
    } catch (err) {
      console.error("Failed to update status:", err);
      return false;
    }
  };

  // Move appointment to history
  const moveToPrevious = (index, status, reason = "", prescription = "") => {
    const appt = todayAppointments[index];
    const updatedToday = [...todayAppointments];
    updatedToday.splice(index, 1);
    setTodayAppointments(updatedToday);

    setPreviousAppointments(prev => [
      ...prev,
      {
        ...appt,
        appStatus: status,
        reasonForReject: reason,
        prescription,
      },
    ]);
  };

  // Handle button actions
  const handleStatusChange = (index, status) => {
    setCurrentIndex(index);

    switch(status) {
      case "Completed":
        setPrescriptionIndex(index);
        setShowPrescriptionModal(true);
        break;
      case "Rejected":
        setShowRejectModal(true);
        break;
      case "Rescheduled":
        const appt = todayAppointments[index];
        updateAppointmentStatus(appt.appId, "Rescheduled");
        moveToPrevious(index, "Rescheduled");
        break;
      default:
        console.warn("Unknown status:", status);
    }
  };

  // Handle rejection confirmation
  const handleRejectConfirm = async () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason.");
      return;
    }
    
    const appt = todayAppointments[currentIndex];
    const success = await updateAppointmentStatus(
      appt.appId, 
      "Rejected", 
      rejectionReason
    );
    
    if (success) {
      moveToPrevious(currentIndex, "Rejected", rejectionReason);
      setShowRejectModal(false);
      setRejectionReason("");
      setCurrentIndex(null);
    }
  };

  // Handle prescription saving
  const handleSavePrescription = async () => {
    const appt = todayAppointments[prescriptionIndex];
    try {
      const success = await updateAppointmentStatus(
        appt.appId, 
        "Completed", 
        "", 
        currentPrescription
      );
      
      if (success) {
        moveToPrevious(prescriptionIndex, "Completed", "", currentPrescription);
        setShowPrescriptionModal(false);
        setCurrentPrescription("");
        setPrescriptionIndex(null);
      }
    } catch (err) {
      console.error("Error saving prescription:", err);
    }
  };

  // View prescription handler
  const handleViewPrescription = (prescription, patientName) => {
    setViewedPrescription(prescription);
    setViewedPatientName(patientName);
    setShowViewPrescription(true);
  };

  return (
    <div className="p-4">
      {/* DashboardHome component with integrated functionality */}
      <DashboardHome
        previousAppointments={previousAppointments}
        todayAppointments={todayAppointments}
        fetchAppointments={fetchAppointments}
        handleStatusChange={handleStatusChange}
        onViewPrescription={handleViewPrescription}
      />
      
      {/* Modals */}
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
        name={todayAppointments[prescriptionIndex]?.name}
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
    </div>
  );
};

// Your DashboardHome component with minor enhancements
const DashboardHome = ({
  previousAppointments = [],
  todayAppointments = [],
  fetchAppointments,
  handleStatusChange,
  onViewPrescription
}) => (
  <div className="p-4">
    {/* Stats Row */}
    <Row className="mb-4">
      <Col md={6} lg={3}>
        <Card className="text-center shadow-sm">
          <Card.Body>
            <Card.Title>Total Patients</Card.Title>
            <h4>
              {previousAppointments.filter((a) => a.appStatus === "Completed").length}
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

    {/* Appointments Row */}
    <Row>
      {/* Today's Appointments */}
      <Col md={6}>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="text-primary mb-0">Today's Appointments</h5>
          <IconButton size="sm" onClick={fetchAppointments}>
            <RefreshIcon/>
          </IconButton>
        </div>
        {todayAppointments.length === 0 ? (
          <p>No appointments for today.</p>
        ) : (
          todayAppointments.map((appt, idx) => (
            <Card key={appt.appId || idx} className="mb-3 shadow-sm">
              <Card.Body className="d-flex justify-content-between">
                <div>
                  <div>
                    <strong>Name:</strong> {appt.name}
                  </div>
                  <div>
                    <strong>Date:</strong> {appt.date}
                  </div>
                  <div>
                    <strong>Slot:</strong> {appt.slotNumber}
                  </div>
                </div>
                <div>
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
              </Card.Body>
            </Card>
          ))
        )}
      </Col>

      {/* Previous Appointments */}
      <Col md={6}>
        <h5 className="text-primary">Previous Appointments</h5>
        {previousAppointments.length === 0 ? (
          <p>No previous appointments.</p>
        ) : (
          previousAppointments.map((appt, idx) => (
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
                  <div>
                    <p className="text-success">
                      <strong>Prescription:</strong> 
                    </p>
                    <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={() => onViewPrescription(appt.prescription, appt.name)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Col>
    </Row>
  </div>
);

export default DoctorDashboard;
