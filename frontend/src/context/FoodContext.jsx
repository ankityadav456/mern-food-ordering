import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";

const FoodContext = createContext();

export const FoodProvider = ({ children }) => {
  const { user } = useAuth();

  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= FETCH FOOD ================= */

  const fetchFoodItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get("/food");

      setFoodItems(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= ADD FOOD ================= */

const addFoodItem = useCallback(
  async (formData) => {
    if (!user?.isAdmin)
      throw new Error("Only admins can add food items");

    try {
      setLoading(true);

      const { data } = await axios.post("/food", formData);

      // optimistic update
      setFoodItems((prev) => [...prev, data.foodItem]);

      return data.message;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to add food item"
      );
    } finally {
      setLoading(false);
    }
  },
  [user]
);

  /* ================= UPDATE FOOD ================= */

 const updateFoodItem = useCallback(
  async (id, formData) => {
    if (!user?.isAdmin)
      throw new Error("Only admins can update food items");

    try {
      setLoading(true);

      const { data } = await axios.put(`/food/${id}`, formData);

      setFoodItems((prev) =>
        prev.map((item) =>
          item._id === id ? data.foodItem : item
        )
      );

      return data.message;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to update food item"
      );
    } finally {
      setLoading(false);
    }
  },
  [user]
);

  /* ================= DELETE FOOD ================= */

  const deleteFoodItem = useCallback(
    async (id) => {
      if (!user?.isAdmin)
        throw new Error("Only admins can delete food items");

      try {
        setLoading(true);

        await axios.delete(`/food/${id}`);

        setFoodItems((prev) =>
          prev.filter((item) => item._id !== id)
        );
      } catch (err) {
        throw new Error(
          err.response?.data?.message || "Failed to delete food item"
        );
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  /* ================= INITIAL LOAD ================= */

  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);

  /* ================= PROVIDER ================= */

  return (
    <FoodContext.Provider
      value={{
        foodItems,
        loading,
        error,
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

export const useFood = () => useContext(FoodContext);