import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Form, Button, Badge, Card } from 'react-bootstrap';
import { generateTimeSlots } from './Slotgenerator';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CalendarWithSlots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const [doctorId, setDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [interval, setInterval] = useState(15);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [savedSlots, setSavedSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const routeDoctorId = location?.state?.doctorId || location?.state?.doctor?.doctorId;
    const storageDoctorId = localStorage.getItem("doctorId");
    const finalDoctorId = routeDoctorId || storageDoctorId;

    console.log("Route doctorId:", routeDoctorId);
    console.log("Storage doctorId:", storageDoctorId);
    console.log("Final doctorId:", finalDoctorId);

    if (!finalDoctorId) {
      alert("Doctor ID missing. Please go back and try again.");
      navigate(-1);
      return;
    }

    setDoctorId(finalDoctorId);

    const fetchSavedSlots = async () => {
      try {
        const url = `${base_url}/doctors/${finalDoctorId}/slots`;
        console.log("Fetching saved slots from:", url);
        const res = await axios.get(url);
        if (res.status === 200) {
          setSavedSlots(res.data.availableSlots || {});
        }
      } catch (error) {
        console.error("Error fetching saved slots:", error.response?.data || error.message);
      }
    };

    fetchSavedSlots();
  }, [location]);

  const fetchBookedSlots = async (dateKey) => {
    try {
      const res = await axios.get(`${base_url}/doctors/${doctorId}/booked-slots?date=${encodeURIComponent(dateKey)}`);
      if (res.status === 200) {
        setBookedSlots(res.data.bookedSlots || []);
      }
    } catch (error) {
      console.error("Error fetching booked slots:", error.response?.data || error.message);
    }
  };

  const formatLocalDate = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (date) => {
    const dateKey = formatLocalDate(date);
    setSelectedDate(date);
    setSlots(generateTimeSlots(interval));
    setSelectedSlots(savedSlots[dateKey] || []);
    fetchBookedSlots(dateKey);
  };

  const handleIntervalChange = (e) => {
    const newInterval = parseInt(e.target.value);
    setInterval(newInterval);
    if (selectedDate) {
      const dateKey = formatLocalDate(selectedDate);
      setSlots(generateTimeSlots(newInterval));
      setSelectedSlots(savedSlots[dateKey] || []);
    }
  };

  const toggleSlot = (slot) => {
    if (bookedSlots.includes(slot)) return;
    setSelectedSlots((prev) =>
      prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    );
  };

  const handleSaveSlots = async () => {
    if (!selectedDate || selectedSlots.length === 0) {
      alert("Please select at least one slot.");
      return;
    }

    const dateKey = formatLocalDate(selectedDate);
    const payload = {
      date: dateKey,
      slots: selectedSlots,
    };

    try {
      const response = await axios.post(`${base_url}/doctors/${doctorId}/slots`, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setSavedSlots((prev) => ({
          ...prev,
          [dateKey]: selectedSlots,
        }));
        alert("Slots saved successfully");
      } else {
        alert("Failed to save slots.");
      }
    } catch (error) {
      console.error("Error saving slots:", error.response?.data || error.message);
      alert("Failed to save slots.");
    }
  };

  return (
    <div className="container mt-4">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">Appointment Slot Scheduler</h5>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6 mb-3">
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <Calendar onChange={handleDateChange} value={selectedDate} className="w-100" />
                </Card.Body>
              </Card>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3" style={{ maxWidth: '250px' }}>
                <Form.Label>Select Slot Interval</Form.Label>
                <Form.Select onChange={handleIntervalChange} value={interval}>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                </Form.Select>
              </Form.Group>

              {selectedDate && (
                <>
                  <h6 className="mb-2 text-primary">
                    Available Slots for {selectedDate.toDateString()}:
                  </h6>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {slots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlots.includes(slot);
                      return (
                        <Badge
                          key={slot}
                          bg={isBooked ? 'danger' : isSelected ? 'primary' : 'secondary'}
                          onClick={() => toggleSlot(slot)}
                          style={{
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            padding: '10px 15px',
                            fontSize: '0.9rem',
                            opacity: isBooked ? 0.5 : 1
                          }}
                        >
                          {slot}
                        </Badge>
                      );
                    })}
                  </div>
                  <Button variant="primary" onClick={handleSaveSlots}>
                    Save Slots
                  </Button>
                </>
              )}
            </div>
          </div>

          {Object.keys(savedSlots).length > 0 && (
            <div className="mt-4">
              <h6 className="text-primary">Saved Slots:</h6>
              {Object.entries(savedSlots).map(([date, slots]) => (
                <Card key={date} className="mb-2 border-0 shadow-sm">
                  <Card.Body>
                    <strong>{date}</strong>: {slots.map((s, i) => (
                      <Badge bg="info" text="dark" className="me-2 mb-2 p-2" key={i}>
                        {s}
                      </Badge>
                    ))}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CalendarWithSlots;
