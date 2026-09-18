// src/pages/TrackOrderPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "../utils/axiosInstance";
import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  ChefHat,
  Bike,
  Home,
  Copy,
  Check,
  ArrowLeft,
  RotateCw,
  ShoppingBag,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import Loader from "../components/Loader";
import { showToast } from "../utils/showToast.jsx";

const STATUS_STEPS = [
  {
    key: "Confirmed",
    title: "Order Confirmed",
    desc: "Payment verified & ticket received by kitchen",
    icon: CheckCircle2,
  },
  {
    key: "Preparing",
    title: "Kitchen Preparing",
    desc: "Chef is crafting your food with fresh ingredients",
    icon: ChefHat,
  },
  {
    key: "Out for Delivery",
    title: "Out for Delivery",
    desc: "Delivery hero is on the way to your location",
    icon: Bike,
  },
  {
    key: "Delivered",
    title: "Delivered",
    desc: "Package handed over. Enjoy your meal!",
    icon: Home,
  },
];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [allUserOrders, setAllUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Fetch specific order or latest order
  const fetchOrderData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      if (orderId) {
        // Fetch order by ID
        const { data } = await axios.get(`/orders/${orderId}`);
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } else {
        // No ID specified in URL -> fetch user's orders and pick the latest
        const { data } = await axios.get("/orders/user-orders", {
          params: { userId: user?._id },
        });

        const ordersList = data.orders || [];
        setAllUserOrders(ordersList);

        if (ordersList.length > 0) {
          setOrder(ordersList[0]);
        }
      }

      if (isManualRefresh) {
        showToast("Order status updated", "success");
      }
    } catch (error) {
      console.error("Track order error:", error);
      if (isManualRefresh) {
        showToast("Failed to refresh order", "error");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderData();
    }
  }, [orderId, user]);

  // Determine active step index
  const activeStepIndex = useMemo(() => {
    if (!order) return 1;
    const status = order.orderStatus || "Preparing";
    switch (status) {
      case "Confirmed":
        return 0;
      case "Preparing":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      default:
        return 1;
    }
  }, [order]);

  const estimatedDeliveryTime = useMemo(() => {
    if (!order) return "30-35 mins";
    const orderDate = new Date(order.createdAt || Date.now());
    const etaDate = new Date(orderDate.getTime() + 35 * 60 * 1000);
    return etaDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [order]);

  const handleCopyId = () => {
    if (!order?._id) return;
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    showToast("Order ID copied to clipboard", "info");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // If no order found
  if (!order) {
    return (
      <div
        className={`min-h-[80vh] flex items-center justify-center px-4 py-16 transition-colors ${
          isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
        }`}
      >
        <div
          className={`max-w-md w-full text-center p-8 rounded-3xl border shadow-xl ${
            isDark
              ? "bg-[#161619] border-neutral-800"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2">
            No Active Orders Found
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mb-6">
            You don't have any recent orders to track right now. Browse our menu to satisfy your food cravings!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 shadow-md transition"
          >
            <span>Explore Delicious Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  const isDelivered = order.orderStatus === "Delivered";

  return (
    <div
      className={`min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================= TOP BREADCRUMBS & ACTIONS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1">
              <Link to="/dashboard" className="hover:text-primary-light transition">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/orders" className="hover:text-primary-light transition">
                Orders
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-neutral-200">Live Tracker</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Track Order
              </h1>
              <span
                className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                  isDelivered
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark border-primary-light/20"
                }`}
              >
                {order.orderStatus || "In Progress"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => fetchOrderData(true)}
              disabled={refreshing}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <RotateCw
                size={13}
                className={refreshing ? "animate-spin text-primary-light" : ""}
              />
              <span>Refresh Status</span>
            </button>

            <Link
              to="/orders"
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <ArrowLeft size={13} />
              <span>All Orders</span>
            </Link>
          </div>
        </div>

        {/* ================= MAIN TRACKER GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 7 / 8 COLS: SIMULATED MAP & STEPPER */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* 1. Live Map Simulation Card */}
            <div
              className={`relative rounded-3xl overflow-hidden border transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-md"
              }`}
            >
              {/* Map Graphic Canvas */}
              <div className="relative h-64 sm:h-72 w-full bg-gradient-to-br from-slate-100 via-stone-50 to-orange-50/40 dark:from-[#111114] dark:via-[#16161a] dark:to-[#1e1510] overflow-hidden flex items-center justify-center p-6">
                {/* Stylized Grid Roads Background */}
                <div
                  className="absolute inset-0 opacity-[0.07] dark:opacity-[0.12] pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(${
                      isDark ? "#ffffff" : "#000000"
                    } 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Animated Simulated Route Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 120 180 Q 280 80 460 140 T 700 130"
                    fill="none"
                    stroke={isDark ? "#FF7043" : "#FF5722"}
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    className="opacity-70 animate-pulse"
                  />
                </svg>

                {/* Restaurant Pin */}
                <div className="absolute left-8 sm:left-14 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center ring-4 ring-amber-500/20">
                    <ChefHat size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-sm shadow">
                    Kitchen
                  </span>
                </div>

                {/* Moving Courier Partner Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-primary-light/30 dark:bg-primary-dark/30 animate-ping" />
                    <div className="w-12 h-12 rounded-2xl bg-primary-light dark:bg-primary-dark text-white shadow-xl shadow-primary-light/40 flex items-center justify-center ring-4 ring-primary-light/20 relative z-10">
                      <Bike size={24} />
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-light dark:bg-primary-dark text-white shadow">
                      On Route • 2.1 km
                    </span>
                  </div>
                </div>

                {/* Customer Address Destination Pin */}
                <div className="absolute right-8 sm:right-14 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 z-10">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 flex items-center justify-center ring-4 ring-emerald-500/20">
                    <MapPin size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/70 text-white backdrop-blur-sm shadow">
                    Your Home
                  </span>
                </div>

                {/* Floating ETA Badge on Top */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-md border border-gray-200/60 dark:border-neutral-800 shadow-sm flex items-center gap-2 pointer-events-auto">
                    <Clock size={14} className="text-primary-light dark:text-primary-dark" />
                    <div className="text-xs">
                      <span className="text-gray-500 dark:text-neutral-400">Arriving by: </span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {estimatedDeliveryTime}
                      </span>
                    </div>
                  </div>

                  <div className="px-2.5 py-1 rounded-xl bg-emerald-500/90 text-white backdrop-blur-md shadow-sm text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>Live GPS Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Order Milestones Stepper Card */}
            <div
              className={`rounded-2xl border p-5 sm:p-6 space-y-5 transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                <h3 className="font-bold text-base">Order Progress</h3>
                <span className="text-xs text-gray-500 dark:text-neutral-400">
                  Step {activeStepIndex + 1} of 4
                </span>
              </div>

              {/* Stepper Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-neutral-800">
                {STATUS_STEPS.map((step, idx) => {
                  const isPassed = idx < activeStepIndex;
                  const isCurrent = idx === activeStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="relative flex items-start gap-4">
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isPassed
                            ? "bg-emerald-500 text-white ring-4 ring-emerald-500/15"
                            : isCurrent
                            ? "bg-primary-light dark:bg-primary-dark text-white ring-4 ring-primary-light/20 animate-pulse"
                            : "bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600"
                        }`}
                      >
                        {isPassed ? <Check size={13} /> : idx + 1}
                      </div>

                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isCurrent
                                ? "text-primary-light dark:text-primary-dark"
                                : isPassed
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-400 dark:text-neutral-500"
                            }`}
                          >
                            {step.title}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-extrabold px-2 py-0.2 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Assigned Delivery Partner Card */}
            <div
              className={`rounded-2xl border p-5 transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 mb-3.5">
                Delivery Partner Details
              </h4>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center font-bold text-lg shadow">
                    R
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                        Rahul Kumar
                      </h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        ★ 4.9 (620+ trips)
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                      Hero Electric Scooter • Verified Courier
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:9876543210"
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-sm"
                  >
                    <Phone size={13} />
                    <span>Call Rider</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      showToast("Connected to live rider chat", "info")
                    }
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                      isDark
                        ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <MessageSquare size={13} />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 / 4 COLS: ORDER RECEIPT & DESTINATION */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-20">
            {/* Order Reference Box */}
            <div
              className={`rounded-2xl border p-5 space-y-3.5 transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 block">
                    Order ID
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                      #{order._id?.slice(-8).toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      title="Copy full ID"
                      className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-white transition cursor-pointer"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 block">
                    Placed On
                  </span>
                  <span className="text-xs text-gray-600 dark:text-neutral-300 font-medium">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              {/* Delivery Destination */}
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 block mb-1.5">
                  Delivering To
                </span>
                <div className="flex items-start gap-2.5 text-xs text-gray-600 dark:text-neutral-300">
                  <MapPin size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.deliveryAddress?.fullName}
                      {order.deliveryAddress?.mobileNumber && (
                        <span className="font-normal text-gray-500 dark:text-neutral-400 ml-1.5">
                          ({order.deliveryAddress.mobileNumber})
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      {[
                        order.deliveryAddress?.roomNumber,
                        order.deliveryAddress?.street,
                        order.deliveryAddress?.city,
                        order.deliveryAddress?.pincode,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ordered Items List */}
            <div
              className={`rounded-2xl border p-5 space-y-4 transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h3 className="font-bold text-sm pb-2 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                <span>Items in Order</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400 font-normal">
                  {order.items?.length || 0} items
                </span>
              </h3>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-neutral-800/60">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 pt-2 first:pt-0 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {item.name || item.foodId?.name}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                        Qty: {item.quantity} × ₹{item.price || item.foodId?.price}
                      </p>
                    </div>

                    <span className="font-bold text-gray-900 dark:text-white shrink-0">
                      ₹{((item.price || item.foodId?.price || 0) * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="pt-3 border-t border-gray-200 dark:border-neutral-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                  <span>Item Total</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{order.cartTotal?.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                  <span>Delivery Partner Fee</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ₹{order.deliveryFee || 40}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white block">
                      Total Paid
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      ✓ Paid via Stripe
                    </span>
                  </div>
                  <span className="text-lg font-black text-primary-light dark:text-primary-dark">
                    ₹{order.totalAmount?.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Need Help Action */}
              <button
                type="button"
                onClick={() =>
                  showToast("Live support ticket initiated. An agent will assist you shortly.", "info")
                }
                className={`w-full py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDark
                    ? "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                    : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <AlertCircle size={14} />
                <span>Need Help With This Order?</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderPage;
