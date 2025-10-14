import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full flex flex-col items-center border border-gray-200">
        <div className="text-6xl mb-4 text-pink-500 animate-bounce">
          <svg width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Access Denied</h1>
        <p className="text-gray-500 text-center mb-6">You are <span className="font-semibold text-pink-600">not authorized</span> to view this page.<br/>Please check your permissions or login with the correct account.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          Go to Home
        </button>
      </div>
      <div className="mt-8 text-gray-400 text-xs text-center">
        &copy; {new Date().getFullYear()} HAMS Healthcare Platform
      </div>
    </div>
  );
};

export default Unauthorized; 