import React, { useEffect, useRef, useState } from "react";
import ScrollButton from "./scrollButton.jsx";
import axios from "axios";
import { Snackbar } from "@mui/material";
import healthCarePrograms, {
  iconMap,
  formatPrice,
} from "../constants/programs.js";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import Divider from "@mui/material/Divider";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Programs = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setsnackbarMessage] = useState("");
  const samplePrograms = healthCarePrograms;
  const carouselRef = useRef(null);

  const handleScroll = (offset) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  if (!samplePrograms || samplePrograms.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No healthcare programs available at the moment.
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-4">
      <div className="flex items-center justify-between mb-6">
        <div className="text-2xl font-bold text-cyan-700">
          Healthcare <span className="text-indigo-900">Programs</span>
        </div>
      </div>

      <div className="relative">
        <div
          ref={carouselRef}
          className="flex space-x-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide scroll-smooth bg-white"
        >
          {samplePrograms.map((p, idx) => {
            const IconComponent = iconMap[p.iconKey];

            return (
              <div
                key={idx}
                className="flex-shrink-0 w-56 bg-white border border-gray-200 shadow-md p-4 rounded-lg flex flex-col"
              >
                <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center bg-gray-100">
                  {IconComponent && (
                    <IconComponent
                      sx={{
                        fontSize: 30,
                        color: "#0891b2",
                      }}
                    />
                  )}
                </div>

                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800 h-12 mb-3">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-3">
                      {p.description.substring(0, 100)}
                      {p.description.length > 100 ? "..." : ""}
                    </p>
                  </div>
                  <div className=" flex items-center justify-between">
                    <p className="text-cyan-600 mt-2 font-bold text-md flex items-center">
                      <CurrencyRupeeIcon fontSize="small" className="mr-1 " />
                      {formatPrice(p.price)}
                    </p>
                    <button
                      onClick={() => {
                        setsnackbarMessage(`Booking ${p.name}`);
                        setSnackbarOpen(true);
                      }}
                      className="px-3 py-1 text-sm text-[#10217D] border border-[#10217D] rounded hover:bg-indigo-50 transition flex-shrink-0"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => {
            setSnackbarOpen(false);
            setsnackbarMessage("");
          }}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => {
              setSnackbarOpen(false);
              setsnackbarMessage("");
            }}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <ScrollButton
          direction="left"
          onClick={() => handleScroll(-600)}
          className="left-0"
        />
        <ScrollButton
          direction="right"
          onClick={() => handleScroll(600)}
          className="right-0"
        />
      </div>
    </div>
  );
};

export default Programs;
