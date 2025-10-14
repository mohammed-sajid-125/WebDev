import { useState, useEffect } from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider,useAuth } from "./contexts/AuthContext";
import AppointmentsPage from "./Pages/PatientDashboard/appointmentsPage";
import DashboardHome from "./Pages/PatientDashboard/DashboardHome";
import Settings from "./Pages/PatientDashboard/components/Settings";
import Home from "./Pages/Home";
import Navbar from "./components/navbar";
import DoctorsAvailable from "./components/DoctorsAvailable";
import DoctorDescription from "./components/DoctorDescription";
import RegisterForm from "./Pages/Login/registerForm";
import Confirmation from "./components/Confirmation";
import DoctorDashboard from "./Pages/DoctorDashboard/Dashboard";
import PatientDashboard from "./Pages/PatientDashboard/patientDashboard";
import AboutUs from "./components/Aboutus";
import FAQs from "./components/FAQs";
import Services from "./components/Services";
import CalendarWithSlots from "./Pages/DoctorDashboard/CalendarWithSlots";
import AppointmentDetails from "./Pages/DoctorDashboard/AppointmentDetails";
import EditProfile from "./Pages/DoctorDashboard/EditProfile"
import DashboardLayout from "./Pages/DoctorDashboard/DashboardLayout";
import RoleBasedRoute from "./RoleBasedRoute";
import { getCityFromCoords } from "./utils/locationUtils";
import Unauthorized from './components/Unauthorized';
import QueuePage from './Pages/DoctorDashboard/components/AppList';
import HeartBeatLine from "./components/heartBeat";
import PatientReviews from "./Pages/PatientDashboard/PatientReviews";

import "bootstrap/dist/css/bootstrap.min.css";

// Layout for public pages (with navbar)
const MainLayout = ({ location, setLocation }) => (
  <>
    <Navbar location={location} setLocation={setLocation} />
    <Outlet />
  </>
);

// Route handler for /dashboard entry
const DashboardRouter = () => {
  const { role } = useAuth();

  if (role === "doctor") {
    return <Navigate to="/dashboard/home" replace />;
  }

  if (role === "patient") {
    return <Navigate to="/dashboard/patient" replace />;
  }

  return <Navigate to="/" replace />;
};

const App = () => {
  const [location, setLocation] = useState("Select Location");

  useEffect(() => {
    if (location && location !== "Select Location") {
      localStorage.setItem("userLocation", location);
    }
  }, [location]);

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setLocation(savedLocation);
    } else if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const city = await getCityFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          setLocation(city);
          localStorage.setItem("userLocation", city);
          localStorage.setItem("latitude", position.coords.latitude);
          localStorage.setItem("longitude", position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLocation("Unavailable");
        }
      );
    } else {
      setLocation("Not supported");
    }
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public pages */}
        <Route element={<MainLayout location={location} setLocation={setLocation} />}>
          <Route path="/" element={<Home />} />
          <Route path="/doctors-available" element={<DoctorsAvailable />} />
          <Route path="/:hospital/doctors-available" element={<DoctorsAvailable />} />
          <Route path="/doctor-description" element={<DoctorDescription />} />
          <Route path="/:hospital/doctors-available/DoctorDescription" element={<DoctorDescription />} />
          <Route path="/login" element={<RegisterForm />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/unauthorize" element={<Unauthorized />} />
          <Route path="/appList" element={<QueuePage />} />
          <Route path="/heart" element={<HeartBeatLine />} />
        </Route>

        {/* Entry route - decide between doctor or patient */}
        <Route
          path="/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["doctor", "patient"]}>
              <DashboardRouter />
            </RoleBasedRoute>
          }
        />

        {/* Patient dashboard route */}
        <Route path="/dashboard/patient" element={<PatientDashboard />}>
        <Route index element={<DashboardHome />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="reviews" element={<PatientReviews />} />
        <Route path="/dashboard/patient/settings" element={<Settings />} />
        </Route>

        {/* Doctor-specific dashboard layout and subroutes */}
        <Route
          path="/dashboard/*"
          element={
            <RoleBasedRoute allowedRoles={["doctor"]}>
              <DashboardLayout />
            </RoleBasedRoute>
          }
        >
          <Route path="home" element={<DoctorDashboard />} />
          <Route path="appointments" element={<QueuePage />} />
          <Route path="appointments/:appointmentId" element={<AppointmentDetails />} />
          <Route path="slots" element={<CalendarWithSlots />} />
          <Route path="editProfile" element={<EditProfile />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
