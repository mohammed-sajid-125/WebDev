import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StarRating from "../components/RatingStars";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import React from "react"; // Needed for forwardRef

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const DoctorDescription = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isOn, setIsOn] = useState(false); // Payment done
  const [isSet, setIsSet] = useState(false); // false = Offline, true = Online
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const state = location.state || {};
  const doctor = state.doctor || null;
  const doctorId = doctor?.doctorId || state?.doctorId;
  const reason = state?.reason || "General Checkup";

  useEffect(() => {
    if (!doctorId) return;

    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors/${doctorId}/profile`);
        setDoctorDetails(res.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  // Fetch reviews for the doctor
  useEffect(() => {
    if (!doctorId) return;

    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await axios.get(`${base_url}/reviews/${doctorId}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate || !doctorId) return;

    const fetchSlots = async () => {
      try {
        const res = await axios.get(`${base_url}/doctors/${doctorId}/slots`);
        const allSlots = res.data?.availableSlots || {};
        const dateKey = new Date(selectedDate).toISOString().split("T")[0];
        setAvailableSlots(allSlots[dateKey] || []);
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableSlots([]);
      }
    };

    const fetchBooked = async () => {
      const dateKey = new Date(selectedDate).toISOString().split("T")[0];
      try {
        const res = await axios.get(
          `${base_url}/doctors/${doctorId}/booked-slots?date=${encodeURIComponent(
            dateKey
          )}`
        );
        setBookedSlots(res.data.bookedSlots || []);
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        setBookedSlots([]);
      }
    };

    fetchSlots();
    fetchBooked();
  }, [selectedDate, doctorId]);

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleBookNow = async () => {
    if (!selectedDate || !selectedSlot) {
      showSnackbar(
        "Please select a date and time slot before booking.",
        "warning"
      );

      return;
    }

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const payload = {
      date: selectedDate,
      doctorId,
      Hospital: doctorDetails?.Hospital || "Own Practice",
      slotNumber: selectedSlot,
      reason,
      payStatus: isOn ? "Paid" : "Unpaid",
      consultStatus: isSet ? "Online" : "Offline",
    };

    try {
      const response = await axios.post(
        `${base_url}/appointments/book`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        showSnackbar("Appointment booked successfully!", "success");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
        
      }
    } catch (error) {
      if (error.response?.status === 409) {
        showSnackbar(
          "This slot has already been booked. Please choose another.",
          "error"
        );
      } else {
        showSnackbar("Failed to book appointment. Please try again.", "error");
      }
      console.error("Booking error:", error);
    }
  };

  // Show loading while fetching doctorDetails
  if (!doctorDetails) {
    return <div className="text-center my-5">Loading doctor details...</div>;
  }

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Doctor Description</h2>

      <div className="flex md:flex-row flex-col justify-between p-5 bg-[#10217D] rounded-3xl">
        <div className="col-md-8">
          <div className="d-flex align-items-start gap-4">
            <img
              src={doctorDetails?.photo?.url || "/default.avif"}
              alt="Doctor"
              className="rounded-full"
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />

            <div>
              <h3 className="fw-bold text-white">
                {doctorDetails?.name || "Doctor Name"}
              </h3>
              {doctorDetails?.experience && (
                <p className="text-white mb-1">
                  {doctorDetails.experience} Years Experience
                </p>
              )}
              <p className="text-white mb-1">
                <strong>Specialization:</strong>{" "}
                {doctorDetails?.specialization || "General"}
              </p>
              <p className="text-white mb-1">
                <strong>Languages:</strong>{" "}
                {doctorDetails?.languages?.join(", ") || "English"}
              </p>
              <p className="text-white mb-1">
                <strong>Qualifications:</strong>{" "}
                {doctorDetails?.qualifications?.join(", ") || "MBBS"}
              </p>
              <p className="text-white mb-1">
                <strong>Basic Fee:</strong> ₹ {doctorDetails?.basicFee || "0"}
              </p>
              <p className="text-white mb-1">
                <strong>Hospital Name:</strong>{" "}
                {doctorDetails?.Hospital || "Not Provided"}
              </p>
              <p className="text-white mb-1">
                <strong>Timings:</strong> MON-FRI (
                {doctorDetails?.workingHours?.from || "09:00 AM"} -{" "}
                {doctorDetails?.workingHours?.to || "04:00 PM"})
              </p>

              {doctorDetails?.averageRating && (
                <StarRating rating={doctorDetails.averageRating} />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mt-4 mt-md-0">
          <div className="card p-3 shadow-sm">
            <h6 className="fw-bold mb-2">Select Date</h6>
            <input
              type="date"
              className="form-control mb-3"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <h6 className="fw-bold mb-2">Available Slots:</h6>
            <div className="d-flex flex-wrap gap-2 mb-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedSlot === slot;

                  const handleClick = () => {
                    if (isBooked) {
                      showSnackbar(
                        "This slot is already booked. Please choose another.",
                        "error"
                      );

                      return;
                    }
                    setSelectedSlot(slot);
                  };

                  return (
                    <button
                      disabled={isBooked}
                      key={slot}
                      className={`btn btn-sm ${
                        isBooked
                          ? "btn-secondary"
                          : isSelected
                          ? "btn-warning"
                          : "btn-outline-warning"
                      }`}
                      onClick={handleClick}
                    >
                      {slot}
                    </button>
                  );
                })
              ) : (
                <p className="text-muted">
                  No slots available for selected date
                </p>
              )}
            </div>

            <div className="flex gap-2 items-center justify-between my-2">
              <p className="m-0">Mode of Consulting:</p>
              <div className="flex gap-2 mt-2">
                <div
                  onClick={() => setIsSet(false)}
                  className={`px-2 py-1 rounded-full cursor-pointer transition-colors ${
                    !isSet
                      ? "bg-blue-400 text-white font-semibold"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Offline
                </div>
                <div
                  onClick={() => setIsSet(true)}
                  className={`px-2 py-1 rounded-full cursor-pointer transition-colors ${
                    isSet
                      ? "bg-blue-400 text-white font-semibold"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Online
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center my-2">
              <p className="m-0">Payment done:</p>
              <div
                onClick={() => setIsOn(!isOn)}
                className={`ms-2 w-10 h-5 d-flex align-items-center rounded-pill p-1 cursor-pointer ${
                  isOn ? "bg-success" : "bg-secondary"
                }`}
                style={{ minWidth: "40px" }}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-circle shadow transform transition ${
                    isOn ? "translate-x-6" : ""
                  }`}
                />
              </div>
              <span className="ms-2">{isOn ? "Paid" : "Unpaid"}</span>
            </div>

            <button
              className="btn btn-outline-primary w-100"
              onClick={handleBookNow}
              disabled={!selectedSlot}
              title={!selectedSlot ? "Please select a slot" : ""}
            >
              {isLoggedIn
                ? "BOOK APPOINTMENT"
                : "Please Login to book an appointment"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h4 className="fw-bold">Overview</h4>
        <p>{doctorDetails?.overview || "No overview available."}</p>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
  onClose={() => setSnackbarOpen(false)}
  severity={snackbarSeverity}
  sx={{ width: "100%" }}
>
  {snackbarMessage}
</Alert>

      </Snackbar>

      {/* Reviews Section */}
      <div className="mt-5">
        <h4 className="fw-bold">Patient Reviews</h4>
        {loadingReviews ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="row">
            {reviews.map((review) => (
              <div key={review._id} className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <img
                        src={review.patientId?.photo?.url || "/default.avif"}
                        alt="Patient"
                        className="rounded-circle me-3"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">
                          {review.patientId?.name || "Anonymous"}
                        </h6>
                        <small className="text-muted">
                          {new Date(review.date).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    <div className="mb-2">
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="card-text">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No reviews yet. Be the first to review this doctor!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDescription;
