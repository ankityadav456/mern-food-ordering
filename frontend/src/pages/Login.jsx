import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal("login");
  }, [openAuthModal]);

  return <Navigate to="/" replace />;
};

export default Login;
