import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // ✅ Fetch all food items
  const fetchFoodItems = useCallback(async () => {
    // Prevent re-fetch if already loaded
    if (foodItems.length > 0) return;

    try {
      setLoading(true);
      const res = await axios.get("/food");
      setFoodItems(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  }, [foodItems.length]);

  // ✅ Add a new food item (Admin Only)
  const addFoodItem = useCallback(
    async (foodData) => {
      if (!user?.isAdmin) {
        throw new Error("Unauthorized: Only admins can add food items.");
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("/food", foodData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFoodItems((prev) => [...prev, res.data.foodItem]);
        return res.data.message;
      } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to add food item");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // ✅ Update a food item (Admin Only)
  const updateFoodItem = useCallback(
    async (id, updatedData) => {
      if (!user?.isAdmin) {
        throw new Error("Unauthorized: Only admins can update food items.");
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(`/food/${id}`, updatedData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFoodItems((prev) =>
          prev.map((item) => (item._id === id ? res.data.foodItem : item))
        );

        return res.data.message;
      } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to update food item");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // ✅ Delete a food item (Admin Only)
  const deleteFoodItem = useCallback(
    async (id) => {
      if (!user?.isAdmin) {
        throw new Error("Unauthorized: Only admins can delete food items.");
      }

      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/food/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFoodItems((prev) => prev.filter((item) => item._id !== id));
      } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to delete food item");
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // ✅ Auto fetch when mounted (only once)
  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        loading,
        error,
        setLoading,
        fetchFoodItems,
        addFoodItem,
        updateFoodItem,
        deleteFoodItem,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

// Custom Hook
export const useFood = () => useContext(FoodContext);
