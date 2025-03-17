import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

// Create Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch User Details
  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role, // ✅ Store role
      });
  
      localStorage.setItem("user", JSON.stringify({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        role: res.data.user.role, // ✅ Save role in localStorage
      }));
  
    } catch (error) {
      console.error("Fetch User Failed:", error.response?.data?.message || error.message);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };
  

  // ✅ Signup Function
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });
  
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  
        const userData = {
          _id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role, // ✅ Store role
        };
  
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/"); // Redirect after signup ✅
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || "Something went wrong");
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };
  

  // ✅ Login Function
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
  
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
  
        const userData = {
          _id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role, // ✅ Store role
        };
  
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/"); // Redirect after login ✅
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || "Something went wrong");
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };
  

  // ✅ Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login"); // Redirect after logout ✅
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);
