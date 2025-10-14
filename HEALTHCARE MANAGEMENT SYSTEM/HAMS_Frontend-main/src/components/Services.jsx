import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MedicalServices = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🏥 Medical Services</h2>
      <p className="text-center text-muted mb-5">
        At <strong>HAMS</strong>, we provide seamless access to essential medical services by connecting patients with trusted healthcare professionals and hospitals nearby.
      </p>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🩺 Doctor Consultations</h5>
              <p className="card-text">
                Connect with experienced general physicians and specialists for physical and virtual consultations based on your symptoms and location.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🧪 Diagnostics & Lab Tests</h5>
              <p className="card-text">
                Book lab tests with certified diagnostic centers. Get home sample collection, accurate results, and digital reports delivered online.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🏥 IPD & OPD Services</h5>
              <p className="card-text">
                Access in-patient and out-patient care in hospitals registered with HAMS. We help you find beds, treatment options, and appointment slots instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">🧠 Mental Health Support</h5>
              <p className="card-text">
                Speak to certified counselors and psychiatrists for mental well-being, stress, anxiety, and depression through private and secure sessions.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">👨‍⚕️ Telemedicine</h5>
              <p className="card-text">
                Consult with doctors online via chat or video. Quick, hassle-free virtual care without stepping out of your home.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">💉 Vaccination Services</h5>
              <p className="card-text">
                Schedule vaccinations for children, adults, or travel needs with nearby hospitals and clinics. Get reminders and follow-up schedules.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">🚑 Emergency Care</h5>
              <p className="card-text">
                Find the nearest emergency room or ambulance services in case of urgent medical needs. Real-time availability and quick routing support included.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalServices;
