// src/pages/OrderSuccessPage.jsx
import { motion } from "framer-motion";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useMemo } from "react";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Clock,
  ChefHat,
  Bike,
  Receipt,
  Home,
  UtensilsCrossed,
  ShieldCheck,
  Navigation,
} from "lucide-react";

const OrderSuccessPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const orderId = location.state?.orderId;

  const estimatedDeliveryTime = useMemo(() => {
    const date = new Date(Date.now() + 32 * 60 * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const orderNumber = useMemo(() => {
    if (orderId) return `YUM-${orderId.slice(-6).toUpperCase()}`;
    return `YUM-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [orderId]);

  return (
    <div
      className={`min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`max-w-xl w-full rounded-3xl p-6 sm:p-8 border shadow-xl transition-all ${
          isDark
            ? "bg-[#161619] border-neutral-800"
            : "bg-white border-gray-200 shadow-slate-200/50"
        }`}
      >
        {/* ================= SUCCESS HEADER ================= */}
        <div className="text-center space-y-3">
          {/* Animated Success Icon */}
          <div className="relative inline-block">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1,
              }}
              className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5"
            >
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </motion.div>
          </div>

          <div className="space-y-1">
            <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Payment & Order Confirmed
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Thank You for Your Order!
            </h1>

            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 max-w-md mx-auto">
              Your order has been received and our kitchen has started preparing your food fresh.
            </p>
          </div>
        </div>

        {/* ================= ORDER TRACKING CARD ================= */}
        <div
          className={`mt-6 p-4 sm:p-5 rounded-2xl border space-y-4 ${
            isDark
              ? "bg-neutral-900/60 border-neutral-800"
              : "bg-gray-50/80 border-gray-200"
          }`}
        >
          {/* Order Ref & ETA */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-200/60 dark:border-neutral-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 block">
                Order Reference
              </span>
              <span className="text-sm font-bold text-primary-light dark:text-primary-dark">
                {orderNumber}
              </span>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 flex items-center sm:justify-end gap-1">
                <Clock size={11} /> Estimated Arrival
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                ~30-35 mins ({estimatedDeliveryTime})
              </span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 block mb-3">
              Live Order Progress
            </span>

            <div className="grid grid-cols-3 gap-2 text-center relative">
              {/* Step 1: Confirmed */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  ✓
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Confirmed
                </span>
              </div>

              {/* Step 2: Preparing (Active) */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-primary-light dark:bg-primary-dark text-white flex items-center justify-center shadow-md animate-pulse">
                  <ChefHat size={14} />
                </div>
                <span className="text-[11px] font-bold text-primary-light dark:text-primary-dark">
                  Cooking Now
                </span>
              </div>

              {/* Step 3: Out for Delivery */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 text-gray-400 dark:text-neutral-500 flex items-center justify-center">
                  <Bike size={14} />
                </div>
                <span className="text-[11px] font-medium text-gray-400 dark:text-neutral-500">
                  On The Way
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Support Note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
          <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
          <span>Need help with this order? Live support is always available.</span>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(orderId ? `/track-order/${orderId}` : "/track-order")
            }
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-bold bg-primary-light dark:bg-primary-dark text-white hover:opacity-95 shadow-md shadow-primary-light/20 transition cursor-pointer"
          >
            <Navigation size={16} />
            <span>Track Live Order</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/menu")}
            className={`w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
              isDark
                ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <UtensilsCrossed size={15} />
            <span>Explore More Food</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-700 dark:hover:text-neutral-200 transition"
          >
            <Home size={13} />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
