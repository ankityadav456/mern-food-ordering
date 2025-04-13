import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext"; // ✅ Import AuthContext

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // ✅ Get logged-in user

  // ✅ Fetch all food items
  const fetchFoodItems = async () => {
    setLoading(true);
    try { 
      const res = await axios.get("/food");
      setFoodItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add a new food item (Admin Only)
  const addFoodItem = async (foodData) => {
    if (!user?.isAdmin) {
      throw new Error("Unauthorized: Only admins can add food items.");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("/food", foodData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoodItems((prev) => [...prev, res.data.foodItem]); // Add new item to state
      return res.data.message;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to add food item");
    }
  };

  // ✅ Update a food item (Admin Only)
  const updateFoodItem = async (id, updatedData) => {
    if (!user?.isAdmin) {
      throw new Error("Unauthorized: Only admins can update food items.");
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`/food/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update foodItems state
      setFoodItems((prev) =>
        prev.map((item) => (item._id === id ? res.data.foodItem : item))
      );

      return res.data.message;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update food item");
    }
  };

  // ✅ Delete a food item (Admin Only)
  const deleteFoodItem = async (id) => {
    if (!user?.isAdmin) {
      throw new Error("Unauthorized: Only admins can delete food items.");
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/food/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFoodItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete food item");
    }
  };

  useEffect(() => {
    fetchFoodItems();
  }, []);

  return (
    <FoodContext.Provider value={{ foodItems, loading, error, addFoodItem, updateFoodItem, deleteFoodItem }}>
      {children}
    </FoodContext.Provider>
  );
};

// Custom Hook for easy access
export const useFood = () => useContext(FoodContext);
