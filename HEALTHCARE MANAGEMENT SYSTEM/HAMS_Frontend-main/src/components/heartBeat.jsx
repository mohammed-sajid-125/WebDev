import React from "react";
import "./HeartBeatLine.css";

export default function HeartBeatLine() {
  const pathD = `
    M0,50
    L5,50
    L10,10
    L15,90
    L20,50
    L25,50
    L30,20
    L35,80
    L40,50
    L45,50
    L50,5
    L55,95
    L60,50
    L65,50
    L70,30
    L75,70
    L80,50
    L85,50
    L90,15
    L95,85
    L100,50
  `;

  return (
    <div className="ecg-container-in-button lively-button glowing-border">
      <svg
        className="ecg-line"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="pulse-path"
          fill="none"
          stroke="red"
          strokeWidth="6"
          d={pathD}
        />
      </svg>
      <div className="pulse-overlay-text">
        <h5 className="pulse-title heartbeat-text-single">Book Appointment</h5>
        <p className="pulse-subtitle">Click to proceed</p>
      </div>
    </div>
  );
}
