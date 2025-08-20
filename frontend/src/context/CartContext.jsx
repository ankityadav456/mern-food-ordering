import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [user]);


const fetchCartItems = async () => {
  try {
    setLoading(true);
    const res = await axios.get("/cart"); // uses baseURL automatically
    setCartItems(res.data.cart);
  } catch (error) {
    console.error("❌ Failed to fetch cart:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Failed to load cart");
  } finally {
    setLoading(false);
  }
};


  // ✅ Add to Cart
  const addToCart = async (foodItem) => {
    // Optimistic UI update
    const existingItem = Array.isArray(cartItems) ? cartItems.find((item) => item.foodId._id === foodItem._id):0;
    if (existingItem) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.foodId._id === foodItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { foodId: foodItem, quantity: 1 }]);
    }

    try {
      await axios.post(
        "/cart",
        { foodId: foodItem._id },
        { withCredentials: true }
      );
      toast.success(`${foodItem.name} added to cart`);
      fetchCartItems();
    } catch (error) {
      toast.error("Failed to add to cart");
      fetchCartItems(); // rollback
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (foodId) => {
    const previousCart = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item.foodId._id !== foodId));

    try {
      await axios.delete(`/cart/${foodId}`, { withCredentials: true });
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
      setCartItems(previousCart); // rollback
    }
  };

  // ✅ Update Quantity
  const updateItemQuantity = async (foodId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.foodId._id === foodId ? { ...item, quantity } : item
      )
    );

    try {
      await axios.put(
        `/cart/${foodId}`,
        { quantity },
        { withCredentials: true }
      );
      toast.success("Quantity updated");
    } catch (error) {
      toast.error("Failed to update quantity");
      fetchCartItems(); // rollback
    }
  };

  // ✅ Clear Cart
  const clearCart = async () => {
    try {
      await axios.delete("/cart", { withCredentials: true });
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("❌ Clear cart error:", error.response?.data || error.message);
      toast.error("Failed to clear cart");
    }
  };

  // ✅ Total Price
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
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
