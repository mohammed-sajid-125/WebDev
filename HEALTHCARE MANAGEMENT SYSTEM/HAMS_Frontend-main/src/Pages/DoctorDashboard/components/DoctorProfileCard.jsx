import dp from '../../../assets/dp.jpg';
import { Button } from "react-bootstrap";
import { useState, useEffect } from 'react';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import axios from 'axios';

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const DoctorProfileCard = ({ doctor }) => {
  const [requests, setRequests] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reschedule');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const [rescheduleRes, appointmentRes] = await Promise.all([
          axios.get(`${base_url}/doctors/reschedule-requests`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${base_url}/doctors/requested-appointments`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setRequests(rescheduleRes.data.requests);
        setAppointmentRequests(appointmentRes.data.appointments);
      } catch (err) {
        console.error("❌ Error fetching requests:", err);
        setRequests([]);
        setAppointmentRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleRescheduleAction = async (appointmentId, action) => {
    const token = localStorage.getItem("token");
    const payload = { 
      appointmentId,
      action
    };

    try {
      const response = await axios.post(`${base_url}/doctors/handle-reschedule`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update UI after action
      setRequests((prev) => prev.filter(r => r.appointmentId !== appointmentId));
    } catch (err) {
      console.error(`❌ Failed to ${action} reschedule:`, err.response?.data || err.message);
    }
  };

  const handleAppointmentAction = async (appointmentId, action, reason = "") => {
    const token = localStorage.getItem("token");
    const payload = {
      appointmentId,
      action,
      reason
    };

    try {
      const response = await axios.put(`${base_url}/appointments/respond`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update UI after action
      setAppointmentRequests((prev) => prev.filter(r => r.appointmentId !== appointmentId));
    } catch (err) {
      console.error(`❌ Failed to ${action} appointment:`, err.response?.data || err.message);
    }
  };

  if (!doctor) return <div>Loading doctor profile...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm border border-gray-200">
      {/* Profile */}
      <div className="flex flex-col items-center mb-6">
        {doctor.photo?.url && (
          <img src={doctor.photo.url} alt="Doctor" className="rounded-full w-20 h-20 border-2 border-gray-300" />
        )}
        <div className="mt-4 text-lg font-bold text-gray-900">{doctor.name}</div>
        <div className="text-sm text-gray-500">{doctor.specialty}</div>
      </div>

      {/* Stats */}
      <div className="flex justify-around text-sm text-gray-600 mb-6">
        <div className="text-center">
          <div className="text-gray-500">EXPERIENCE</div>
          <div className="font-semibold text-gray-800">{doctor.experience} yrs </div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">RATING</div>
          <div className="font-semibold text-yellow-500">{doctor.averageRating}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">LICENSE</div>
          <div className="font-semibold text-gray-800">{doctor.medicalReg}</div>
        </div>
      </div>
      <div className='flex justify-center font-medium text-lg'>Requests</div>
      {/* Tab Navigation */}
      <div className="flex mb-4 border-b border-gray-200">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'reschedule' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('reschedule')}
        >
          Reschedule
          <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
            {requests.length}
          </span>
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'appointments' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointment
          <span className="ml-2 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs">
            {appointmentRequests.length}
          </span>
        </button>
      </div>

      {/* Content based on active tab */}
      {loading ? (
        <div>Loading requests...</div>
      ) : (
        <>
          {/* Reschedule Requests Tab */}
          {activeTab === 'reschedule' && (
            <>
              {requests.length === 0 ? (
                <div className="text-gray-500">No reschedule requests.</div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-4">
                  {requests.map((req) => (
                    <div key={req.appointmentId} className="bg-gray-100 p-4 rounded-xl mb-4 border border-gray-200">
                      <div className="font-semibold mb-2 text-gray-800">{req.reason}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <img src={req.patientPhoto || dp} alt="Patient DP" className="w-6 h-6 rounded-full" />
                        {req.patientName}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <CalendarMonthRoundedIcon fontSize="small" />
                          {req.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <AccessTimeRoundedIcon fontSize="small" />
                          {req.time}
                        </div>
                      </div>
                      <div className="flex justify-between gap-2 mt-2">
                        <Button
                          size="sm"
                          className="bg-green-500 border-0 text-white w-1/2"
                          onClick={() => handleRescheduleAction(req.appointmentId, "approve")}
                        >
                          <div className='flex gap-2 justify-center items-center'>
                            <CheckCircleRoundedIcon style={{ height: 18, width: 18 }} />
                            Approve
                          </div>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 border-0 text-white w-1/2"
                          onClick={() => handleRescheduleAction(req.appointmentId, "reject")}
                        >
                          <div className='flex gap-2 justify-center items-center'>
                            <HighlightOffRoundedIcon style={{ height: 18, width: 18 }} />
                            Reject
                          </div>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Appointment Requests Tab */}
          {activeTab === 'appointments' && (
            <>
              {appointmentRequests.length === 0 ? (
                <div className="text-gray-500">No appointment requests.</div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto space-y-4">
                  {appointmentRequests.map((req) => (
                    <div key={req.appointmentId} className="bg-orange-50 p-4 rounded-xl mb-4 border border-orange-200">
                      <div className="flex items-center gap-2 mb-2">
                        <PendingActionsRoundedIcon className="text-orange-600" fontSize="small" />
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                          New Request
                        </span>
                      </div>
                      <div className="font-semibold mb-2 text-gray-800">{req.reason}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                        <img src={dp} alt="Patient DP" className="w-6 h-6 rounded-full" />
                        {req.patientId?.name || 'Patient'}
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <CalendarMonthRoundedIcon fontSize="small" />
                          {new Date(req.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <AccessTimeRoundedIcon fontSize="small" />
                          Slot {req.slotNumber}
                        </div>
                      </div>
                      <div className="flex justify-between gap-2 mt-2">
                        <Button
                          size="sm"
                          className="bg-green-500 border-0 text-white w-1/2"
                          onClick={() => handleAppointmentAction(req.appointmentId, "accept")}
                        >
                          <div className='flex gap-2 justify-center items-center'>
                            <CheckCircleRoundedIcon style={{ height: 18, width: 18 }} />
                            Accept
                          </div>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-500 border-0 text-white w-1/2"
                          onClick={() => {
                            handleAppointmentAction(req.appointmentId, "reject");
                          }}
                        >
                          <div className='flex gap-2 justify-center items-center'>
                            <HighlightOffRoundedIcon style={{ height: 18, width: 18 }} />
                            Reject
                          </div>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorProfileCard;