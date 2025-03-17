import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  console.log("AdminRoute Check:", user); // Debugging log

  return user && user.isAdmin ? children : <Navigate to="/" />;
};

export default AdminRoute;
