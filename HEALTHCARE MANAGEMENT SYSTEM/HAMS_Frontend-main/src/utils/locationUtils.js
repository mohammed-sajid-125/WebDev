export const getCityFromCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    const data = await response.json();
    return data.city || data.locality || "Unknown";
  } catch (err) {
    console.error("Error fetching city:", err);
    return "Location Error";
  }
};
