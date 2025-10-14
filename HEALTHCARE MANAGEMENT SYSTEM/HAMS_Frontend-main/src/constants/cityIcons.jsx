import {
  FaCity,
  FaMonument,
  FaBuilding,
  FaHospital,
  FaLandmark,
} from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { GiIndianPalace, GiTempleGate } from "react-icons/gi";

// Example lat/lng values; replace with accurate ones as needed
const cityIcons = {
  Ahmedabad: {
    icon: <GiIndianPalace />,
    lat: 23.0225,
    lng: 72.5714,
  },
  Bangalore: {
    icon: <MdLocationCity />,
    lat: 12.9716,
    lng: 77.5946,
  },
  Chennai: {
    icon: <MdLocationCity />,
    lat: 13.0827,
    lng: 80.2707,
  },
  Cochin: {
    icon: <FaBuilding />,
    lat: 9.9312,
    lng: 76.2673,
  },
  Delhi: {
    icon: <FaLandmark />,
    lat: 28.6139,
    lng: 77.2090,
  },
  Hyderabad: {
    icon: <GiIndianPalace />,
    lat: 17.3850,
    lng: 78.4867,
  },
  Kolkata: {
    icon: <FaLandmark />,
    lat: 22.5726,
    lng: 88.3639,
  },
  Lucknow: {
    icon: <GiIndianPalace />,
    lat: 26.8467,
    lng: 80.9462,
  },
  Mumbai: {
    icon: <FaCity />,
    lat: 19.0760,
    lng: 72.8777,
  },
  Warangal: {
    icon: <GiTempleGate />,
    lat: 17.9784,
    lng: 79.5941,
  },
};

export default cityIcons;
