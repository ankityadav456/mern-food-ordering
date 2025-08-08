// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import defaultUserLogo from "../assets/Images/profile.png";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 📌 On mount — check token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  // 📌 Fetch logged-in user from backend
  const fetchUser = async (token) => {
    try {
      const res = await axios.get("/auth/me");
      const userData = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        isAdmin: res.data.user.isAdmin,
        address: res.data.user.address || null,
        avatar: res.data.user.avatar || defaultUserLogo,
        token, // ✅ keep token inside user
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Fetch User Failed:", error.response?.data?.message || error.message);
      logout(false); // don't redirect on silent fail
    } finally {
      setLoading(false);
    }
  };

  // 📌 Signup
  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });
      if (res.data.token) {
        setAuthData(res.data.user, res.data.token);
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
        setAuthData(res.data.user, res.data.token);
        navigate("/");
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // 📌 Save token + user in one go
  const setAuthData = (userObj, token) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
    const userData = {
      _id: userObj._id,
      name: userObj.name,
      email: userObj.email,
      isAdmin: userObj.isAdmin,
      address: userObj.address || null,
      avatar: userObj.avatar || defaultUserLogo,
      token,
    };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 📌 Update profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put("/auth/update-profile", formData);
      Swal.fire(res.data.message);
      const newUser = { ...user, ...res.data.updatedUser };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (error) {
      throw new Error("Profile update failed");
    }
  };

  // 📌 Update avatar (merge headers so token stays)
  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axios.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire(res.data.message);
      const updatedUser = { ...user, avatar: res.data.avatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error("Avatar upload failed");
    }
  };

  // 📌 Delete avatar (fallback to token in user)
  const handleDeleteAvatar = async () => {
    try {
      const res = await axios.delete("/auth/delete-avatar", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const updatedUser = { ...user, avatar: res.data.user.avatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Avatar removed successfully");
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
        const updatedUser = { ...user, address: res.data.address };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
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
        const updatedUser = { ...user, address: null };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Delete Address Failed");
    }
  };

  // 📌 Logout
  const logout = (redirect = true) => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
