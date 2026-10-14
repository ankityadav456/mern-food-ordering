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
  const { user, openAuthModal } = useAuth();

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
    async (foodItem, showToastMessage = true) => {
      if (!user?._id) {
        if (openAuthModal) openAuthModal("login");
        showToast("Please sign in to add items to cart", "info");
        return;
      }

      const targetId = (foodItem._id || foodItem.id)?.toString();
      if (!targetId) return;

      const existing = cartItems.find((item) => {
        const id = (item.foodId?._id || item.foodId || item._id)?.toString();
        return id === targetId;
      });

      if (existing) {
        setCartItems((prev) =>
          prev.map((item) => {
            const id = (item.foodId?._id || item.foodId || item._id)?.toString();
            return id === targetId
              ? { ...item, quantity: item.quantity + 1 }
              : item;
          })
        );
      } else {
        setCartItems((prev) => [
          ...prev,
          { foodId: foodItem, quantity: 1 },
        ]);
      }

      try {
        await axios.post("/cart", { foodId: targetId });
        if (showToastMessage) {
          showToast(`${foodItem.name || "Item"} added to cart`, "success");
        }
      } catch {
        showToast("Failed to add item", "error");
        fetchCartItems();
      }
    },
    [cartItems, fetchCartItems, user?._id, openAuthModal]
  );

  /* ===============================
     REMOVE ITEM
  =============================== */
  const removeFromCart = useCallback(
    async (foodId) => {
      const targetId = foodId?.toString();
      const backup = cartItems;

      setCartItems((prev) =>
        prev.filter((item) => {
          const id = (item.foodId?._id || item.foodId || item._id)?.toString();
          return id !== targetId;
        })
      );

      try {
        await axios.delete(`/cart/${targetId}`);
        // showToast("Item removed", "success");
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
      const targetId = foodId?.toString();

      setCartItems((prev) =>
        prev.map((item) => {
          const id = (item.foodId?._id || item.foodId || item._id)?.toString();
          return id === targetId ? { ...item, quantity } : item;
        })
      );

      try {
        await axios.put(`/cart/${targetId}`, { quantity });
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