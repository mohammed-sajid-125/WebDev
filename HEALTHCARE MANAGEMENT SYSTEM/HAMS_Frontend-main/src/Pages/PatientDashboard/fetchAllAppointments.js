import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export async function fetchAllAppointments() {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${base_url}/patients/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Error fetching all appointments:", err);
    return [];
  }
} 