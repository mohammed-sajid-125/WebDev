import { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  Snackbar,
} from "@mui/material";
import SPECIALIZATIONS from "../../constants/specializations";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../contexts/AuthContext";

export const EditProfile = () => {
  const reqfields = [
    "name",
    "phone",
    "email",
    "medicalReg",
    "gender",
    "specialization",
    "hospital" || "Hospital",
  ];
  const { login } = useAuth();
  const [formData, setFormData] = useState({});
  const [doctor, setDoctor] = useState({});
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleChange({ target: { name: "photo", value: file } });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchDoctor = async () => {
      const newToken = localStorage.getItem("token");
      try {
        const res = await axios.get(`${base_url}/doctors/profile`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setDoctor(res.data.doctor);
        setFormData(res.data.doctor);
        if (res.data.doctor?._id) {
          localStorage.setItem("doctorId", res.data.doctor._id);
          localStorage.setItem("doctor", JSON.stringify(res.data.doctor));
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      }
    };

    fetchDoctor();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(formData);
      const newToken = localStorage.getItem("token");
      const formEdit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "photo" && key != "location" && key != "availableSlots") {
          formEdit.append(key, value);
        }
      });

      const lat = localStorage.getItem("latitude");
      const lon = localStorage.getItem("longitude");
      const location = {
        type: "Point",
        coordinates: [lon, lat],
      };

      formEdit.append("location", JSON.stringify(location)); // to convert the location to a json data we need this
      formEdit.append(
        "availableSlots",
        JSON.stringify(formData.availableSlots)
      );
      if (formData.photo instanceof File) {
        formEdit.append("photo", formData.photo);
      }

      for (let [key, value] of formEdit.entries()) {
        console.log(`${key}:`, value);
      }
      const res = await axios.put(`${base_url}/doctors/editProfile`, formEdit, {
        headers: {
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      login(res.data.newToken);
      setSnackbarOpen(true);
      console.log(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctor?.photo?.url) {
      setImagePreview(doctor.photo.url);
    }
  }, [doctor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>

        <form onSubmit={handleEditSubmit}>
          
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow cursor-pointer"
                onClick={() => fileInputRef.current.click()}
                title="Click to upload"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="upload" className="w-full h-full object-cover" />
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
              <p className="mb-1 text-gray-500 text-xs">(No larger than 5MB)</p>
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current.click()}
                size="small"
              >
                {doctor.photo ? "Change Photo" : "Upload Photo"}
              </Button>
            </div>

            <div className="mt-5 flex justify-around">
            <div>
              <div>
                {Object.entries(doctor).map(([key, value]) => {
                  if (reqfields.includes(key)) {
                    return (
                      <div key={key}>
                        {key === "specialization" ? (
                          <TextField
                            select
                            name="specialization"
                            value={formData.specialization || ""}
                            onChange={handleChange}
                            fullWidth
                            required
                            label="Specialization"
                            className="mb-4"
                            sx={{
                              width: "30vw",
                              input: { color: "black" },
                              label: { color: "grey" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "grey" },
                                "&:hover fieldset": { borderColor: "blue" },
                              },
                            }}
                          >
                            <MenuItem value="">Select Specialization</MenuItem>
                            {SPECIALIZATIONS.map((spec) => (
                              <MenuItem key={spec} value={spec}>
                                {spec}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : key === "gender" ? (
                          <TextField
                            select
                            fullWidth
                            label="Gender"
                            name="gender"
                            value={formData.gender || value || ""}
                            onChange={handleChange}
                            className="mb-4"
                            sx={{
                              width: "100px",
                              input: { color: "black" },
                              label: { color: "grey" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": { borderColor: "grey" },
                                "&:hover fieldset": { borderColor: "blue" },
                              },
                            }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </TextField>
                        ) : (
                          <TextField
                            fullWidth
                            label={key.replace(/([A-Z])/g, " $1")}
                            name={key}
                            type="text"
                            value={formData[key] ?? value ?? ""}
                            onChange={handleChange}
                            className="w-[20vw] mb-4"
                            sx={{
                              input: { color: "black" },
                              label: { color: "grey" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "grey",
                                },
                                "&:hover fieldset": {
                                  cursor: "pointer",
                                  borderColor: "blue",
                                },
                              },
                            }}
                          />
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
                <div className="flex justify-end mt-6">
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={loading}
                    sx={{ px: 2, py: 1 }}
                  >
                    {"Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Overview
              </Typography>
              <TextField
                fullWidth
                name="overview"
                type="text"
                value={formData.overview}
                onChange={handleChange}
                multiline
                maxRows={15}
                sx={{
                  width:'40vw',
                  backgroundColor: "#f9fafb",
                  input: { color: "black" },
                  "& .MuiInputLabel-root": { color: "grey" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "grey",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                  mb: 3,
                }}
              />

            </div>
          </div>
        </form>
      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        message="Profile updated successfully!"
        autoHideDuration={3000}
      /> ,</>
  );
};

export default EditProfile;
