// context/AuthContext.jsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { showToast } from "../utils/showToast.jsx"
import defaultUserLogo from "../assets/Images/profile.png";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  /* ================= STATE ================= */

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FORMAT USER ================= */

  const formatUser = useCallback((userData) => {
    if (!userData) return null;

    return {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      isAdmin: userData.isAdmin,
      address: userData.address || null,
      avatar: userData.avatar || defaultUserLogo,
    };
  }, []);

  /* ================= FETCH USER ================= */

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/me");
      setUser(formatUser(data.user));
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [formatUser]);

  /* ================= INITIAL AUTH CHECK ================= */

  useEffect(() => {
    fetchUser(); // cookie auto sent
  }, [fetchUser]);

  /* ================= AUTH ================= */

  const signup = async (name, email, password) => {
    try {
      setLoading(true);

      const { data } = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

       localStorage.setItem("token", data.token);

      setUser(formatUser(data.user));
      navigate("/");
    } catch (error) {
      showToast(error.response?.data?.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);

      const { data } = await axios.post("/auth/login", {
        email,
        password,
      });
        localStorage.setItem("token", data.token);

      // ✅ cookie already set by backend
      setUser(formatUser(data.user));

      navigate("/");
    } catch (error) {
      showToast(error.response?.data?.message || "Login failed","error");
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async () => {
     localStorage.removeItem("token"); // ← remove token
    try {
      await axios.post("/auth/logout"); // clears cookie
    } catch {
      showToast("Logout failed", "error");
    }

    setUser(null);
    navigate("/login");
  }, [navigate]);

  /* ================= PROFILE ================= */

  const updateProfile = async (formData) => {
    try {
      const { data } = await axios.put("/auth/update-profile", formData);
      Swal.fire({
        title: data.message,
        icon: "success",
      });
      setUser(formatUser(data.user));
    } catch {
      showToast("Profile update failed","error");
    }
  };

  /* ================= AVATAR ================= */

  const updateAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await axios.put("/auth/update-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: data.message,
        icon: "success",
      });

      setUser((prev) => ({
        ...prev,
        avatar: data.avatar,
      }));
    } catch {
      showToast("Avatar update failed", "error");
    }
  };

  const deleteAvatar = async () => {
    try {
      await axios.delete("/auth/delete-avatar");

      showToast("Avatar removed", "success");

      setUser((prev) => ({
        ...prev,
        avatar: defaultUserLogo,
      }));
    } catch {
      showToast("Delete avatar failed", "error");
    }
  };

  /* ================= ADDRESS ================= */

  const saveAddress = async (addressData) => {
    try {
      const { data } = await axios.put("/auth/save-address", addressData);

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          address: data.address,
        }));
        return data.address;
      }
    } catch {
      showToast("Address save failed", "error");
    }
  };

  const deleteAddress = async () => {
    try {
      const { data } = await axios.delete("/auth/delete-address");

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          address: null,
        }));
      }
    } catch {
      showToast("Delete address failed", "error");
    }
  };

  /* ================= CONTEXT VALUE ================= */

  const value = useMemo(
    () => ({
      user,
      loading,
      signup,
      login,
      logout,
      fetchUser,
      updateProfile,
      updateAvatar,
      deleteAvatar,
      saveAddress,
      deleteAddress,
      isAuthenticated: !!user,
    }),
    [user, loading, logout, fetchUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);