import { useLocation, useNavigate } from "react-router-dom";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date, slot } = location.state || {};

  if (!date || !slot) {
    return (
      <div className="text-center mt-5">
        <h2>Invalid access. No appointment data found.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h2 className="text-success mb-4">Appointment Confirmed!</h2>
      <p className="lead">
        Your appointment is booked for <strong>{date}</strong> at{" "}
        <strong>{slot}</strong>.
      </p>
      <button className="btn btn-outline-primary mt-4" onClick={() => navigate("/")}>
        Back to Home
      </button>
    </div>
  );
};

export default Confirmation;
