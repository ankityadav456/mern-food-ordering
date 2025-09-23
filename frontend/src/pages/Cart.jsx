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
import Swal from "sweetalert2";
const Cart = () => {
  const { cartItems, fetchCartItems, removeFromCart, updateItemQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const navigate = useNavigate();
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [discount, setDiscount] = useState(0); // new state for discount
  useEffect(() => {
    const loadCart = async () => {
      await fetchCartItems();
      setLoading(false);
    };
    loadCart();
  }, []);

  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce((acc, item) => acc + item.foodId.price * item.quantity, 0)
    : 0;

  const finalTotal = Math.max(totalPrice - discount, 0); // ensure not negative

  const handleRemove = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this item from the cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    await removeFromCart(id);
    setActionLoading(false);

    Swal.fire("Removed!", "The item has been removed from your cart.", "success");
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    // setActionLoading(true);
    await updateItemQuantity(id, quantity);
    // setActionLoading(false);
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear the cart?",
      text: "Do you want to clear all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, clear it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await clearCart();

        Swal.fire({
          title: "Cleared!",
          text: "Your cart has been emptied.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Error clearing cart:", error);
        Swal.fire("Error", "Failed to clear the cart.", "error");
      }
    }
  };


  const handleApplyCoupon = () => {
    if (coupon.trim()) {
      if (discount > 0) {
        toast.error("Coupon already applied");
        setCoupon("");
        return;
      }

      if (coupon === "ANKIT100") {
        setDiscount(100);
        setAppliedCoupon("ANKIT100");
        toast.success("ANKIT100 applied! ₹100 off");
        setCoupon("");
      } else if (coupon === "FOOD50") {
        const discountAmount = Math.min(totalPrice * 0.5, 200);
        setDiscount(discountAmount);
        setAppliedCoupon("FOOD50");
        toast.success(`FOOD50 applied! 50% off (Saved ₹${discountAmount})`);
        setCoupon("");
      } else {
        toast.error("❌ Invalid coupon code");
      }
    } else {
      toast.error("Enter a valid code");
    }
  };


  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };


  const estimatedTime = new Date(Date.now() + 30 * 60 * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="px-4 sm:px-8 py-6 text-black dark:text-white min-h-screen">
      {(loading || actionLoading) && <Loader />}
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#FF5722] to-[#FFD54F] flex items-center justify-center gap-2">
          <Lottie animationData={shoppingCartAnim} className="h-12 w-12" loop autoplay />
          Your Cart
          <span className="text-lg font-semibold ml-2 text-gray-700 dark:text-gray-300">
            ({cartItems.length} items)
          </span>
        </h2>

        {/* Cart Body */}
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
              <p className="text-xl font-semibold text-[#FF5722] mb-4">Your cart is empty!</p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-white font-semibold rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-transform"
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
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                {Array.isArray(cartItems) &&
                  cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item.foodId._id}
                      className="flex flex-col sm:flex-row justify-between items-center bg-white/80 dark:bg-[#1E1E1E] backdrop-blur-lg border border-gray-200 dark:border-[#2A2A2A] rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <img
                          src={item.foodId.image}
                          alt={item.foodId.name}
                          className="h-20 w-20 object-cover rounded-xl border-2 border-[#FFD54F]"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-[#FF5722]">{item.foodId.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ₹{item.foodId.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 sm:mt-0">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.foodId._id, item.quantity - 1)}
                          className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] hover:bg-red-500 hover:text-white transition"
                          disabled={actionLoading}
                        >
                          <Minus size={16} />
                        </motion.button>
                        <span className="px-3 text-lg font-semibold">{item.quantity}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleQuantityChange(item.foodId._id, item.quantity + 1)}
                          className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] hover:bg-[#FFD54F] transition"
                          disabled={actionLoading}
                        >
                          <Plus size={16} />
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemove(item.foodId._id)}
                          className="p-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] text-red-500 hover:bg-red-600 hover:text-white transition"
                          disabled={actionLoading}
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </div>

              {/* Summary Section */}
              <div className="w-full lg:w-1/3 lg:sticky lg:top-8 h-fit bg-white/80 dark:bg-[#1E1E1E] backdrop-blur-lg border border-gray-200 dark:border-[#2A2A2A] rounded-2xl p-6 shadow-lg space-y-6">
                <div className="text-center lg:text-left space-y-1">
                  <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#FF5722] to-[#FFD54F]">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🚚 Estimated delivery by{" "}
                    <span className="text-[#FFD54F] font-medium">{estimatedTime}</span>
                  </p>
                </div>

                {/* Coupon Input */}
                <div className="flex items-center gap-2 w-full">
                  {/* Coupon Input */}
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-[60%] md:w-full flex-grow min-w-0 px-4 py-2 rounded-full border border-gray-300 dark:border-[#2A2A2A] dark:bg-[#1A1A1A]"
                  />

                  {/* Apply Button */}
                  {!appliedCoupon && (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-[#FFD54F] text-black rounded-full flex items-center gap-1 hover:opacity-90 transition whitespace-nowrap"
                    >
                      <Tag size={16} /> Apply
                    </button>
                  )}

                  {/* Remove Button (only when coupon applied) */}
                  {appliedCoupon && (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 bg-[#FFD54F] text-black rounded-full flex items-center gap-1 hover:opacity-90 transition whitespace-nowrap"
                    > <Tag size={16} /> Remove
                    </button>
                  )}
                </div>



                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Link
                    to="/checkout"
                    onClick={() => toast.success("Proceeding to checkout...")}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#FFD54F] to-[#FF5722] text-white font-semibold rounded-full shadow-md hover:scale-105 transition-transform"
                  >
                    <CreditCard size={18} /> Checkout
                  </Link>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-gray-200 dark:bg-[#2A2A2A] text-black dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                    >
                      <ArrowLeft size={18} /> Back
                    </Link>

                    <button
                      onClick={handleClearCart}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2 bg-gray-200 dark:bg-[#2A2A2A] text-black dark:text-white rounded-full hover:bg-red-500 hover:text-white transition"
                      disabled={actionLoading}
                    >
                      <Trash2 size={18} /> Clear
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Cart;
