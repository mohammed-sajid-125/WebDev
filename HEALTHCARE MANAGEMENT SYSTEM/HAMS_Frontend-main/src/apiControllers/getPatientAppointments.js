import axios from "axios";


export async function getPatientAppointments() {
  try {
    const token = localStorage.getItem("token");
    const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
    const res = await axios.get(`${base_url}/patients/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const appointments = Array.isArray(res.data) ? res.data : [];
    
    const doctorMap = new Map();
    appointments.forEach(appt => {
      if (appt.doctorId && appt.doctorName) {
        doctorMap.set(String(appt.doctorId), appt.doctorName);
      }
    });
    
    return Array.from(doctorMap.entries()).map(([doctorId, doctorName]) => ({ doctorId, doctorName }));
  } catch (err) {
    console.error("Error fetching patient appointments:", err);
    return [];
  }
}