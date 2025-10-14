import TextField from "@mui/material/TextField";

export default function CommonFields({ formData = {}, handleChange }) {
  return (
    <>
      <TextField
        label="Full Name"
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={formData.email || ""}
        onChange={handleChange}
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="Phone Number"
        name="phone"
        type="tel"
        value={formData.phone || ""}
        onChange={handleChange}
        inputProps={{ pattern: "[0-9]{10}" }}
        fullWidth
        required
        margin="normal"
      />
    </>
  );
}
