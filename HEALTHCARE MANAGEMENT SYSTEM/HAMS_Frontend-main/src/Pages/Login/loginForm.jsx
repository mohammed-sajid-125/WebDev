import { useState } from "react";
import { TextField, Button, FormControlLabel, Checkbox } from "@mui/material";
import PasswordField from "../../components/passwordField";
import Toggle from "./toggle";
export default function LoginForm({
  formData,
  handleChange,
  handleLoginSubmit,
  handleRoleChange,
}) {
  const [role, setRole] = useState("patient");

  const toggleRole = (newRole) => {
    setRole(newRole);
    handleRoleChange(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Login Form */}
      <form className="space-y-4" onSubmit={handleLoginSubmit}>
        <div className="flex flex-col gap-4">
          <TextField
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <PasswordField
            value={formData.password || ""}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end items-center">
          <Button
            variant="text"
            size="small"
            className="text-blue-600 normal-case"
          >
            <div className="text-xs">Forgot Password?</div>
          </Button>
        </div>

        {/* Toggle */}
        <Toggle role={role} onRoleChange={toggleRole} />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="!bg-blue-600 !text-white py-3 rounded-full hover:!bg-blue-700 transition-all duration-300"
        >
          Log In
        </Button>
      </form>
    </div>
  );
}
