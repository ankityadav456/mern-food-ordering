// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import defaultUserLogo from "../assets/Images/profile.png";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
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

  // 🔹 Fetch logged-in user
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

      // ✅ auto-fetch all users if logged-in user is admin
      if (res.data.user.isAdmin) fetchAllUsers();
    } catch (error) {
      console.error("Fetch User Failed:", error.response?.data?.message || error.message);
      logout(false);
    } finally {
      setLoading(false);
    }
  };

  const setAuthData = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  };

  // 🔹 Signup
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

  // 🔹 Login
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

  // 🔹 Logout
  const logout = (redirect = true) => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    if (redirect) navigate("/login");
  };

  // 🔹 Profile update
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put("/auth/update-profile", formData);
      Swal.fire(res.data.message);
      fetchUser();
    } catch (error) {
      throw new Error("Profile update failed");
    }
  };

  // 🔹 Avatar update
  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await axios.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Swal.fire(res.data.message);
      fetchUser();
    } catch (error) {
      throw new Error("Avatar upload failed");
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const res = await axios.delete("/auth/delete-avatar");
      toast.success("Avatar removed successfully");
      fetchUser();
      return res.data.user.avatar;
    } catch {
      toast.error("Failed to remove avatar");
    }
  };

  // 🔹 Address
  const saveAddress = async (addressData) => {
    try {
      const res = await axios.put("/auth/save-address", addressData);
      if (res.data.success) {
        fetchUser();
        return res.data.address;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Save Address Failed");
    }
  };

  const deleteAddress = async () => {
    try {
      const res = await axios.delete("/auth/delete-address");
      if (res.data.success) fetchUser();
    } catch (error) {
      throw new Error(error.response?.data?.message || "Delete Address Failed");
    }
  };

  // 🔹 Admin actions
  const fetchAllUsers = async () => {
    if (!user?.isAdmin) return;
    try {
      setLoadingUsers(true);
      const { data } = await axios.get("/admin/users"); // admin endpoint
      if (data.success) setAllUsers(data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/admin/users/${id}`);
      toast.success("User deleted successfully");
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const { data } = await axios.put(`/admin/users/${id}/status`, {
        status: currentStatus === "Active" ? "Blocked" : "Active",
      });
      toast.success("User status updated");
      setAllUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: data.status } : u))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const updateUser = async (id, updatedFields) => {
    try {
      const { data } = await axios.put(`/admin/users/${id}`, updatedFields);
      toast.success("User updated successfully");
      setAllUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, ...data.user } : u))
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        updateAvatar,
        handleDeleteAvatar,
        saveAddress,
        deleteAddress,
        allUsers,
        loadingUsers,
        fetchAllUsers,
        deleteUser,
        toggleUserStatus,
        updateUser,
        fetchUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
