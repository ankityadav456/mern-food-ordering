import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance"; // ✅ Your custom Axios instance
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
      console.log("📦 Fetching cart with token:", user?.token);

      const res = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      console.log("🛒 Cart data:", res.data);
      setCartItems(res.data); // ✅ Your backend returns array, not { cart: [] }
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error.response?.data || error.message);
      toast.error("Failed to load cart");
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
      
      toast.success(`${foodItem.name} added to cart`);
      fetchCartItems();
    } catch (error) {
      console.error("❌ Add to cart error:", error.response?.data || error.message);
      toast.error("Failed to add to cart");
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
      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      console.error("❌ Remove from cart error:", error.response?.data || error.message);
      toast.error("Failed to remove item");
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
      toast.success("Quantity updated");
      fetchCartItems();
    } catch (error) {
      console.error("❌ Update quantity error:", error.response?.data || error.message);
      toast.error("Failed to update quantity");
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
      toast.success("Cart cleared");
      setCartItems([]);
    } catch (error) {
      console.error("❌ Clear cart error:", error.response?.data || error.message);
      toast.error("Failed to clear cart");
    }
  };

  // ✅ Auto-fetch cart when user logs in
  // useEffect(() => {
  //   console.log("🧪 Current user:", user);
  //   if (user?.token) {
  //     fetchCartItems();
  //   }
  // }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
