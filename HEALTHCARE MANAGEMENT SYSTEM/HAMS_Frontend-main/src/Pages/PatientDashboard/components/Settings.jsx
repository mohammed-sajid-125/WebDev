import react,{ useEffect, useState } from "react";
import axios from "axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = react.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


const Settings = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relation: "",
    },
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${base_url}/patients/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData((prev) => ({
          ...prev,
          ...res.data,
          address: { ...prev.address, ...res.data.address },
          emergencyContact: {
            ...prev.emergencyContact,
            ...res.data.emergencyContact,
          },
        }));

        setLoading(false);
      } catch (err) {
        console.error("Failed to load profile:", err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else if (name.startsWith("emergencyContact.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: { ...prev.emergencyContact, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const payload = { ...formData };
      if (!payload.password) delete payload.password;

      await axios.put(`${base_url}/patients/update-profile`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="p-4 text-lg text-gray-600">Loading profile...</p>
      </div>
    );

  return (
    <div className=" mx-4 rounded-lg shadow-lg p-3 bg-white my-8">
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg("")}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccessMsg("")} severity="success" sx={{ width: '100%' }}>
          {successMsg}
        </Alert>
      </Snackbar>
      <div className="flex justify-center text-3xl font-semibold text-gray-800 underline mb-5">
        Settings
      </div>

      <div className=" pr-2">
        <form onSubmit={handleSubmit} className="space-y-6 mx-2">
          {/* Basic Info */}
          <div>
            <div className="text-2xl font-semibold text-cyan-700 mt-4 mb-2">
              Basic Information
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Full Name</span>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="name"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Phone</span>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="tel"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email</span>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="email"
                  required
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Gender</span>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="block">
                <span className="text-gray-700">Date of Birth</span>
                <input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth?.split("T")[0] || ""}
                  onChange={handleChange}
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  required
                />
              </label>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Password Section */}
          <div>
            <div className="text-2xl font-semibold text-cyan-700 mb-2">
              Update Password
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">New Password</span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="new-password"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Confirm Password</span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="new-password"
                />
              </label>
            </div>
            <div className="flex items-center cursor-pointer my-3">
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${showPassword ? "bg-cyan-500" : "bg-gray-300"}`}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow transform transition ${showPassword ? "translate-x-5" : ""}`}
                />
              </div>
              <span className="ml-3 text-gray-700 select-none">Show Password</span>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Address Section */}
          <div>
            <div className="text-2xl font-semibold text-cyan-700 mb-2">
              Address
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Street</span>
                <input
                  name="address.street"
                  type="text"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="address-line1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">City</span>
                <input
                  name="address.city"
                  type="text"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="address-level2"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">State</span>
                <input
                  name="address.state"
                  type="text"
                  value={formData.address.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="address-level1"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Postal Code</span>
                <input
                  name="address.postalCode"
                  type="text"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                  autoComplete="postal-code"
                />
              </label>
            </div>
          </div>

          <hr className="my-6 border-gray-300" />

          {/* Emergency Contact */}
          <div>
            <div className="text-2xl font-semibold text-cyan-700 mb-2">
              Emergency Contact
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700">Contact Name</span>
                <input
                  name="emergencyContact.name"
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={handleChange}
                  placeholder="Contact Name"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Contact Phone</span>
                <input
                  name="emergencyContact.phone"
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={handleChange}
                  placeholder="Contact Phone"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Relation</span>
                <input
                  name="emergencyContact.relation"
                  type="text"
                  value={formData.emergencyContact.relation}
                  onChange={handleChange}
                  placeholder="Relation"
                  className="border p-2 rounded w-full mt-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className={`bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded mt-4 font-semibold shadow transition duration-200 ${
                saving ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
