import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import JitsiMeetModal from "../../Meeting/JitsiMeetModal";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { fetchAllAppointments } from "./fetchAllAppointments";

const PatientDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [jitsiRoom, setJitsiRoom] = useState("");
  const [showJitsi, setShowJitsi] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewMode, setReviewMode] = useState("add");
  const [addReviewData, setAddReviewData] = useState({ doctorId: "", rating: "", comment: "" });
  const [deleteReviewId, setDeleteReviewId] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientReviews, setPatientReviews] = useState([]);
  const [fetchingReviews, setFetchingReviews] = useState(false);
  const [patientDoctors, setPatientDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    logout?.();
    navigate("/", { replace: true });
    alert("Logged out successfully");
  };

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

  const handleReviewClick = () => {
    setShowReviewModal(true);
    setFormMessage("");
    setFormError("");
    setReviewMode("add");
  };
  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setAddReviewData({ doctorId: "", rating: "", comment: "" });
    setDeleteReviewId("");
    setFormMessage("");
    setFormError("");
    setLoading(false);
  };

  const handleAddReviewChange = (e) => {
    setAddReviewData({ ...addReviewData, [e.target.name]: e.target.value });
  };

  // Fetch reviews when switching to delete mode
  useEffect(() => {
    if (showReviewModal && reviewMode === "delete" && user?.patientId) {
      setFetchingReviews(true);
      setFormError("");
      setFormMessage("");
      fetch(`/api/reviews`) // Adjust this endpoint if you have a better one
        .then(res => res.json())
        .then(data => {
          // Filter reviews by current patient
          const reviews = Array.isArray(data) ? data : [];
          setPatientReviews(reviews.filter(r => r.patientId === user.patientId));
          setFetchingReviews(false);
        })
        .catch(err => {
          setFormError("Failed to fetch reviews");
          setFetchingReviews(false);
        });
    }
  }, [showReviewModal, reviewMode, user]);

  // Fetch doctors from appointments when Add Review mode is shown
  useEffect(() => {
    if (showReviewModal && reviewMode === "add" && user?.patientId) {
      setFetchingDoctors(true);
      fetchAllAppointments().then(appointments => {
        const doctorMap = {};
        appointments.forEach(appt => {
          if (appt.doctorId) {
            doctorMap[appt.doctorId] = appt.doctorName || appt.doctorId;
          }
        });
        setPatientDoctors(Object.entries(doctorMap).map(([id, name]) => ({ id, name })));
        setFetchingDoctors(false);
      }).catch(() => {
        setPatientDoctors([]);
        setFetchingDoctors(false);
      });
    }
  }, [showReviewModal, reviewMode, user]);

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormMessage("");
    setFormError("");
    setTimeout(() => {
      setLoading(false);
      setFormMessage("Review added (mock)");
    }, 1000);
  };

  // Delete review by id
  const handleDeleteReview = async (reviewId) => {
    setLoading(true);
    setFormMessage("");
    setFormError("");
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      const result = await res.json();
      if (res.ok) {
        setFormMessage("Review deleted successfully");
        setPatientReviews(patientReviews.filter(r => r._id !== reviewId));
      } else {
        setFormError(result.message || "Failed to delete review");
      }
    } catch (err) {
      setFormError("Failed to delete review");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout}
        onReviewClick={handleReviewClick}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 pb-0">
          <Header />
        </div>

        {/* Render nested routes like /dashboard/patient, /appointments */}
        <Outlet context={{ handleOpenJitsi }} />
      </div>

      {/* Jitsi Modal */}
      <JitsiMeetModal
        show={showJitsi}
        onHide={handleCloseJitsi}
      />

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] max-w-[90vw]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{reviewMode === "add" ? "Add Review" : "Delete Review"}</h2>
              <button onClick={handleCloseReviewModal} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 rounded-l ${reviewMode === "add" ? "bg-cyan-600 text-white" : "bg-gray-200"}`}
                onClick={() => setReviewMode("add")}
                disabled={reviewMode === "add"}
              >
                Add Review
              </button>
              <button
                className={`flex-1 py-2 rounded-r ${reviewMode === "delete" ? "bg-cyan-600 text-white" : "bg-gray-200"}`}
                onClick={() => setReviewMode("delete")}
                disabled={reviewMode === "delete"}
              >
                Delete Review
              </button>
            </div>
            {reviewMode === "add" ? (
              <form onSubmit={handleAddReviewSubmit} className="flex flex-col gap-3">
                {fetchingDoctors ? (
                  <div>Loading your doctors...</div>
                ) : patientDoctors.length === 0 ? (
                  <div className="text-gray-500">No doctors found from your appointments.</div>
                ) : (
                  <select
                    name="doctorId"
                    value={addReviewData.doctorId}
                    onChange={handleAddReviewChange}
                    className="border p-2 rounded"
                    required
                  >
                    <option value="" disabled>Select Doctor</option>
                    {patientDoctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} ({doc.id})</option>
                    ))}
                  </select>
                )}
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (1-5)"
                  min="1"
                  max="5"
                  value={addReviewData.rating}
                  onChange={handleAddReviewChange}
                  className="border p-2 rounded"
                  required
                />
                <textarea
                  name="comment"
                  placeholder="Comment"
                  value={addReviewData.comment}
                  onChange={handleAddReviewChange}
                  className="border p-2 rounded"
                  required
                />
                <button type="submit" className="bg-cyan-600 text-white py-2 rounded mt-2" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div>
                {fetchingReviews ? (
                  <div>Loading your reviews...</div>
                ) : patientReviews.length === 0 ? (
                  <div className="text-gray-500">You have not given any reviews yet.</div>
                ) : (
                  <ul className="space-y-3 max-h-64 overflow-y-auto">
                    {patientReviews.map((review) => (
                      <li key={review._id} className="flex items-center justify-between border-b py-2">
                        <div>
                          <div className="font-semibold">Doctor ID: {review.doctorId}</div>
                          <div>Rating: {review.rating}</div>
                          <div className="text-gray-600 text-sm">{review.comment}</div>
                        </div>
                        <button
                          className="ml-4 text-red-600 hover:text-red-800"
                          title="Delete Review"
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {formMessage && <div className="mt-3 text-green-600">{formMessage}</div>}
            {formError && <div className="mt-3 text-red-600">{formError}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
