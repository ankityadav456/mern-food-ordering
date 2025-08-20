// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import defaultUserLogo from "../assets/Images/profile.png";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ✅ no localStorage user
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📌 On mount — check token & fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  // 📌 Fetch logged-in user from backend
  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser({
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        isAdmin: res.data.user.isAdmin,
        address: res.data.user.address || null,
        avatar: res.data.user.avatar || defaultUserLogo,
      });
    } catch (error) {
      console.error("Fetch User Failed:", error.response?.data?.message || error.message);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Save token + fetch fresh user
  const setAuthData = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  };

  // 📌 Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      if (res.data.token) {
        setAuthData(res.data.token);
        navigate("/");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  // 📌 Login
  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (res.data.token) {
        setAuthData(res.data.token);
        navigate("/");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // 📌 Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put("/auth/update-profile", formData);
      Swal.fire(res.data.message);
      fetchUser(); // ✅ get updated data
    } catch (error) {
      throw new Error("Profile update failed");
    }
  };

  // 📌 Update avatar
  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axios.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire(res.data.message);
      fetchUser(); // ✅ get updated avatar
    } catch (error) {
      throw new Error("Avatar upload failed");
    }
  };

  // 📌 Delete avatar
  const handleDeleteAvatar = async () => {
    try {
      const res = await axios.delete("/auth/delete-avatar");
      toast.success("Avatar removed successfully");
      fetchUser(); // ✅ refresh user data
      return res.data.user.avatar;
    } catch {
      toast.error("Failed to remove avatar");
    }
  };

  // 📌 Save address
  const saveAddress = async (addressData) => {
    try {
      const res = await axios.put("/auth/save-address", addressData);
      if (res.data.success) {
        fetchUser(); // ✅ refresh
        return res.data.address;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Save Address Failed");
    }
  };

  // 📌 Delete address
  const deleteAddress = async () => {
    try {
      const res = await axios.delete("/auth/delete-address");
      if (res.data.success) {
        fetchUser(); // ✅ refresh
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Delete Address Failed");
    }
  };

  // 📌 Logout
  const logout = (redirect = true) => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    if (redirect) navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        updateProfile,
        updateAvatar,
        handleDeleteAvatar,
        saveAddress,
        deleteAddress,
        fetchUser, // in case you want to manually refresh
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
