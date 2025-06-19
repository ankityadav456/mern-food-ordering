import { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get("/auth/me");

      const userData = {
        _id: res.data.user._id,
        name: res.data.user.name,
        email: res.data.user.email,
        isAdmin: res.data.user.isAdmin,
        address: res.data.user.address || null, // ✅ Add address here
        token,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Fetch User Failed:", error.response?.data?.message || error.message);
      setUser(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await axios.post("/auth/register", { name, email, password });

      if (res.data.token) {
        const token = res.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);

        const userData = {
          _id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          isAdmin: res.data.user.isAdmin,
          address: res.data.user.address || null, // ✅ Add address here
          token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.message || "Something went wrong");
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });

      if (res.data.token) {
        const token = res.data.token;
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);

        const userData = {
          _id: res.data.user._id,
          name: res.data.user.name,
          email: res.data.user.email,
          isAdmin: res.data.user.isAdmin,
          address: res.data.user.address || null, // ✅ Add address here
          token,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data?.message || "Something went wrong");
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  // const saveAddress = async (addressData) => {
  //   try {
  //     const res = await axios.put("/auth/save-address", addressData);
  //     if (res.data.success) {
  //       const updatedUser = { ...user, address: res.data.address };
  //       setUser(updatedUser);
  //       localStorage.setItem("user", JSON.stringify(updatedUser));
  //     }
  //   } catch (error) {
  //     console.error("Save Address Failed:", error.response?.data?.message || "Something went wrong");
  //     throw new Error(error.response?.data?.message || "Save Address Failed");
  //   }
  // };

  // const deleteAddress = async () => {
  //   try {
  //     const res = await axios.delete("/auth/delete-address");
  //     if (res.data.success) {
  //       const updatedUser = { ...user, address: null };
  //       setUser(updatedUser);
  //       localStorage.setItem("user", JSON.stringify(updatedUser));
  //     }
  //   } catch (error) {
  //     console.error("Delete Address Failed:", error.response?.data?.message || "Something went wrong");
  //     throw new Error(error.response?.data?.message || "Delete Address Failed");
  //   }
  // };

   const saveAddress = async (addressData) => {
    try {
      const res = await axios.put("/auth/save-address", addressData);
      if (res.data.success) {
        const updatedUser = { ...user, address: res.data.address };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return res.data.address; // Return the updated address to update UI
      }
    } catch (error) {
      console.error("Save Address Failed:", error.response?.data?.message || "Something went wrong");
      throw new Error(error.response?.data?.message || "Save Address Failed");
    }
  };

  const deleteAddress = async () => {
    try {
      const res = await axios.delete("/auth/delete-address");
      if (res.data.success) {
        const updatedUser = { ...user, address: null };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Delete Address Failed:", error.response?.data?.message || "Something went wrong");
      throw new Error(error.response?.data?.message || "Delete Address Failed");
    }
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, saveAddress, deleteAddress, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
