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

const WishlistContext = createContext();

const LOCAL_STORAGE_KEY = "yumigo_wishlist";

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  /* ===============================
     FETCH WISHLIST (FOR LOGGED IN USER)
  =============================== */
  const fetchWishlist = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await axios.get("/wishlist");
      const serverItems = res.data.wishlist || [];

      // Check if there are local guest items to merge into user account
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      const localItems = local ? JSON.parse(local) : [];

      if (localItems.length > 0) {
        const serverIds = new Set(serverItems.map((i) => i._id || i.id));
        const itemsToMerge = localItems.filter(
          (item) => !serverIds.has(item._id || item.id)
        );

        if (itemsToMerge.length > 0) {
          // Merge in background
          for (const item of itemsToMerge) {
            try {
              await axios.post("/wishlist/add", { foodId: item._id || item.id });
            } catch (e) {
              console.error("Error syncing local item to server:", e);
            }
          }
          // Re-fetch after merge
          const updatedRes = await axios.get("/wishlist");
          setWishlistItems(updatedRes.data.wishlist || []);
        } else {
          setWishlistItems(serverItems);
        }
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        setWishlistItems(serverItems);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) {
      fetchedRef.current = false;
      // Load from local storage for guests
      try {
        const local = localStorage.getItem(LOCAL_STORAGE_KEY);
        setWishlistItems(local ? JSON.parse(local) : []);
      } catch {
        setWishlistItems([]);
      }
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchWishlist();
  }, [user?._id, fetchWishlist]);

  // Save guest wishlist to localStorage when unauthenticated
  useEffect(() => {
    if (!user?._id) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(wishlistItems));
      } catch (e) {
        console.error("Local storage error:", e);
      }
    }
  }, [wishlistItems, user?._id]);

  /* ===============================
     FAST ID LOOKUP
  =============================== */
  const wishlistIdSet = useMemo(() => {
    return new Set(wishlistItems.map((item) => item._id || item.id));
  }, [wishlistItems]);

  const isInWishlist = useCallback(
    (foodId) => {
      if (!foodId) return false;
      return wishlistIdSet.has(foodId.toString());
    },
    [wishlistIdSet]
  );

  /* ===============================
     TOGGLE WISHLIST
  =============================== */
  const toggleWishlist = useCallback(
    async (foodItem) => {
      if (!foodItem) return;
      const itemId = (foodItem._id || foodItem.id)?.toString();
      if (!itemId) return;

      const isCurrentlyWishlisted = wishlistIdSet.has(itemId);

      if (isCurrentlyWishlisted) {
        // Optimistically remove from state
        setWishlistItems((prev) =>
          prev.filter((i) => (i._id || i.id)?.toString() !== itemId)
        );

        if (user?._id) {
          try {
            await axios.post("/wishlist/toggle", { foodId: itemId });
            showToast(`${foodItem.name || "Item"} removed from wishlist`, "info");
          } catch (error) {
            console.error("Error toggling wishlist:", error);
            // Rollback on server failure
            setWishlistItems((prev) => [...prev, foodItem]);
            showToast("Failed to update wishlist", "error");
          }
        } else {
          showToast(`${foodItem.name || "Item"} removed from wishlist`, "info");
        }
      } else {
        // Optimistically add to state
        setWishlistItems((prev) => [...prev, foodItem]);

        if (user?._id) {
          try {
            await axios.post("/wishlist/toggle", { foodId: itemId });
            showToast(`${foodItem.name || "Item"} added to wishlist`, "success");
          } catch (error) {
            console.error("Error toggling wishlist:", error);
            // Rollback on server failure
            setWishlistItems((prev) =>
              prev.filter((i) => (i._id || i.id)?.toString() !== itemId)
            );
            showToast("Failed to update wishlist", "error");
          }
        } else {
          showToast(`${foodItem.name || "Item"} added to wishlist`, "success");
        }
      }
    },
    [wishlistIdSet, user?._id]
  );

  /* ===============================
     REMOVE FROM WISHLIST
  =============================== */
  const removeFromWishlist = useCallback(
    async (foodId) => {
      if (!foodId) return;
      const itemId = foodId.toString();

      setWishlistItems((prev) =>
        prev.filter((i) => (i._id || i.id)?.toString() !== itemId)
      );
      showToast("Removed from wishlist", "info");

      if (user?._id) {
        try {
          await axios.delete(`/wishlist/${itemId}`);
        } catch (error) {
          console.error("Error removing from wishlist:", error);
        }
      }
    },
    [user?._id]
  );

  /* ===============================
     CLEAR WISHLIST
  =============================== */
  const clearWishlist = useCallback(async () => {
    setWishlistItems([]);
    if (!user?._id) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      try {
        await axios.delete("/wishlist");
      } catch (error) {
        console.error("Error clearing wishlist:", error);
      }
    }
    showToast("Wishlist cleared", "info");
  }, [user?._id]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        loading,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

export default WishlistContext;
