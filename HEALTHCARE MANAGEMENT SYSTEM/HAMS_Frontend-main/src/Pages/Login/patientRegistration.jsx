import CommonFields from "./commonFields";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import PasswordField from "../../components/passwordField";
import { useEffect,useRef,useState } from "react";

export default function PatientRegisterForm({
  formData,
  handleChange,
  handleRegisterSubmit,
}) {
   const fileInputRef = useRef(null);
   const [imagePreview, setImagePreview] = useState(null);

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



  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-center">Patient Registration</h2>

      {/* Form */}
      <form onSubmit={handleRegisterSubmit} className="flex flex-col w-full">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col items-center gap-2 flex-1 justify-center">
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
          <div className="flex flex-1 flex-col gap-2">
            <CommonFields formData={formData} handleChange={handleChange} />

            <PasswordField
              value={formData.password || ""}
              onChange={handleChange}
            />

            <div className="flex flex-col md:flex-row gap-4">
              <TextField
                select
                label="Gender"
                name="gender"
                value={formData.gender || ""}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                margin="normal"
              />
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <Divider className="my-2">Address</Divider>
            <TextField
              label="Street"
              name="street"
              value={formData.street || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="City"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <TextField
                label="State"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Postal Code"
                name="postalCode"
                value={formData.postalCode || ""}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </div>

            <Divider className="mt-2">Emergency Contact</Divider>
            <TextField
              label="Contact Name"
              name="emergencyName"
              value={formData.emergencyName || ""}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />
            <div className="flex flex-col md:flex-row gap-4">
              <TextField
                label="Relation"
                name="emergencyRelation"
                value={formData.emergencyRelation || ""}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="emergencyPhone"
                value={formData.emergencyPhone || ""}
                onChange={handleChange}
                inputProps={{ pattern: "[0-9]{10}" }}
                fullWidth
                required
                margin="normal"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
