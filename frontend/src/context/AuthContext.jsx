import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import defualtUserLogo from "../assets/Images/profile.png";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const decoded = jwtDecode(token);
        setUser((prev) => ({
          ...prev,
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          isAdmin: decoded.isAdmin,
        }));
        fetchUser(); // Optional: update with full data (address, avatar)
      } catch (err) {
        console.error("Invalid token", err);
        logout();
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      const userData = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        isAdmin: res.data.user.isAdmin,
        address: res.data.user.address || null,
        avatar: res.data.user.avatar || defualtUserLogo,
      };
      setUser((prev) => ({ ...prev, ...userData }));
    } catch (error) {
      console.error("Fetch User Failed:", error.response?.data?.message || error.message);
      logout(); // auto logout on error
    } finally {
      setLoading(false);
    }
  };

  const setTokenAndFetchUser = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      const decoded = jwtDecode(token);
      setUser({
        _id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        isAdmin: decoded.isAdmin,
        avatar: defualtUserLogo,
      });
    } catch (err) {
      console.error("Token decode error", err);
    }
    fetchUser();
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      if (res.data.token) {
        setTokenAndFetchUser(res.data.token);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw new Error("Signup failed");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      if (res.data.token) {
        setTokenAndFetchUser(res.data.token);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw new Error("Login failed");
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await axios.put("/auth/update-profile", formData);
      Swal.fire(res.data.message);
      const updatedUser = res.data.updatedUser;
      setUser((prev) => ({ ...prev, ...updatedUser }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire(res.data.message);
      const updatedAvatar = res.data.avatar;
      setUser((prev) => ({ ...prev, avatar: updatedAvatar }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Avatar upload failed");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await axios.delete("/auth/delete-avatar");
      const updatedUser = res.data.user;

      setUser((prev) => ({
        ...prev,
        avatar: updatedUser.avatar || defualtUserLogo,
      }));

      toast.success("Avatar removed successfully");
      return updatedUser.avatar;
    } catch (error) {
      console.error("❌ Delete avatar error:", error.response?.data || error.message);
      toast.error("Failed to remove avatar");
    }
  };

  const saveAddress = async (addressData) => {
    try {
      const res = await axios.put("/auth/save-address", addressData);
      if (res.data.success) {
        setUser((prev) => ({ ...prev, address: res.data.address }));
        return res.data.address;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Save Address Failed");
      throw new Error("Save Address Failed");
    }
  };

  const deleteAddress = async () => {
    try {
      const res = await axios.delete("/auth/delete-address");
      if (res.data.success) {
        setUser((prev) => ({ ...prev, address: null }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Address Failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signup,
        login,
        logout,
        saveAddress,
        deleteAddress,
        updateAvatar,
        handleDeleteAvatar,
        updateProfile,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
