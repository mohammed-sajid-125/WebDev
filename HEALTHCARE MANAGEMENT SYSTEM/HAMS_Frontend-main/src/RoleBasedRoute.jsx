import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const RoleBasedRoute = ({ allowedRoles, children }) => {
  const { role, isLoggedIn } = useAuth();

  if (!isLoggedIn || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleBasedRoute;
