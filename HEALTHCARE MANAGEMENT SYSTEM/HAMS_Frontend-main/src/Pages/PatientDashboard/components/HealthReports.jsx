import { FaTint, FaHeartbeat, FaWeight, FaTemperatureHigh } from 'react-icons/fa';

const HealthReport = () => (
  <section className="bg-white p-4 rounded-md shadow-sm mb-6">
    <p className="font-semibold text-md mb-4">Health Report - Last Checkup (July 01, 2025)</p>
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
      <div className="text-center">
        <FaTint className="text-cyan-600 mx-auto" />
        <p className="font-bold">73 mmHg</p>
        <p className="text-xs text-gray-500">Blood Pressure</p>
      </div>
      <div className="text-center">
        <FaHeartbeat className="text-cyan-600 mx-auto" />
        <p className="font-bold">80 BPM</p>
        <p className="text-xs text-gray-500">Heart Rate</p>
      </div>
      <div className="text-center">
        <FaTint className="text-cyan-600 mx-auto" />
        <p className="font-bold">110 mg/dL</p>
        <p className="text-xs text-gray-500">Blood Sugar</p>
      </div>
      <div className="text-center">
        <FaWeight className="text-cyan-600 mx-auto" />
        <p className="font-bold">150 lbs</p>
        <p className="text-xs text-gray-500">Weight</p>
      </div>
      <div className="text-center">
        <FaTemperatureHigh className="text-cyan-600 mx-auto" />
        <p className="font-bold">98 C</p>
        <p className="text-xs text-gray-500">Temperature</p>
      </div>
    </div>
    <div className="mt-4 text-sm text-cyan-600">
      <a href="#">Download Health Report</a> | <a href="#">Update your Vitals</a>
    </div>
  </section>
);

export default HealthReport;
