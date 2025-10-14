import { useState, useEffect, useRef } from "react";
import axios from "axios";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import cityIcons from "../constants/cityIcons";
import { FaLandmark } from "react-icons/fa";
import { getCityFromCoords } from "../utils/locationUtils";

const GEO_API_URL = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities";
const GEO_API_HEADERS = {
  "X-RapidAPI-Key": import.meta.env.VITE_RAPIDAPI_KEY,
  "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function LocationModal({ open, onClose, setLocation }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);
  const debouncedSearch = useDebounce(searchTerm, 400);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setSearchTerm("");
      setSearchResults([]);
      setErrorMsg("");
    }
  }, [open]);

  // Keyboard accessibility (Esc to close)
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!debouncedSearch) {
      setSearchResults([]);
      setErrorMsg("");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    axios
      .get(GEO_API_URL, {
        headers: GEO_API_HEADERS,
        params: { namePrefix: debouncedSearch, types: "CITY", limit: 10 },
      })
      .then((response) => {
        if (response.data.data.length === 0) {
          setErrorMsg("No cities found.");
        }
        setSearchResults(response.data.data);
      })
      .catch((error) => {
        setErrorMsg("Failed to fetch cities. Try again later.");
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const handleCitySelect = (cityObj) => {
    const city = cityObj.city || cityObj;
    setLocation(city);
    localStorage.setItem("userLocation", city);
    if (cityIcons[city]) {
      localStorage.setItem("latitude", cityIcons[city].lat);
      localStorage.setItem("longitude", cityIcons[city].lng);
    }
    onClose();
  };

  const detectLocation = () => {
    setLoading(true);
    setErrorMsg("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const city = await getCityFromCoords(pos.coords.latitude, pos.coords.longitude);
            setLocation(city);
            localStorage.setItem("userLocation", city);
            if (cityIcons[city]) {
              localStorage.setItem("latitude", cityIcons[city].lat);
              localStorage.setItem("longitude", cityIcons[city].lng);
            } else {
              localStorage.setItem("latitude", pos.coords.latitude);
              localStorage.setItem("longitude", pos.coords.longitude);
            }
            onClose();
          } catch {
            setErrorMsg("Failed to detect city from coordinates.");
          } finally {
            setLoading(false);
          }
        },
        () => {
          setErrorMsg("Failed to detect location.");
          setLoading(false);
        }
      );
    } else {
      setErrorMsg("Geolocation not supported.");
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
    >
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 id="location-modal-title" className="text-lg font-semibold">
            Select Your City
          </h2>
          <IconButton aria-label="Close" onClick={onClose}>
            <CloseIcon className="text-gray-500 hover:text-black" />
          </IconButton>
        </div>
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 mb-4">
          <SearchIcon className="text-gray-400 mr-2" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for your city"
            className="flex-grow outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search for your city"
          />
        </div>
        <button
          onClick={detectLocation}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium mb-4 disabled:opacity-50"
          disabled={loading}
          aria-label="Detect my location"
        >
          <LocationOnIcon />
          Detect my location
        </button>
        {loading && (
          <div className="flex justify-center my-2">
            <CircularProgress size={24} />
          </div>
        )}
        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {(searchResults.length > 0 ? searchResults : Object.keys(cityIcons)).map((cityObj) => {
            const city = cityObj.city || cityObj;
            const country = cityObj.country || cityIcons[city]?.country || "";
            return (
              <div
                key={city}
                onClick={() => handleCitySelect(cityObj)}
                className="flex flex-col items-center justify-center p-3 hover:bg-gray-100 rounded cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`Select city ${city}`}
                onKeyDown={(e) => { if (e.key === "Enter") handleCitySelect(cityObj); }}
              >
                <div className="text-2xl text-blue-700">
                  {cityIcons[city]?.icon || <FaLandmark />}
                </div>
                <div className="mt-1 text-sm font-semibold">{city}</div>
                {country && <div className="text-xs text-gray-500">{country}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
