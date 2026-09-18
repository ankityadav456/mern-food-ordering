import { useCart } from "../context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Tag,
  ShoppingCart,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Percent,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../utils/showToast.jsx";
import { useTheme } from "../context/ThemeContext";
import Lottie from "lottie-react";
import emptyCartAnim from "../assets/lottieIJson/Empty red.json";
import Swal from "sweetalert2";
import axios from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";

const AVAILABLE_COUPONS = [
  {
    code: "ANKIT100",
    discountText: "₹100 OFF",
    minOrder: 500,
    desc: "Valid on orders above ₹500",
  },
  {
    code: "YUMIGO50",
    discountText: "₹50 OFF",
    minOrder: 200,
    desc: "Valid on orders above ₹200",
  },
];

const Cart = () => {
  const {
    cartItems = [],
    fetchCartItems,
    removeFromCart,
    updateItemQuantity,
    clearCart,
  } = useCart();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [localQty, setLocalQty] = useState({});

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const navigate = useNavigate();

  const holdTimeoutRef = useRef(null);
  const holdIntervalRef = useRef(null);
  const holdActiveRef = useRef(false);
  const qtyRef = useRef({});

  useEffect(() => {
    const loadCart = async () => {
      await fetchCartItems();
      setLoading(false);
    };
    loadCart();
  }, [fetchCartItems]);

  useEffect(() => {
    return () => {
      clearTimeout(holdTimeoutRef.current);
      clearInterval(holdIntervalRef.current);
    };
  }, []);

  // Calculate items subtotal
  const totalPrice = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((acc, item) => {
      const price = Number(item.foodId?.price) || 0;
      const qty = Number(item.quantity) || 1;
      return acc + price * qty;
    }, 0);
  }, [cartItems]);

  const deliveryFee = totalPrice > 0 ? 40 : 0;
  const finalTotal = Math.max(totalPrice - discount + deliveryFee, 0);

  const handleRemove = async (id, itemName) => {
    const result = await Swal.fire({
      title: "Remove item?",
      text: `Do you want to remove "${itemName || "this item"}" from your cart?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Keep it",
      background: isDark ? "#18181b" : "#FFFFFF",
      color: isDark ? "#F4F4F5" : "#18181b",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: isDark ? "#27272a" : "#E4E4E7",
      customClass: {
        popup: "rounded-2xl border border-gray-200 dark:border-neutral-800",
      },
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    await removeFromCart(id);
    setActionLoading(false);
  };

  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    await updateItemQuantity(id, quantity, false);
  };

  const handleClearCart = async () => {
    const result = await Swal.fire({
      title: "Clear entire cart?",
      text: "All items in your cart will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, empty cart",
      cancelButtonText: "Cancel",
      background: isDark ? "#18181b" : "#FFFFFF",
      color: isDark ? "#F4F4F5" : "#18181b",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: isDark ? "#27272a" : "#E4E4E7",
      customClass: {
        popup: "rounded-2xl border border-gray-200 dark:border-neutral-800",
      },
    });

    if (result.isConfirmed) {
      try {
        await clearCart();
        setDiscount(0);
        setAppliedCoupon(null);
        setCoupon("");
        showToast("Cart cleared", "info");
      } catch (error) {
        console.error("Error clearing cart:", error);
        showToast("Failed to clear cart", "error");
      }
    }
  };

  // Hold to increment/decrement logic
  const startHold = (id, quantity, type) => {
    holdActiveRef.current = false;
    let currentQty = qtyRef.current[id] ?? quantity;

    holdTimeoutRef.current = setTimeout(() => {
      holdActiveRef.current = true;
      holdIntervalRef.current = setInterval(() => {
        currentQty =
          type === "inc" ? currentQty + 1 : Math.max(1, currentQty - 1);
        qtyRef.current[id] = currentQty;
        setLocalQty((prev) => ({ ...prev, [id]: currentQty }));
      }, 140);
    }, 280);
  };

  const stopHold = async (id, quantity, type) => {
    clearTimeout(holdTimeoutRef.current);
    clearInterval(holdIntervalRef.current);

    if (!holdActiveRef.current) {
      const newQty = type === "inc" ? quantity + 1 : Math.max(1, quantity - 1);
      await handleQuantityChange(id, newQty);
      return;
    }

    const finalQty = qtyRef.current[id];
    if (finalQty !== undefined) {
      await handleQuantityChange(id, finalQty);
    }
    delete qtyRef.current[id];
    setLocalQty((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    holdActiveRef.current = false;
  };

  const handleApplyCoupon = async (couponCodeToApply) => {
    const targetCode = (
      typeof couponCodeToApply === "string" ? couponCodeToApply : coupon
    )
      .trim()
      .toUpperCase();

    if (!targetCode) {
      showToast("Enter a coupon code", "error");
      return;
    }

    if (discount > 0 && appliedCoupon === targetCode) {
      showToast("This coupon is already applied", "info");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post("/coupons/apply", {
        userId: user?._id,
        code: targetCode,
        cartTotal: totalPrice,
      });

      if (data.success) {
        setDiscount(data.discount);
        setAppliedCoupon(data.appliedCoupon || targetCode);
        setCoupon(targetCode);
        showToast(data.message || `Saved ₹${data.discount}!`, "success");
      } else {
        showToast(data.message || "Could not apply coupon", "error");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Invalid or expired coupon code";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      if (user?._id) {
        await axios.post("/coupons/remove", { userId: user._id });
      }
    } catch (err) {
      console.error("Coupon remove error", err);
    }
    setCoupon("");
    setDiscount(0);
    setAppliedCoupon(null);
    showToast("Coupon removed", "info");
  };

  const estimatedDeliveryTime = useMemo(() => {
    const date = new Date(Date.now() + 32 * 60 * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const savedAddress = user?.address;
  const hasAddress = Boolean(
    savedAddress &&
      (savedAddress.street || savedAddress.city || savedAddress.roomNumber)
  );

  return (
    <div
      className={`min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      {(loading || actionLoading) && <Loader />}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= BREADCRUMBS & TOP NAV ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1">
              <Link to="/menu" className="hover:text-primary-light transition">
                Menu
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-neutral-200">Cart</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Order Cart
              </h1>
              {cartItems.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <ArrowLeft size={14} />
              <span>Continue Shopping</span>
            </Link>

            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={handleClearCart}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Empty Cart</span>
              </button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {cartItems.length === 0 ? (
            /* ================= EMPTY CART STATE ================= */
            <motion.div
              key="empty-cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`rounded-3xl border text-center py-16 px-6 max-w-2xl mx-auto my-8 ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="w-52 h-52 mx-auto mb-4 flex items-center justify-center">
                <Lottie
                  animationData={emptyCartAnim}
                  className="w-full h-full"
                  loop
                />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                Your cart is currently empty
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                Looks like you haven't added any delicious dishes to your order yet. Explore our freshly prepared menu and satisfy your cravings!
              </p>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 shadow-md transition-all cursor-pointer"
              >
                <ShoppingCart size={16} />
                <span>Explore Delicious Menu</span>
              </Link>
            </motion.div>
          ) : (
            /* ================= FILLED CART LAYOUT ================= */
            <motion.div
              key="filled-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* LEFT COLUMN: ITEMS LIST & DELIVERY INFO (8 Cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                {/* Cart Items Container */}
                <div
                  className={`rounded-2xl border p-4 sm:p-5 divide-y transition-all ${
                    isDark
                      ? "bg-[#161619] border-neutral-800 divide-neutral-800/80"
                      : "bg-white border-gray-200 divide-gray-100 shadow-sm"
                  }`}
                >
                  <div className="pb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                      Items In Your Bag
                    </span>
                    <span className="text-xs text-gray-500 dark:text-neutral-400">
                      Prices in INR (₹)
                    </span>
                  </div>

                  {cartItems.map((item) => {
                    const food = item.foodId || {};
                    const currentQty =
                      localQty[food._id] !== undefined
                        ? localQty[food._id]
                        : item.quantity;
                    const itemTotal = (Number(food.price) || 0) * currentQty;

                    return (
                      <motion.div
                        layout
                        key={food._id || Math.random()}
                        className="py-4 first:pt-3 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        {/* Food Image & Details */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shrink-0 p-1.5 flex items-center justify-center">
                            <img
                              src={food.image}
                              alt={food.name}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          </div>

                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              {food.category && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                                  {food.category}
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                              {food.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">
                              ₹{(Number(food.price) || 0).toLocaleString("en-IN")}{" "}
                              <span className="text-[11px] text-gray-400">/ item</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity Stepper & Price Calculation */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 pl-2 sm:pl-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-neutral-800">
                          {/* Stepper */}
                          <div
                            className={`flex items-center rounded-xl border p-1 ${
                              isDark
                                ? "bg-neutral-900 border-neutral-800"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onPointerDown={() =>
                                startHold(food._id, item.quantity, "dec")
                              }
                              onPointerUp={() =>
                                stopHold(food._id, item.quantity, "dec")
                              }
                              onPointerCancel={() =>
                                stopHold(food._id, item.quantity, "dec")
                              }
                              disabled={actionLoading || currentQty <= 1}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                            >
                              <Minus size={14} />
                            </button>

                            <span className="w-9 text-center font-bold text-sm">
                              {currentQty}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onPointerDown={() =>
                                startHold(food._id, item.quantity, "inc")
                              }
                              onPointerUp={() =>
                                stopHold(food._id, item.quantity, "inc")
                              }
                              onPointerCancel={() =>
                                stopHold(food._id, item.quantity, "inc")
                              }
                              disabled={actionLoading}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-neutral-300 hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark dark:hover:text-white transition cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-right min-w-[70px]">
                            <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                              ₹{itemTotal.toLocaleString("en-IN")}
                            </span>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemove(food._id, food.name)}
                            disabled={actionLoading}
                            title="Remove from cart"
                            aria-label={`Remove ${food.name}`}
                            className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Delivery Destination Preview Card */}
                <div
                  className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                    isDark
                      ? "bg-[#161619] border-neutral-800"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-0.5">
                          Delivery Destination
                        </h4>
                        {hasAddress ? (
                          <div className="text-xs sm:text-sm">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {savedAddress.fullName || user?.name || "Default Address"}
                              {savedAddress.mobileNumber && (
                                <span className="font-normal text-gray-500 dark:text-neutral-400 ml-2">
                                  ({savedAddress.mobileNumber})
                                </span>
                              )}
                            </p>
                            <p className="text-gray-500 dark:text-neutral-400 mt-0.5">
                              {[
                                savedAddress.roomNumber,
                                savedAddress.street,
                                savedAddress.city,
                                savedAddress.pincode,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        ) : (
                          <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-0.5">
                            <AlertCircle size={14} />
                            <span>
                              No delivery address saved yet. You can add it during checkout.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      className="text-xs font-semibold text-primary-light dark:text-primary-dark hover:underline shrink-0"
                    >
                      {hasAddress ? "Change" : "Add Address"}
                    </Link>
                  </div>
                </div>

                {/* Cooking / Delivery Instructions Note */}
                <div
                  className={`rounded-2xl border p-4 transition-all flex items-center gap-3 ${
                    isDark
                      ? "bg-[#161619]/60 border-neutral-800"
                      : "bg-white/80 border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark shrink-0">
                    <Truck size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      Fast contactless delivery
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Estimated delivery window: ~30-35 mins by{" "}
                      <span className="font-semibold text-gray-800 dark:text-neutral-200">
                        {estimatedDeliveryTime}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: BILL BREAKDOWN & COUPONS (5 / 4 Cols Sticky) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-20">
                {/* 1. Coupons & Offers Box */}
                <div
                  className={`rounded-2xl border p-5 space-y-3.5 transition-all ${
                    isDark
                      ? "bg-[#161619] border-neutral-800"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                      <Percent size={15} />
                    </div>
                    <h3 className="font-bold text-sm">Coupons & Offers</h3>
                  </div>

                  {/* Coupon Input Form */}
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 min-w-0">
                      <Tag
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium uppercase tracking-wider focus:outline-none focus:ring-2 transition ${
                          isDark
                            ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                        }`}
                      />
                    </div>

                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-900/40 transition cursor-pointer"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon()}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition cursor-pointer shrink-0"
                      >
                        Apply
                      </button>
                    )}
                  </div>

                  {/* Applied Success Badge */}
                  {appliedCoupon && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
                      <CheckCircle2 size={15} className="shrink-0" />
                      <span className="font-medium">
                        "{appliedCoupon}" applied! You saved ₹{discount}.
                      </span>
                    </div>
                  )}

                  {/* Quick-apply Chip Suggestions */}
                  {!appliedCoupon && (
                    <div className="pt-1 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500">
                        Available Promos
                      </span>
                      <div className="flex flex-col gap-2">
                        {AVAILABLE_COUPONS.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleApplyCoupon(c.code)}
                            className={`flex items-center justify-between p-2 rounded-xl border text-left transition cursor-pointer ${
                              isDark
                                ? "bg-neutral-900/60 border-neutral-800 hover:border-primary-dark/50"
                                : "bg-gray-50 border-gray-200 hover:border-primary-light/50"
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="font-bold text-xs text-primary-light dark:text-primary-dark">
                                {c.code}
                              </span>
                              <p className="text-[11px] text-gray-500 dark:text-neutral-400 truncate">
                                {c.desc}
                              </p>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                              {c.discountText}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Order Bill Details Card */}
                <div
                  className={`rounded-2xl border p-5 space-y-4 transition-all ${
                    isDark
                      ? "bg-[#161619] border-neutral-800"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <h3 className="font-bold text-sm pb-2 border-b border-gray-100 dark:border-neutral-800">
                    Bill Summary
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{totalPrice.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1">
                        <span>Standard Delivery Fee</span>
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ₹{deliveryFee}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Coupon Discount</span>
                        <span>-₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                      <span>Platform & Taxes</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        FREE
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white block">
                          Total Payable
                        </span>
                        <span className="text-[11px] text-gray-400 dark:text-neutral-500">
                          Inclusive of all taxes
                        </span>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-primary-light dark:text-primary-dark">
                        ₹{finalTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Primary Checkout CTA */}
                  <Link
                    to="/checkout"
                    state={{
                      discount,
                      appliedCoupon,
                      finalTotal,
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold bg-primary-light dark:bg-primary-dark text-white hover:opacity-95 shadow-md shadow-primary-light/20 transition-all cursor-pointer"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </Link>

                  {/* Security Assurance */}
                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-neutral-500 pt-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>100% Safe & Encrypted Checkout</span>
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
