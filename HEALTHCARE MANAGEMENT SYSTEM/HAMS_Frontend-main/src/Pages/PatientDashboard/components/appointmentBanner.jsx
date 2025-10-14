import { format } from 'date-fns';

const AppointmentBanner = ({ appointment }) => {
  if (!appointment) return null;

  const formattedDate = format(new Date(appointment.date), 'dd/MM/yyyy');

  return (
    <section className="bg-gradient-to-r from-blue-100 to-blue-50 p-4 rounded-md mb-6">
      <p className="font-semibold text-lg">Stay Informed! Upcoming Appointment Details</p>
      <p className="text-sm text-gray-600 mt-1">
        {formattedDate} | {appointment.slot} | {appointment.doctorName}
      </p>
      <button className="mt-2 text-cyan-600 text-sm font-medium">View Details</button>
    </section>
  );
};

export default AppointmentBanner;
