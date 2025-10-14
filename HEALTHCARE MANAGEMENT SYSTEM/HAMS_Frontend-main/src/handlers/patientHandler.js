import { createPatient } from "../apiControllers/userAPI";

export default async function handlePatientRegistration(formData, login) {
  try {
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const response = await createPatient(formData, login);
    console.log("Patient registered successfully:", response);
    return response; // success
  } catch (error) {
    console.error("Patient registration error:", error);

    if (error.response && error.response.status === 409) {
      throw new Error("Patient already exists with this phone number.");
    } else {
      throw new Error("Patient registration failed. Please try again.");
    }
  }
}
