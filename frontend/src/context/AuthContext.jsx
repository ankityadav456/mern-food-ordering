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
import { toast } from "react-hot-toast";
import defaultUserLogo from "../assets/Images/profile.png";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  /* ================= FETCH USER ================= */

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/me");

      const loggedUser = {
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin,
        address: data.user.address || null,
        avatar: data.user.avatar || defaultUserLogo,
      };

      setUser(loggedUser);

      // fetch admin users only once
      if (loggedUser.isAdmin) {
        fetchAllUsers();
      }
    } catch (error) {
      console.error(
        "Fetch User Failed:",
        error.response?.data?.message || error.message
      );
      logout(false);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= INITIAL AUTH LOAD ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  }, [fetchUser]);

  /* ================= SET TOKEN ================= */

  const setAuthData = (token) => {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    fetchUser();
  };

  /* ================= AUTH ================= */

  const signup = async (name, email, password) => {
    const { data } = await axios.post("/auth/register", {
      name,
      email,
      password,
    });

    if (data.token) {
      setAuthData(data.token);
      navigate("/");
    }
  };

  const login = async (email, password) => {
    const { data } = await axios.post("/auth/login", {
      email,
      password,
    });

    if (data.token) {
      setAuthData(data.token);
      navigate("/");
    }
  };

  const logout = useCallback(
    (redirect = true) => {
      setUser(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      if (redirect) navigate("/login");
    },
    [navigate]
  );

  /* ================= PROFILE ================= */

  const updateProfile = async (formData) => {
    const { data } = await axios.put("/auth/update-profile", formData);

    Swal.fire(data.message);

    setUser((prev) => ({
      ...prev,
      name: data.user.name,
      email: data.user.email,
    }));
  };

  /* ================= AVATAR ================= */

  const updateAvatar = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    const { data } = await axios.put(
      "/auth/update-avatar",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    Swal.fire(data.message);

    setUser((prev) => ({
      ...prev,
      avatar: data.avatar,
    }));
  };

  const handleDeleteAvatar = async () => {
    await axios.delete("/auth/delete-avatar");

    toast.success("Avatar removed");

    // ❌ no fetchUser()
    setUser((prev) => ({
      ...prev,
      avatar: defaultUserLogo,
    }));
  };

  /* ================= ADDRESS ================= */

  const saveAddress = async (addressData) => {
    const { data } = await axios.put(
      "/auth/save-address",
      addressData
    );

    if (data.success) {
      setUser((prev) => ({
        ...prev,
        address: data.address,
      }));

      return data.address;
    }
  };

  const deleteAddress = async () => {
    const { data } = await axios.delete("/auth/delete-address");

    if (data.success) {
      setUser((prev) => ({
        ...prev,
        address: null,
      }));
    }
  };

  /* ================= ADMIN ================= */

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);

      const { data } = await axios.get("/admin/users");

      if (data.success) setAllUsers(data.users);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Fetch users failed"
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const deleteUser = async (id) => {
    await axios.delete(`/admin/users/${id}`);

    toast.success("User deleted");

    setAllUsers((prev) =>
      prev.filter((u) => u._id !== id)
    );
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const { data } = await axios.put(
      `/admin/users/${id}/status`,
      {
        status: currentStatus === "Active" ? "Blocked" : "Active",
      }
    );

    toast.success("Status updated");

    setAllUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, status: data.status } : u
      )
    );
  };

  const updateUser = async (id, updatedFields) => {
    const { data } = await axios.put(
      `/admin/users/${id}`,
      updatedFields
    );

    toast.success("User updated");

    setAllUsers((prev) =>
      prev.map((u) =>
        u._id === id ? { ...u, ...data.user } : u
      )
    );
  };

  /* ================= MEMOIZED VALUE ================= */

  const value = useMemo(
    () => ({
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
    }),
    [user, loading, allUsers, loadingUsers]
  );

  /* ================= PROVIDER ================= */

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);