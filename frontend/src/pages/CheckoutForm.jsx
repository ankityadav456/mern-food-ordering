// src/pages/CheckoutForm.jsx
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import AddressModal from "../components/AddressModal";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Pencil,
  Plus,
  ShieldCheck,
  Lock,
  Clock,
  AlertCircle,
  Sparkles,
  Check,
  Building2,
  Phone,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";
import { showToast } from "../utils/showToast.jsx";

const CheckoutForm = () => {
  const { cartItems = [], clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const stripe = useStripe();
  const elements = useElements();

  const { discount = 0, appliedCoupon = null } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(null);

  // Delivery preferences
  const [deliveryPreferences, setDeliveryPreferences] = useState({
    leaveAtDoor: false,
    noDoorbell: false,
    noCutlery: false,
  });

  // Sync address from user context if available
  useEffect(() => {
    if (user?.address && (user.address.street || user.address.city || user.address.roomNumber)) {
      setSelectedAddress(user.address);
    }
  }, [user]);

  const subtotal = totalPrice;
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const finalTotal = Math.max(subtotal - discount + deliveryFee, 0);

  const orderAmount = useMemo(() => {
    return Math.round(finalTotal * 100);
  }, [finalTotal]);

  // Fetch Stripe Payment Intent Client Secret
  useEffect(() => {
    if (!orderAmount || orderAmount <= 0) return;

    let isMounted = true;
    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post("/payment/create-payment-intent", {
          amount: orderAmount,
        });
        if (isMounted) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Payment intent error:", err);
          setErrorMessage("Failed to initialize secure payment. Please refresh or try again.");
        }
      }
    };

    fetchClientSecret();
    return () => {
      isMounted = false;
    };
  }, [orderAmount]);

  const CARD_OPTIONS = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "15px",
          color: isDark ? "#F4F4F5" : "#18181B",
          "::placeholder": {
            color: isDark ? "#71717A" : "#A1A1AA",
          },
          fontFamily: "Poppins, -apple-system, sans-serif",
          iconColor: isDark ? "#FF7043" : "#FF5722",
        },
        invalid: {
          color: "#EF4444",
          iconColor: "#EF4444",
        },
      },
    }),
    [isDark]
  );

  const handleAddressSaved = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    setEditAddress(null);
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    if (!selectedAddress) {
      Swal.fire({
        title: "Delivery Address Required",
        text: "Please add a delivery destination before completing your order.",
        icon: "warning",
        confirmButtonText: "Add Address",
        background: isDark ? "#18181b" : "#FFFFFF",
        color: isDark ? "#F4F4F5" : "#18181b",
        confirmButtonColor: "#FF5722",
        customClass: {
          popup: "rounded-2xl border border-gray-200 dark:border-neutral-800",
        },
      }).then((result) => {
        if (result.isConfirmed) setShowAddressModal(true);
      });
      return;
    }

    const { fullName, mobileNumber, roomNumber, street, city, state, pincode } = selectedAddress;
    if (!fullName || !mobileNumber || !roomNumber || !street || !city || !state || !pincode) {
      setErrorMessage("Please complete all delivery address fields.");
      return;
    }

    if (!stripe || !elements || !clientSecret || cartItems.length === 0) {
      setErrorMessage("Please ensure card details are entered before proceeding.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setErrorMessage(error.message || "Payment authorization failed. Please check your card.");
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const { data: orderRes } = await axios.post("/orders", {
          items: cartItems.map((item) => ({
            foodId: item.foodId._id,
            quantity: item.quantity,
            name: item.foodId.name,
            price: item.foodId.price,
          })),
          couponCode: appliedCoupon || null,
          deliveryFee: 40,
          deliveryAddress: selectedAddress,
        });

        clearCart();
        setClientSecret(null);
        showToast("Order placed successfully!", "success");
        navigate("/order-success", {
          state: { orderId: orderRes?.order?._id, order: orderRes?.order },
        });
      } else {
        setErrorMessage("Payment status was not completed. Please try again.");
      }
    } catch (err) {
      console.error("Order placement error:", err);
      setErrorMessage(
        err.response?.data?.message || "There was an error finalizing your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const estimatedDeliveryTime = useMemo(() => {
    const date = new Date(Date.now() + 32 * 60 * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  return (
    <div
      className={`min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= BREADCRUMBS & STEPPER HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1">
              <Link to="/menu" className="hover:text-primary-light transition">
                Menu
              </Link>
              <span>/</span>
              <Link to="/cart" className="hover:text-primary-light transition">
                Cart
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-neutral-200">Checkout</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Checkout & Payment
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span>Bag</span>
            </div>
            <span className="text-gray-300 dark:text-neutral-700">──</span>
            <div className="flex items-center gap-1.5 text-primary-light dark:text-primary-dark">
              <span className="w-5 h-5 rounded-full bg-primary-light dark:bg-primary-dark text-white flex items-center justify-center text-[10px] font-bold">
                2
              </span>
              <span>Address & Pay</span>
            </div>
            <span className="text-gray-300 dark:text-neutral-700">──</span>
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-neutral-600">
              <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-[10px] font-bold">
                3
              </span>
              <span>Done</span>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* ================= LEFT COLUMN: ADDRESS & PAYMENT (7 / 8 Cols) ================= */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              {/* 1. Delivery Address Section */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
                  isDark
                    ? "bg-[#161619] border-neutral-800"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Delivery Address</h2>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        Where should we deliver your freshly prepared food?
                      </p>
                    </div>
                  </div>

                  {selectedAddress && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditAddress(selectedAddress);
                        setShowAddressModal(true);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {selectedAddress ? (
                  <div
                    className={`p-4 rounded-xl border transition-all ${
                      isDark
                        ? "bg-neutral-900/70 border-neutral-800"
                        : "bg-gray-50/80 border-gray-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {selectedAddress.fullName || user?.name || "Default Address"}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Selected
                        </span>
                      </div>

                      {selectedAddress.mobileNumber && (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-neutral-400">
                          <Phone size={13} />
                          <span>{selectedAddress.mobileNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300 space-y-0.5">
                      <p>
                        {selectedAddress.roomNumber && (
                          <span className="font-semibold">
                            {selectedAddress.roomNumber},{" "}
                          </span>
                        )}
                        {selectedAddress.street}
                      </p>
                      <p className="text-gray-500 dark:text-neutral-400">
                        {[selectedAddress.city, selectedAddress.state]
                          .filter(Boolean)
                          .join(", ")}
                        {selectedAddress.pincode ? ` - ${selectedAddress.pincode}` : ""}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* No Address Selected -> Callout Card */
                  <div className="py-7 px-4 text-center rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                    <div className="w-11 h-11 mx-auto rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center mb-2.5">
                      <MapPin size={20} />
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      No Delivery Address Chosen
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                      Please enter a delivery destination so our courier knows where to arrive.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Delivery Address</span>
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Payment Method Section (Stripe) */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
                  isDark
                    ? "bg-[#161619] border-neutral-800"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <h2 className="text-base font-bold">Payment Method</h2>
                      <p className="text-xs text-gray-500 dark:text-neutral-400">
                        Safe 256-bit SSL encrypted card payment via Stripe
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500">
                    <Lock size={13} className="text-emerald-500" />
                    <span>Encrypted</span>
                  </div>
                </div>

                {/* Card Element Box */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block">
                    Credit / Debit Card Details
                  </label>

                  <div
                    className={`p-3.5 rounded-xl border transition-all ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800 focus-within:border-primary-dark focus-within:ring-1 focus-within:ring-primary-dark/30"
                        : "bg-gray-50 border-gray-200 focus-within:border-primary-light focus-within:ring-1 focus-within:ring-primary-light/30"
                    }`}
                  >
                    <CardElement options={CARD_OPTIONS} />
                  </div>

                  <p className="text-[11px] text-gray-400 dark:text-neutral-500 flex items-center gap-1.5 pt-1">
                    <ShieldCheck size={13} className="text-emerald-500 shrink-0" />
                    <span>Supports Visa, MasterCard, RuPay, Maestro & American Express</span>
                  </p>
                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* 3. Delivery Instructions & Preferences */}
              <div
                className={`rounded-2xl border p-5 space-y-3 transition-all ${
                  isDark
                    ? "bg-[#161619] border-neutral-800"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Delivery Preferences (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryPreferences((prev) => ({
                        ...prev,
                        leaveAtDoor: !prev.leaveAtDoor,
                      }))
                    }
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                      deliveryPreferences.leaveAtDoor
                        ? "bg-primary-light/10 border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark"
                        : isDark
                        ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>Leave at door</span>
                    {deliveryPreferences.leaveAtDoor && <Check size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryPreferences((prev) => ({
                        ...prev,
                        noDoorbell: !prev.noDoorbell,
                      }))
                    }
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                      deliveryPreferences.noDoorbell
                        ? "bg-primary-light/10 border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark"
                        : isDark
                        ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>Don't ring bell</span>
                    {deliveryPreferences.noDoorbell && <Check size={14} />}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliveryPreferences((prev) => ({
                        ...prev,
                        noCutlery: !prev.noCutlery,
                      }))
                    }
                    className={`p-3 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                      deliveryPreferences.noCutlery
                        ? "bg-primary-light/10 border-primary-light text-primary-light dark:border-primary-dark dark:text-primary-dark"
                        : isDark
                        ? "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>No plastic cutlery</span>
                    {deliveryPreferences.noCutlery && <Check size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* ================= RIGHT COLUMN: ORDER SUMMARY & BILL (5 / 4 Cols Sticky) ================= */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-20">
              {/* Order Items Review */}
              <div
                className={`rounded-2xl border p-5 space-y-4 transition-all ${
                  isDark
                    ? "bg-[#161619] border-neutral-800"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={16} className="text-primary-light dark:text-primary-dark" />
                    <h3 className="font-bold text-sm">Order Items</h3>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-neutral-400">
                    {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
                  </span>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-neutral-800/60">
                  {cartItems.map((item) => (
                    <div
                      key={item.foodId?._id}
                      className="flex items-center justify-between gap-3 pt-2.5 first:pt-0"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.foodId?.image && (
                          <img
                            src={item.foodId.image}
                            alt={item.foodId.name}
                            className="w-10 h-10 rounded-lg object-contain bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-0.5 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {item.foodId?.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                            Qty: {item.quantity} × ₹{item.foodId?.price}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                        ₹{(item.foodId?.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Delivery ETA pill */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-neutral-900 flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-neutral-400 flex items-center gap-1.5">
                    <Clock size={13} className="text-primary-light dark:text-primary-dark" />
                    <span>Estimated Arrival:</span>
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ~30-35 mins ({estimatedDeliveryTime})
                  </span>
                </div>
              </div>

              {/* Bill Summary & Pay Action */}
              <div
                className={`rounded-2xl border p-5 space-y-4 transition-all ${
                  isDark
                    ? "bg-[#161619] border-neutral-800"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <h3 className="font-bold text-sm pb-2 border-b border-gray-100 dark:border-neutral-800">
                  Payment Summary
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                    <span>Delivery Partner Fee</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ₹{deliveryFee}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>
                        Coupon {appliedCoupon ? `(${appliedCoupon})` : ""}
                      </span>
                      <span>-₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                    <span>Platform & Taxes</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      FREE
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm sm:text-base text-gray-900 dark:text-white block">
                        Total Amount
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-neutral-500">
                        Includes all applicable taxes
                      </span>
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-primary-light dark:text-primary-dark">
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 pt-2">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading || !clientSecret || !selectedAddress}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold bg-primary-light dark:bg-primary-dark text-white hover:opacity-95 shadow-md shadow-primary-light/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Authorizing & Placing Order...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Pay ₹{finalTotal.toLocaleString("en-IN")} & Place Order</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/cart"
                    className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isDark
                        ? "bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ArrowLeft size={13} />
                    <span>Return to Cart</span>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 dark:text-neutral-500 pt-1">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span>Stripe Secure Payment Gateway</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Checkout Fallback */
          <div
            className={`rounded-3xl border text-center py-16 px-6 max-w-xl mx-auto my-8 ${
              isDark
                ? "bg-[#161619] border-neutral-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center mb-3">
              <ShoppingCart size={28} />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-gray-500 dark:text-neutral-400 max-w-sm mx-auto mb-5">
              Add some of our delicious food items to your cart before proceeding to checkout.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 shadow-sm transition"
            >
              <span>Explore Menu</span>
            </Link>
          </div>
        )}
      </div>

      {/* Address Modal Popup */}
      <AnimatePresence>
        {showAddressModal && (
          <AddressModal
            onClose={() => {
              setShowAddressModal(false);
              setEditAddress(null);
            }}
            onAddressAdded={handleAddressSaved}
            initialAddress={editAddress}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutForm;
