import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { FaHome } from "react-icons/fa";
import axios from 'axios';

const base_url = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const Header = () => {
  const [name, setName] = useState('');
  const newToken = localStorage.getItem('token');
    const navigate = useNavigate();
  
    const GotoHome = () => {
      navigate('/'); 
    };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${base_url}/patients/profile`,{headers: { Authorization: `Bearer ${newToken}` }});
        setName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch patient name:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <header className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back, {name || 'Patient'}!</p>
      </div>
      <div className="flex items-center space-x-4">
        <button
        onClick={() => navigate("/dashboard/patient/settings")}
        className="bg-cyan-600 hover:bg-cyan-800 text-white px-4 py-2 rounded-md">
        Edit Profile
        </button>
        <button onClick={GotoHome} className=" text-gray-500">
         <FaHome className="text-xl ml-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;