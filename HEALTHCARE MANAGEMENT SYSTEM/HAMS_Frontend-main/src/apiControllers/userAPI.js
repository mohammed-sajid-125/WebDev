import axios from "axios";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// These now ONLY send requests, and leave state to AuthContext
export const createDoctor = async (doctorData,login) => {
  console.log(doctorData)
  const res = await axios.post(`${base_url}/doctors/signup`, doctorData,  {
  headers: { withCredentials: true,
}});
  login(res.data.token);
  return res.data;
};

export const loginUser = async (loginData, role, login) => {
  const route = role === "doctor" ? "doctors/login" : "patients/login";
  const res = await axios.post(`${base_url}/${route}`, loginData, {
    withCredentials: true,
  });
  login(res.data.token);
  return res.data;
};

export const createPatient = async (patientData,login) => {
  const res = await axios.post(`${base_url}/patients/signup`, patientData, {
    withCredentials: true,
  });
  login(res.data.token);
  return res.data;
};

export const createHospital = async (hospitalData,login) => {
  const res = await axios.post(`${base_url}/hospitals/signup`, hospitalData, {
    withCredentials: true,
  });
  return res.data;
};

export const loginHospital = async (hospitalData) => {
  const res = await axios.post(`${base_url}/hospitals/login`, hospitalData, {
    withCredentials: true,
  });
  login(res.data.token);
  return res.data;
};
