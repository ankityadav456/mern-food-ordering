import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(true); // ✅ New
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      fetchCartItems();
    }else{
      setLoading(false);
    }
  }, [user]);

  // ✅ Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCartItems(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error.response?.data || error.message);
      toast.error("Failed to load cart");
      setLoading(false);
    } finally {
      setLoading(false); // ✅ Done loading
    }

  };

  // ✅ Add to Cart
  const addToCart = async (foodItem) => {
  // Optimistically update UI
  const existingItem = cartItems.find((item) => item.foodId._id === foodItem._id);
  if (existingItem) {
    // If item already exists, increase quantity locally
    setCartItems((prev) =>
      prev.map((item) =>
        item.foodId._id === foodItem._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  } else {
    // Add new item locally
    setCartItems((prev) => [
      ...prev,
      { foodId: foodItem, quantity: 1 },
    ]);
  }

  try {
    await axios.post(
      "/cart",
      { foodId: foodItem._id },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    toast.success(`${foodItem.name} added to cart`);
    fetchCartItems(); // Optional: Refresh for accurate backend state
  } catch (error) {
    toast.error("Failed to add to cart");
    fetchCartItems(); // Rollback to real backend state
  }
};


  // ✅ Remove from Cart
 const removeFromCart = async (foodId) => {
  // Optimistically update UI
  const previousCart = [...cartItems];
  setCartItems((prev) => prev.filter((item) => item.foodId._id !== foodId));

  try {
    await axios.delete(`/cart/${foodId}`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    toast.success("Item removed from cart");
  } catch (error) {
    toast.error("Failed to remove item");
    setCartItems(previousCart); // Rollback if failed
  }
};


  // ✅ Update Quantity
const updateItemQuantity = async (foodId, quantity) => {
  // ✅ Optimistically update local state first
  setCartItems((prevItems) =>
    prevItems.map((item) =>
      item.foodId._id === foodId ? { ...item, quantity } : item
    )
  );

  try {
    await axios.put(
      `/cart/${foodId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    toast.success("Quantity updated");
  } catch (error) {
    toast.error("Failed to update quantity");

    // ❗ Rollback if API fails
    await fetchCartItems(); // or revert to previous state manually
  }
};


  // ✅ Clear Cart
  const clearCart = async () => {
    try {
      await axios.delete("/cart", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("❌ Clear cart error:", error.response?.data || error.message);
      toast.error("Failed to clear cart");
    }
  };

  // ✅ Total Price Calculator
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.foodId.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
