import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />; // Redirect non-admins to home
  }

  return children;
};

export default AdminRoute;
