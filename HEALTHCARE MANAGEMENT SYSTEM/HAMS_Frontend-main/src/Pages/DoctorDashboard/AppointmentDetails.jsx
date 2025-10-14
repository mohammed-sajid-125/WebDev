import Button from "@mui/material/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const AppointmentDetails = () => {
  const { appointmentId } = useParams();
  const [appointmentData, setAppointmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");
  var formattedDate = '';

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await axios.get(`${base_url}/Appointments/detail`, {
          params: { appointmentId },
        });
        setAppointmentData(response.data);
      } catch (error) {
        console.error("Error fetching data :", error);
        setError("Error fetching appointment data");
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointmentData();
    }
  }, [appointmentId]);

  const handleReschedule = async () => {
    if (!appointmentData?.appointmentDetails?.appointmentId) return;
    setRescheduleLoading(true);
    setRescheduleError("");
    try {
      await axios.put(
        `${base_url}/appointments/update-status/${appointmentData.appointmentDetails.appointmentId}`,
        { appStatus: "Rescheduled" }
      );
      setAppointmentData((prev) => ({
        ...prev,
        appointmentDetails: {
          ...prev.appointmentDetails,
          status: "Rescheduled",
        },
      }));
    } catch (err) {
      setRescheduleError("Failed to reschedule appointment");
    } finally {
      setRescheduleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No appointment data found
      </div>
    );
  }

  const { appointmentDetails, patientDetails, previousAppointments } = appointmentData;

  if (!appointmentDetails) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Appointment details not found
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-4">
        {/* Left Section */}
        <div className="flex flex-col gap-6 w-2/3">
          {/* Appointment Details Box */}
          <div className="border rounded-xl shadow-sm bg-white">
            <div className="flex justify-between items-center pt-4 px-3">
              <div className="text-lg font-semibold">Appointment Details</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Status</span>
                {appointmentDetails?.status && (
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      appointmentDetails.status === "Pending"
                        ? "bg-blue-500"
                        : appointmentDetails.status === "Confirmed"
                        ? "bg-green-500"
                        : appointmentDetails.status === "Completed"
                        ? "bg-green-600"
                        : appointmentDetails.status === "Request for Rescheduling"
                        ? "bg-orange-500"
                        : appointmentDetails.status === "Rescheduled"
                        ? "bg-yellow-500"
                        : appointmentDetails.status === "Cancelled"
                        ? "bg-red-500"
                        : appointmentDetails.status === "Rejected"
                        ? "bg-red-600"
                        : appointmentDetails.status === "Incomplete"
                        ? "bg-gray-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {appointmentDetails.status}
                  </span>
                )}
              </div>
            </div>
            <hr />
            <div className="flex justify-between p-4 text-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-gray-600">Appointment ID</div>
                  <div className="font-semibold">
                    {appointmentDetails.appointmentId}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Doctor Assigned</div>
                  <div className="font-semibold">
                    {appointmentDetails.doctor}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-gray-600">Booked On</div>
                  <div className="font-semibold">
                    {appointmentDetails.bookedOn}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Department</div>
                  <div className="font-semibold">
                    {appointmentDetails.department}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-gray-600">Appointment Date</div>
                  <div className="font-semibold">{appointmentDetails.date}</div>
                </div>
                <div>
                  <div className="text-gray-600">Reason for Visit</div>
                  <div className="font-semibold">
                    {appointmentDetails.reason}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-gray-600">Appointment Time</div>
                  <div className="font-semibold">{appointmentDetails.time}</div>
                </div>
                <div>
                  <div className="text-gray-600">Consultation Type</div>
                  <div className="font-semibold">{appointmentDetails.type}</div>
                </div>
              </div>
            </div>
            <hr />
            {appointmentDetails.status !== "Completed" && appointmentDetails.status !== "Cancelled" && appointmentDetails.status !== "Rejected" && (
            <div className="flex justify-end gap-4 p-4">
              
                  <Button
                    variant="contained"
                    onClick={handleReschedule}
                    disabled={
                      rescheduleLoading || 
                      appointmentDetails.status === "Rescheduled" ||
                      appointmentDetails.status === "Request for Rescheduling"
                    }
                  >
                    {rescheduleLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Reschedule"
                    )}
                  </Button>
                

              <Button
                variant="outlined"
                style={{ borderColor: "red", color: "red" }}
                // Add cancel logic if needed
              >
                Cancel
              </Button>
            </div>
            )}
            {rescheduleError && (
              <div className="text-red-500 text-sm mt-2 px-4">{rescheduleError}</div>
            )}
          </div>

          {/* Patient Details Box */}
          <div className="border rounded-xl shadow-sm bg-white">
            {!patientDetails ? (
              <div className="text-center p-4 text-gray-500">
                Patient information not available.
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pt-3 px-3">
                  <div className="text-lg font-semibold">Patient Details</div>
                </div>
                <hr />
                <div className="flex justify-between p-4 text-sm">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-gray-600">Name</div>
                      <div className="font-semibold">{patientDetails.name}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Email Address</div>
                      <div className="font-semibold">
                        {patientDetails.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-gray-600">Gender</div>
                      <div className="font-semibold">
                        {patientDetails.gender}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Contact No</div>
                      <div className="font-semibold">
                        +91 {patientDetails.contact}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="text-gray-600">Age</div>
                      <div className="font-semibold">{patientDetails.age}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Address</div>
                      <div className="font-semibold">
                        {patientDetails.address}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional Information / Prescription */}
          <div className="border rounded-xl shadow-sm bg-white h-40 flex flex-col items-center justify-center text-gray-400">
            <h3 className="text-lg font-semibold mb-2">
              Additional Information
            </h3>
            {appointmentDetails?.prescription ? (
              <p className="text-gray-700">{appointmentDetails.prescription}</p>
            ) : (
              <p className="text-gray-400 italic">
                No Prescription available for this appointment.
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Appointment History */}
        <div className="w-1/3">
          <div className="flex flex-col border rounded-xl shadow-sm bg-white max-h-[700px] overflow-y-auto">
            <div className="p-4">
              <div className="text-lg font-semibold text-gray-800">
                Appointment History
              </div>
            </div>
            <hr />
            <div className="px-4 py-2 space-y-6">
              {
              !previousAppointments || previousAppointments.length === 0 ? (
                
                <div className="text-center text-gray-600 font-medium py-8">
                  First appointment with the patient
                </div>
              ) : (
                previousAppointments.map((appt, idx) => (
                  formattedDate = format(new Date(appt.date), 'dd/MM/yyyy'),
                  <div key={idx} className="flex items-start relative">
                    {/* Left: Date & Time */}
                    <div className="w-[90px] text-xs text-right pr-2 flex flex-col pt-1">
                      <span className="text-gray-500">{formattedDate}</span>
                      <span className="text-gray-500">{appt.slotNumber}</span>
                    </div>

                    {/* Center: Timeline */}
                    <div className="relative flex flex-col items-center mx-3 min-h-[60px]">
                      {/* Vertical Line */}
                      <div
                        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full z-0 ${
                          appt.appStatus === "Completed"
                            ? "bg-green-300"
                            : appt.appStatus === "Cancelled" || appt.appStatus === "Rejected"
                            ? "bg-red-300"
                            : appt.appStatus === "Rescheduled"
                            ? "bg-yellow-300"
                            : "bg-blue-300"
                        }`}
                      />
                      {/* Dot */}
                      <div
                        className={`w-3 h-3 mt-1 rounded-full z-10 ${
                          appt.appStatus === "Completed"
                            ? "bg-green-500"
                            : appt.appStatus === "Cancelled" || appt.appStatus === "Rejected"
                            ? "bg-red-500"
                            : appt.appStatus === "Rescheduled"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      />
                    </div>

                    {/* Right: Reason Box */}
                    <div className="flex-1 ml-4">
                      <div
                        className={`text-sm flex justify-between items-center font-medium px-3 py-2 rounded-md shadow w-full ${
                          appt.appStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : appt.appStatus === "Cancelled" || appt.appStatus === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : appt.appStatus === "Rescheduled"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {appt.reason}
                        {appt.appStatus === "Completed" ? (
                          <CheckCircleIcon
                            className="text-green-500"
                            fontSize="small"
                          />
                        ) : (
                          <AccessTimeIcon
                            className="text-blue-500"
                            fontSize="small"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppointmentDetails;
