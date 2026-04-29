import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { showToast } from "../utils/showToast.jsx";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ prevents duplicate calls
  const cartFetched = useRef(false);

  /* ===============================
     FETCH CART
  =============================== */
  const fetchCartItems = useCallback(async () => {
    try {
      setLoading(true);

      const res = await axios.get("/cart");

      setCartItems(res.data.cart || []);
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  /* ===============================
     FETCH ONLY ON LOGIN CHANGE
  =============================== */
  useEffect(() => {
    // user logged out
    if (!user?._id) {
      cartFetched.current = false;
      setCartItems([]);
      setLoading(false);
      return;
    }

    // prevent re-fetch on profile/address update
    if (cartFetched.current) return;

    cartFetched.current = true;
    fetchCartItems();
  }, [user?._id, fetchCartItems]);

  /* ===============================
     ADD TO CART (OPTIMISTIC)
  =============================== */
  const addToCart = useCallback(
    async (foodItem) => {
      const existing = cartItems.find(
        (item) => item.foodId._id === foodItem._id
      );

      if (existing) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.foodId._id === foodItem._id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCartItems((prev) => [
          ...prev,
          { foodId: foodItem, quantity: 1 },
        ]);
      }

      try {
        await axios.post("/cart", { foodId: foodItem._id });
        showToast(`${foodItem.name} added`, "success");
      } catch {
        showToast("Failed to add item", "error");
        fetchCartItems();
      }
    },
    [cartItems, fetchCartItems]
  );

  /* ===============================
     REMOVE ITEM
  =============================== */
  const removeFromCart = useCallback(
    async (foodId) => {
      const backup = cartItems;

      setCartItems((prev) =>
        prev.filter((item) => item.foodId._id !== foodId)
      );

      try {
        await axios.delete(`/cart/${foodId}`);
        showToast("Item removed", "success");
      } catch {
        showToast("Remove failed", "error");
        setCartItems(backup);
      }
    },
    [cartItems]
  );

  /* ===============================
     UPDATE QUANTITY
  =============================== */
  const updateItemQuantity = useCallback(
    async (foodId, quantity, showMessage = false) => {
      setCartItems((prev) =>
        prev.map((item) =>
          item.foodId._id === foodId
            ? { ...item, quantity }
            : item
        )
      );

      try {
        await axios.put(`/cart/${foodId}`, { quantity });
        if (showMessage) {
      showToast("Quantity Updated", "success");
    }
      } catch {
      if (showMessage) {
      showToast("Update failed", "error");
    }
        fetchCartItems();
      }
    },
    [fetchCartItems]
  );

  /* ===============================
     CLEAR CART
  =============================== */
  const clearCart = useCallback(async () => {
    try {
      await axios.delete("/cart");
      setCartItems([]);
      showToast("Cart cleared", "success");
    } catch {
      showToast("Failed to clear cart", "error");
    }
  }, []);

  /* ===============================
     DERIVED STATE
  =============================== */
  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) =>
          total + item.foodId.price * item.quantity,
        0
      ),
    [cartItems]
  );

  /* ===============================
     CONTEXT VALUE
  =============================== */
  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      totalPrice,
      loading,
      addToCart,
      removeFromCart,
      updateItemQuantity,
      clearCart,
      fetchCartItems,
    }),
    [
      cartItems,
      cartCount,
      totalPrice,
      loading,
      addToCart,
      removeFromCart,
      updateItemQuantity,
      clearCart,
      fetchCartItems,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);