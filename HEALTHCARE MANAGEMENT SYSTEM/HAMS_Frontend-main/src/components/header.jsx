import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { FaRegHospital } from "react-icons/fa";
import HeartBeatLine from "./heartBeat.jsx"; 

import { useAuth } from "../contexts/AuthContext";
import { Snackbar } from "@mui/material";

import axios from "axios";

const HeaderSection = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [reason, setReason] = useState("");
  const [step, setStep] = useState(1);
  const [hospitals, setHospitals] = useState([]);
  const navigate = useNavigate();
  const user = useAuth();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const handleBookClick = () => setShowPopup(true);

  const appointmentMessage = (user) => {
    if (user.role === null) {
      return "Login as a patient to Book Appointment";
    } else if (user.role === "doctor") {
      return "Login as a patient to Book Appointment";
    } else {
      return "Click to Book Appointments";
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    setStep(1);
    setSelectedSpecialization("");
    setReason("");
  };

  const sectionStyle = {
    backgroundImage: `url("/headerpic2.jpg")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    height: "550px",
    width: "99vw",
  };

  const specializations = [
    { name: "General Medicine", icon: "🩺" },
    { name: "Pediatrics", icon: "🧒" },
    { name: "Cardiology", icon: "💔" },
    { name: "Dermatology", icon: "🧴" },
    { name: "Orthopedics", icon: "🦴" },
    { name: "Gynecology", icon: "🤰" },
    { name: "Psychiatry", icon: "💬" },
    { name: "ENT (Otorhinolaryngology)", icon: "👂" },
    { name: "Ophthalmology", icon: "👁️" },
    { name: "Neurology", icon: "🧠" },
    { name: "Oncology", icon: "🎗️" },
    { name: "Urology", icon: "🚽" },
    { name: "Nephrology", icon: "💊" },
    { name: "Gastroenterology", icon: "🍽️" },
    { name: "Pulmonology", icon: "🌬️" },
    { name: "Endocrinology", icon: "🧬" },
    { name: "Radiology", icon: "📷" },
    { name: "Anesthesiology", icon: "💤" },
    { name: "Dentistry", icon: "🦷" },
  ];

  const reasonMap = {
    "General Medicine": ["Fever", "Cold and Cough", "General Checkup"],
    Pediatrics: ["Child Vaccination", "Fever in Child"],
    Cardiology: ["Chest Pain", "High BP", "Heart Palpitations"],
    Dermatology: ["Skin Rash", "Acne", "Hair Loss"],
    Orthopedics: ["Fracture", "Joint Pain", "Back Pain"],
    Gynecology: ["Pregnancy Checkup", "Menstrual Issues"],
    Psychiatry: ["Depression", "Anxiety", "Sleep Disorders"],
    "ENT (Otorhinolaryngology)": ["Ear Pain", "Hearing Loss"],
    Ophthalmology: ["Vision Checkup", "Eye Pain"],
    Neurology: ["Headache", "Seizures", "Memory Loss"],
    Oncology: ["Cancer Screening", "Chemotherapy"],
    Urology: ["Kidney Stone", "UTI"],
    Nephrology: ["Kidney Function Issues", "Dialysis"],
    Gastroenterology: ["Acidity", "Stomach Pain"],
    Pulmonology: ["Cough", "Asthma", "Breathlessness"],
    Endocrinology: ["Diabetes", "Thyroid Disorders"],
    Radiology: ["X-Ray", "MRI", "CT Scan"],
    Anesthesiology: ["Pre-Surgery Consultation", "Pain Management"],
    Dentistry: ["Toothache", "Cavity", "Braces"],
  };

  const currentReasons = reasonMap[selectedSpecialization] || [];

  useEffect(() => {
    const lat = localStorage.getItem("latitude");
    const lon = localStorage.getItem("longitude");
    axios
      .get(`${base_url}/hospitals/getAll/${lat}/${lon}`)
      .then((response) => setHospitals(response.data))
      .catch((error) => console.error("Error fetching hospitals:", error));
  }, []);

  return (
    <div
      style={sectionStyle}
      className="d-flex justify-content-center align-items-center flex-column text-center m-0 p-0"
    >
  <div
  onClick={handleBookClick}
  className="relative w-[320px] h-[180px] bg-gradient-to-br from-pink-100 via-blue-100 to-purple-200 border border-blue-00 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group glowing-border"
>
  <HeartBeatLine />

  <div className="absolute inset-0 flex flex-col justify-center items-center z-10 text-center px-6">
    

    <h5 className="pulse-title heartbeat-text text-white text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-900 px-5 py-2 rounded-xl shadow-lg">
      Book Appointment
    </h5>
  </div>
</div>





      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white p-4 rounded position-relative d-flex"
            style={{ width: "800px", minHeight: "500px" }}
          >
            <button
              className="btn-close position-absolute top-0 end-0 m-2 p-1"
              onClick={handleClose}
            ></button>

            <div className="flex flex-col justify-start pr-4 border-r w-52">
              <h4 className="mb-4 text-lg font-semibold">Hi</h4>
              <p className="text-gray-500 text-sm">Follow the steps below:</p>
              <hr className="my-3" />

              {[
                { stepNum: 1, label: "Specialization" },
                { stepNum: 2, label: "Reason" },
                { stepNum: 3, label: "Select Hospital" },
              ].map(({ stepNum, label }) => (
                <div
                  key={stepNum}
                  className={`flex items-center mb-3 cursor-pointer transition-colors ${
                    step === stepNum
                      ? "text-blue-600 font-semibold"
                      : "text-gray-900"
                  }`}
                  onClick={() => setStep(stepNum)}
                >
                  <div
                    className={`border rounded-full flex items-center justify-center w-8 h-8 text-sm ${
                      step === stepNum ? "border-blue-600" : "border-gray-300"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className="ml-3 text-sm">{label}</span>
                </div>
              ))}
            </div>

            {/* Step content */}
            <div className="ps-4 w-100">
              {step === 1 && (
                <>
                  <h5>Select Specialization</h5>
                  <div
                    className="row row-cols-3 g-3 mt-3 overflow-auto"
                    style={{ maxHeight: "350px" }}
                  >
                    {specializations.map((spec) => (
                      <div key={spec.name} className="col text-center">
                        <div
                          className={`border rounded py-3 px-2 h-100 ${
                            selectedSpecialization === spec.name
                              ? "bg-primary text-white"
                              : "bg-light"
                          } hover-shadow`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSelectedSpecialization(spec.name);
                            setReason("");
                            setStep(2);
                          }}
                        >
                          <div style={{ fontSize: "24px" }}>{spec.icon}</div>
                          <div className="mt-1">{spec.name}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex flex-col gap-4">
                    <h5 className="text-lg font-semibold text-gray-800">
                      Reason for visiting a{" "}
                      <span className="text-blue-600">
                        {selectedSpecialization}
                      </span>{" "}
                      Doctor
                    </h5>
                    <select
                      className="form-select mt-2 p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      value={reason}
                      onChange={(e) => {
                        const selectedReason = e.target.value;
                        setReason(selectedReason);
                        if (selectedReason) {
                          setStep(3);
                        }
                      }}
                    >
                      <option value="">-- Select Reason --</option>
                      {currentReasons.map((r, idx) => (
                        <option key={idx} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="flex flex-col gap-4">
                    <h5 className="text-lg font-semibold text-gray-800">
                      Select Hospital
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-96 pr-2">
                      {hospitals.map((hosp) => (
                        <div key={hosp.RegId} className="col text-center">
                          <div
                            className="border rounded py-3 bg-gray-50 hover:bg-blue-50 hover:shadow transition duration-200 text-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              setShowPopup(false);
                              navigate(
                                `/${
                                  hosp.hospitalName.split(" ")[0]
                                }/doctors-available`,
                                {
                                  state: {
                                    hname: hosp.hospitalName,
                                    specialization: selectedSpecialization,
                                    reason: reason,
                                  },
                                }
                              );
                            }}
                          >
                            <div className="text-2xl mb-2">🏥</div>
                            <div className="text-sm font-medium text-gray-700">
                              {hosp.hospitalName}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => [setSnackbarOpen(false), setSnackbarMessage("")]}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <div
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "12px 16px",
            borderRadius: "4px",
          }}
        >
          {snackbarMessage}
        </div>
      </Snackbar>
    </div>
  );
};

export default HeaderSection;
