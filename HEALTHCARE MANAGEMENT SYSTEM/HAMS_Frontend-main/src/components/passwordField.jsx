import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function PasswordField({ value, onChange, ...props }) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label="Password"
      name = "password"
      type={show ? "text" : "password"}
      value={value}
      onChange={onChange}
      InputProps={{
        minLength: 6,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow((prev) => !prev)} edge="end">
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      fullWidth
      required
      {...props}
    />
  );
}
