import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("signup");
  }, [openAuthModal]);

  return <Navigate to="/" replace />;
};

export default Signup;
