import { createHospital } from "../apiControllers/userAPI";

export default async function hospitalHandler(formData, login) {
  const lat = formData.location?.latitude || localStorage.getItem("latitude");
  const lon = formData.location?.longitude || localStorage.getItem("longitude");
  const formatData = {
    hospitalName: formData.hospitalName,
    phone: formData.phone,
    email: formData.email,
    password: formData.password,
    RegId: formData.RegId,
    location: {
      coordinates:[parseFloat(lat),parseFloat(lon)],
    },
    addressLine: formData.addressLine,
    city: formData.city,
    state: formData.state,
    pincode: formData.pincode,
  };

  console.log("Sending hospital registration data:", formatData);

  try {
    const response = await createHospital(formatData, login);
    console.log("Hospital registered successfully:", response);
  } catch (error) {
    console.error("Hospital registration error:", error);
  }
}
