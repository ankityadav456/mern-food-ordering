import { useCart } from "../context/CartContext";
import { Trash2, Plus, Minus, ArrowLeft, CreditCard, Tag, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import Lottie from "lottie-react";
import emptyCartAnim from "../assets/lottieIJson/Empty red.json";
import shoppingCartAnim from "../assets/lottieIJson/shopping cart.json";

const Cart = () => {
  const {
    cartItems,
    fetchCartItems,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  } = useCart();

  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [coupon, setCoupon] = useState("");

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

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this item?")) return;
    setActionLoading(true);
    await removeFromCart(id);
    setActionLoading(false);
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    setActionLoading(true);
    await updateItemQuantity(id, quantity);
    setActionLoading(false);
  };

  const handleClearCart = async () => {
    if (!window.confirm("Clear the cart?")) return;
    setActionLoading(true);
    await clearCart();
    setActionLoading(false);
  };

  const handleApplyCoupon = () => {
    if (coupon.trim()) {
      toast.success("Coupon applied!");
      setCoupon("");
    } else {
      toast.error("Enter a valid code");
    }
  };

  const estimatedTime = new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-[#0d0d0d]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 py-6 text-black dark:text-white">
      <h2 className="text-3xl font-bold mb-6 text-center border-b border-[#FFD54F] pb-3 flex items-center justify-center gap-2">
        <Lottie animationData={shoppingCartAnim} className="h-13 w-16" loop autoplay />
        Your Cart
        <span className="text-xl text-[#FFD54F] ml-2">
          ({cartItems.length} items)
        </span>
      </h2>


      <AnimatePresence>
        {cartItems.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="text-center py-20"
          >
            <Lottie animationData={emptyCartAnim} className="h-60 mx-auto mb-6" />
            <p className="text-xl font-semibold text-[#FFD54F] mb-4">Your cart is empty!</p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#FF5722] text-white rounded-full hover:bg-[#FFD54F] hover:text-black transition"
            >
              <ShoppingCart size={18} /> Explore Menu
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="filled"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Cart Items Section */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  layout
                  key={item.foodId._id}
                  className="flex flex-col sm:flex-row justify-between items-center border border-gray-300 dark:border-[#2A2A2A] bg-white/80 dark:bg-[#1E1E1E] backdrop-blur-md rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={item.foodId.image}
                      alt={item.foodId.name}
                      className="h-20 w-20 object-cover rounded-lg border border-[#FFD54F]"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#FF5722]">{item.foodId.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ₹{item.foodId.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleQuantityChange(item.foodId._id, item.quantity - 1)}
                      className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] hover:bg-red-600 transition"
                      disabled={actionLoading}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 text-lg">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.foodId._id, item.quantity + 1)}
                      className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] hover:bg-[#FFD54F] transition"
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
              <div className="flex flex-wrap gap-4">
                <Link to="/"
                  className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-[#2A2A2A] text-black dark:text-white rounded-full hover:bg-[#B22222] hover:text-white transition"
                >
                  <ArrowLeft size={18} /> Back
                </Link>

                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-[#2A2A2A] text-black dark:text-white rounded-full hover:bg-[#B22222] hover:text-white transition"
                  disabled={actionLoading}
                >
                  <Trash2 size={18} /> Clear Cart
                </button>
              </div>

            </div>

            {/* Right Side Summary */}
            <div className="w-full lg:w-1/3 h-full bg-white dark:bg-[#1E1E1E] border border-gray-300 dark:border-[#2A2A2A] rounded-xl p-6 shadow-md space-y-6">
              <div className="text-center lg:text-left space-y-1">
                <p className="text-2xl font-bold text-[#FF5722]">
                  Total: ₹{totalPrice.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  🚚 Estimated delivery by{" "}
                  <span className="text-[#FFD54F] font-medium">{estimatedTime}</span>
                </p>
              </div>

              {/* Coupon Code */}
              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Coupon code"
                  className="w-[60%] md:w-full flex-grow min-w-0 px-4 py-2 rounded-full border border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-[#FFD54F] text-black rounded-full flex items-center gap-1 hover:opacity-90 transition whitespace-nowrap"
                >
                  <Tag size={16} /> Apply
                </button>
              </div>


              {/* Action Buttons */}
              <div className="flex flex-col gap-3">


                <Link
                  to="/checkout"
                  onClick={() => toast.success("Proceeding to checkout...")}
                  className="flex items-center justify-center gap-2 px-5 py-2 bg-gradient-to-r from-[#FFD54F] to-[#FF5722] text-black font-semibold rounded-full hover:opacity-90 transition"
                >
                  <CreditCard size={18} /> Checkout
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
