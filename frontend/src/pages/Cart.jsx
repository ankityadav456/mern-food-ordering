import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../context/ThemeContext"; // Make sure you have this setup
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    fetchCartItems,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  } = useCart();

  const { theme } = useTheme(); // light | dark
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("All");
 const navigate = useNavigate();
  useEffect(() => {
    const loadCart = async () => {
      await fetchCartItems();
      setLoading(false);
    };
    loadCart();
  }, []);

  const totalPrice = (cartItems || []).reduce(
    (acc, item) => acc + item.foodId.price * item.quantity,
    0
  );

  const totalItems = cartItems.length;

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      setActionLoading(true);
      await removeFromCart(id);
      // toast.success("Item removed from cart");
    } catch {
      // toast.error("Failed to remove item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    setActionLoading(true);
    await updateItemQuantity(id, quantity);
    setActionLoading(false);
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear the entire cart?")) return;
    try {
      setActionLoading(true);
      await clearCart();
      // toast.success("Cart cleared");
    } catch {
      // toast.error("Failed to clear cart");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredItems = (cartItems || []).filter((item) => {
    if (filter === "All") return true;
    return item.foodId.category?.toLowerCase() === filter.toLowerCase();
  });

  const backhandle = () => {
    
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-[#0d0d0d]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 py-5  bg-[#FAF9F6] text-black dark:bg-[#0d0d0d] dark:text-white transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-4 pb-2 border-b border-[#D4AF37] text-center">
        Your Cart 🛒{" "}
        <span className="text-xl text-[#D4AF37]">({totalItems} items)</span>
      </h2>

      <AnimatePresence>
        {(!filteredItems || filteredItems.length === 0) ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center py-24"
          >
            <p className="text-2xl font-semibold text-[#D4AF37] mb-4">
              No items found in this category!
            </p>
            <Link
              to="/menu"
              className="inline-block px-6 py-2 bg-red-600 dark:bg-[#B22222] text-white rounded-full hover:bg-[#D4AF37] hover:text-black transition"
            >
              Explore Menu
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.foodId._id}
                className="flex flex-col sm:flex-row justify-between items-center border border-gray-300 dark:border-[#2A2A2A] bg-white/70 dark:bg-[#1A1A1A]/60 backdrop-blur-md rounded-2xl p-4 shadow-lg transition hover:shadow-[#FFD700]/20"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.foodId.image}
                    alt={item.foodId.name}
                    className="h-20 w-20 object-cover rounded-lg border border-[#D4AF37]"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-[#D4AF37]">
                      {item.foodId.name}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      ₹{item.foodId.price.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.foodId._id, item.quantity - 1)
                    }
                    className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] hover:bg-red-600 transition"
                    disabled={actionLoading}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-3 text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.foodId._id, item.quantity + 1)
                    }
                    className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] hover:bg-[#FFD700] transition"
                    disabled={actionLoading}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(item.foodId._id)}
                    className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] text-red-500 hover:bg-[#B22222] hover:text-white transition"
                    disabled={actionLoading}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Cart Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row justify-between items-center mt-8 border-t border-gray-300 dark:border-[#2A2A2A] pt-6"
            >
              <p className="text-2xl font-bold text-[#FFD700]">
                Total: ₹{totalPrice.toLocaleString("en-IN")}
              </p>

              <div className="mt-4 sm:mt-0 flex space-x-4">
           
                  <button onClick={() => navigate(-1)}  type="button"
              to="/"
              className="px-5 py-2 bg-gray-200 dark:bg-[#2A2A2A] text-black dark:text-white rounded-full hover:bg-[#B22222] transition"
            >
              Back
            </button>
                <button
                  onClick={handleClearCart}
                  className="px-5 py-2 bg-gray-200 dark:bg-[#2A2A2A] text-black dark:text-white rounded-full hover:bg-[#B22222] transition"
                  disabled={actionLoading}
                >
                  Clear Cart
                </button>
                <Link
                  to="/checkout"
                  onClick={() => toast.success("Proceeding to checkout...")}
                  className="px-5 py-2 bg-gradient-to-r from-[#FFD700] to-[#8B0000] text-black font-semibold rounded-full hover:opacity-90 transition"
                >
                  Checkout
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
