import { Button, TextField, Divider } from "@mui/material";
import PasswordField from "../../components/passwordField";

export default function HospitalRegisterForm({
  formData,
  handleChange,
  handleRegisterSubmit,
}) {
  return (
    <div className="w-full max-w-3xl space-y-6 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold text-center mb-5">
        Hospital Registration
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleRegisterSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-1 flex-col gap-3">
            {/* Hospital Name */}
            <TextField
              label="Hospital Name"
              name="hospitalName"
              value={formData.hospitalName || ""}
              onChange={handleChange}
              fullWidth
              required
            />

            {/* Password */}
            <PasswordField
              label="Password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              type="tel"
              inputProps={{ pattern: "[0-9]{10}" }}
              fullWidth
              required
            />
            <TextField
              label="Registration Number"
              name="RegId"
              value={formData.RegId || ""}
              onChange={handleChange}
              fullWidth
              required
            />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              fullWidth
              autoComplete="email"
              required
            />
            {/* Address Section */}
            <Divider className="my-3">Hospital Address</Divider>
            <TextField
              label="Street Address"
              name="addressLine"
              value={formData.addressLine || ""}
              onChange={handleChange}
              fullWidth
              required
            />

            <div className="flex gap-4">
              <TextField
                label="City"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="State"
                name="state"
                value={formData.state || ""}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                label="Pincode"
                name="pincode"
                value={formData.pincode || ""}
                onChange={handleChange}
                type="text"
                inputProps={{ pattern: "[0-9]{6}" }}
                fullWidth
                required
              />
            </div>
          </div>
        </div>
        {/* Submit */}
        <div className="flex justify-center mt-6">
          <Button variant="contained" color="primary" type="submit">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
}
