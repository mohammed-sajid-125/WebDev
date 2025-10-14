import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const DoctorsAvailable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const location = useLocation();
  const { hname = "", reason = "General Checkup", specialization = "" } = location.state || {};

  useEffect(() => {
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    if (!latitude || !longitude) {
      setError("Location not set. Please allow location access.");
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get(`${base_url}/doctors/nearby/${latitude}/${longitude}`)
      .then((res) => {
        setDoctors(res.data || []);
        setError("");
      })
      .catch(() => {
        setError("Failed to fetch doctors. Please try again.");
        setDoctors([]);
      })
      .finally(() => setLoading(false));
  }, [base_url]);

  const filteredDoctors = useMemo(() => {
    if (!specialization) return doctors;
    return doctors.filter(
      (doc) =>
        doc.specialization?.toLowerCase() === specialization.toLowerCase()
    );
  }, [doctors, specialization]);

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Doctors Available</h2>
      {specialization && (
        <p className="text-center text-muted">
          Showing doctors specialized in <strong>{specialization}</strong>
        </p>
      )}
      {hname && (
        <p className="text-center text-muted">
          from <strong>{hname}</strong>
        </p>
      )}
      {loading && <div className="text-center my-5">Loading doctors...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {!loading && !error && (
        <div className="row">
          {filteredDoctors.map((doc) => (
            <div className="col-md-4 mb-4" key={doc._id}>
              <div className="card p-3 shadow-sm h-100">
                <img
                  src={doc.photo?.url || "/default.avif"}
                  className="card-img-top rounded"
                  alt={doc.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{doc.name}</h5>
                  <p className="card-text">
                    <strong>Specialization:</strong> {doc.specialization || "General"}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(
                        `/${(hname || "hospital").split(" ")[0]}/doctors-available/DoctorDescription`,
                        {
                          state: {
                            doctor: { ...doc },
                            hname: { hosp: hname },
                            reason: reason || "General Checkup",
                          },
                        }
                      )
                    }
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <p className="text-center mt-4">
              No doctors found for the selected specialization and hospital.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorsAvailable;
