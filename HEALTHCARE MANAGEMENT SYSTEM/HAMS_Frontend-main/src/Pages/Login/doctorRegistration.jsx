import { useRef, useEffect, useState } from "react";
import CommonFields from "./commonFields";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import SPECIALIZATIONS from "../../constants/specializations";
import axios from "axios";
import { InputAdornment } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function DoctorRegisterForm({
  formData,
  handleChange,
  handleRegisterSubmit,
}) {
  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!formData) return;

    if (!formData.workingHoursFrom) {
      handleChange({ target: { name: "workingHoursFrom", value: "09:00" } });
    }
    if (!formData.workingHoursTo) {
      handleChange({ target: { name: "workingHoursTo", value: "17:00" } });
    }
  }, [formData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange({ target: { name: "photo", value: file } });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // Fetch hospitals on mount
  useEffect(() => {
    const lat = localStorage.getItem("latitude");
    const lon = localStorage.getItem("longitude");

    axios
      .get(`${base_url}/hospitals/getAll/${lat}/${lon}`)
      .then((response) => setHospitals(response.data))
      .catch((error) => console.error("Error fetching hospitals:", error));
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md space-y-6">
      {/* Back Button */}

      <h2 className="text-2xl font-bold text-center">Doctor Registration</h2>

      <form onSubmit={handleRegisterSubmit} className="justify-center">
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col md:flex-row items-start gap-6">
              
              <div className="flex flex-col items-center gap-2 flex-1">
                <div
                  className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                  title="Click to upload"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Upload Photo
                    </div>
                  )}
                </div>

                <input
                  name="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <Button
                  variant="outlined"
                  onClick={() => fileInputRef.current.click()}
                  size="small"
                >
                  {formData.photo ? "Change Photo" : "Upload Photo"}
                </Button>
              </div>

              {/* Common Fields */}
              <div className="flex-2">
                <CommonFields formData={formData} handleChange={handleChange} />
              </div>
            </div>
            {/* Password */}
            <TextField
              label="Password"
              name="password"
              autoComplete="new-password"
              type={show ? "text" : "password"}
              value={formData.password || ""}
              onChange={handleChange}
              InputProps={{
                minLength: 6,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShow(!show)}
                      edge="end"
                      aria-label={show ? "Hide password" : "Show password"}
                    >
                      {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
              required
            />
            <div className="flex justify-between gap-4 mt-2">
              <TextField
                select
                label="Gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>

              <TextField
                label="Experience (years)"
                name="experience"
                type="number"
                autoComplete="off"
                value={formData.experience || ""}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ min: 0, max: 60 }}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-4 mt-3">
            {/* Medical Registration Number */}
            <TextField
              label="Medical Registration Number"
              name="medicalReg"
              autoComplete="off"
              value={formData.medicalReg || ""}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* Specialization */}
            <TextField
              select
              label="Specialization"
              name="specialization"
              value={formData.specialization || ""}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">Select Specialization</MenuItem>
              {SPECIALIZATIONS.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </TextField>

            {/* Organisation/Hospital */}
            <TextField
              select
              label="Hospital"
              name="Hospital"
              value={formData.Hospital || ""}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="">Select hospital</MenuItem>
              {hospitals.map((hosp) => (
                <MenuItem key={hosp.hospitalId} value={hosp.hospitalName}>
                  {hosp.hospitalName}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Basic Consultation Fees"
              name="basicFee"
              type="number"
              value={formData.basicFee || ""}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., 500"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 },
              }}
            />

            <div className="flex gap-6">
              <TextField
                label="Working Hours (From)"
                name="workingHoursFrom"
                type="time"
                value={formData.workingHoursFrom || "09:00"}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }} // 5 min steps
                fullWidth
                required
              />
              <TextField
                label="Working Hours (To)"
                name="workingHoursTo"
                type="time"
                value={formData.workingHoursTo || "17:00"}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
                fullWidth
                required
              />
            </div>
          </div>
        </div>
        <div className="flex mt-4 justify-center">
          {/* Submit Button */}
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
