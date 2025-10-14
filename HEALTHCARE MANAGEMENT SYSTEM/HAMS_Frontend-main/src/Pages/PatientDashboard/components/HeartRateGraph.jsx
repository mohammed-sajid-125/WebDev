import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HeartRateGraph = () => {
  const data = {
    labels: ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM'],
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: [75, 80, 78, 82, 85, 79],
        borderColor: '#06b6d4', // Tailwind cyan-500
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Heart Rate Over Time',
        font: { size: 16 }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'BPM'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  return (
    <section className="bg-white p-4 rounded-md shadow-sm mb-6">
      <p className="font-semibold mb-2">Heart Rate Diagram</p>
      <div className="bg-blue-50 p-4 rounded">
        <Line data={data} options={options} />
      </div>
    </section>
  );
};

export default HeartRateGraph;
