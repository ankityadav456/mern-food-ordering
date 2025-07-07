import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      fetchCartItems();
    }
  }, [user]);

  // ✅ Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      const res = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setCartItems(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error.response?.data || error.message);
      toast.error("Failed to load cart", { duration: 1500 });
    }
  };

  // ✅ Add to Cart
  const addToCart = async (foodItem) => {
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
      toast.success(`${foodItem.name} added to cart`, { duration: 1000 });
      fetchCartItems();
    } catch (error) {
      console.error("❌ Add to cart error:", error.response?.data || error.message);
      toast.error("Failed to add to cart", { duration: 1000 });
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (foodId) => {
    try {
      await axios.delete(`/cart/${foodId}`, {
        headers: {  
          Authorization: `Bearer ${user?.token}`,
        },
      });
      toast.success("Item removed from cart", { duration: 1000 });
      fetchCartItems();
    } catch (error) {
      console.error("❌ Remove from cart error:", error.response?.data || error.message);
      toast.error("Failed to remove item", { duration: 1000 });
    }
  };

  // ✅ Update Quantity
  const updateItemQuantity = async (foodId, quantity) => {
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
      toast.success("Quantity updated", { duration: 1000 });
      fetchCartItems();
    } catch (error) {
      console.error("❌ Update quantity error:", error.response?.data || error.message);
      toast.error("Failed to update quantity", { duration: 1000 });
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
      toast.success("Cart cleared", { duration: 1000 });
    } catch (error) {
      console.error("❌ Clear cart error:", error.response?.data || error.message);
      toast.error("Failed to clear cart", { duration: 1000 });
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
