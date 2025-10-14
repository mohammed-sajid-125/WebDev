const Toggle = ({ role, onRoleChange }) => {
  const isPatient = role === "patient";

  return (
    <div className="flex gap-3 justify-center items-center">
      <span className={isPatient ? "font-bold text-blue-600" : "text-gray-500"}>
        Patient
      </span>
      <div
        className="w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors"
        onClick={() => onRoleChange(isPatient ? "doctor" : "patient")}
      >
        <div
          className={`bg-green-700 w-5 h-5 rounded-full shadow-md transform transition-transform ${
            isPatient ? "translate-x-0" : "translate-x-5"
          }`}
        ></div>
      </div>
      <span className={!isPatient ? "font-bold text-blue-600" : "text-gray-500"}>
        Doctor
      </span>
    </div>
  );
};

export default Toggle;
