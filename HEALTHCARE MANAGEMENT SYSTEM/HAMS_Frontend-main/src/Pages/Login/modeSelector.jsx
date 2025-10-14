import { useState } from "react";
import Typography from "@mui/material/Typography";
import LoginForm from "./loginForm";
import PersonIcon from "@mui/icons-material/Person";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

const roles = [
  {
    label: "Patient",
    value: "patient",
    icon: <PersonIcon fontSize="large" />,
    color: "blue",
  },
  {
    label: "Doctor",
    value: "doctor",
    icon: <MedicalServicesIcon fontSize="large" />,
    color: "green",
  },
  {
    label: "Hospital",
    value: "hospital",
    icon: <LocalHospitalIcon fontSize="large" />,
    color: "red",
  },
];

export default function ModeSelector({ handleSubmit }) {
  const [mode, setMode] = useState("Login");
  const [signUpRole, setSignUpRole] = useState("");

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const renderRoleButton = ({ label, value, icon, color }) => (
    <button
      key={value}
      onClick={() => handleSubmit(null, null, mode, value)}
      className={`w-full flex flex-col items-center justify-center gap-2 rounded-xl py-6 bg-${color}-50 hover:bg-${color}-100 text-${color}-800 transition duration-300 shadow`}
    >
      {icon}
      <span className="font-semibold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex items-center justify-center bg-gradient-to-br">
      <div className="w-full max-w-[400px] min-w-[350px] bg-white p-10 rounded-3xl space-y-6">
        <Typography variant="h5" className="text-center font-bold mb-2">
          {mode === "Login" ? "Login" : "Sign Up"}
        </Typography>

        {/* Top Toggle */}
        <div className="flex bg-gray-200 rounded-md p-1">
          <button
            onClick={() => {
              setMode("Login");
              setSignUpRole("");
            }}
            className={`flex-1 py-2 rounded-md font-semibold transition-all duration-300 ${
              mode === "Login" ? "bg-white text-black shadow" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setMode("SignUp");
              setSignUpRole("");
            }}
            className={`flex-1 py-2 rounded-md font-semibold transition-all duration-300 ${
              mode === "SignUp" ? "bg-white text-black shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {mode === "Login" && (
          <LoginForm
            formData={formData}
            handleChange={handleChange}
            handleLoginSubmit={(e) =>
              handleSubmit(e, formData, mode, signUpRole)
            }
            handleBack={() => setMode("Select")}
            handleRoleChange={(role) => setSignUpRole(role)}
          />
        )}

        {/* Sign Up Mode — Only role selection */}
        {mode === "SignUp" && (
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center text-lg font-semibold text-gray-700">
              Register As
            </div>

            {/* Button Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {roles.map(renderRoleButton)}
            </div>
          </div>
        )}

        {/* Bottom Link */}
        {mode === "Login" && (
          <Typography variant="body2" className="text-center">
            Don’t have an account?{" "}
            <button
              onClick={() => setMode("SignUp")}
              className="text-blue-600 font-medium"
            >
              Register
            </button>
          </Typography>
        )}
      </div>
    </div>
  );
}
