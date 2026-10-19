// src/pages/TrackOrderPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "../utils/axiosInstance";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  RotateCw,
  ShoppingBag,
  AlertCircle,
  Package,
  Receipt,
  Utensils,
  Truck,
  HelpCircle,
} from "lucide-react";
import Loader from "../components/Loader";
import { showToast } from "../utils/showToast.jsx";

// Standard Real-World Order Steps
const ORDER_STEPS = [
  {
    key: "Confirmed",
    label: "Order Confirmed",
    desc: "We have received your order",
    icon: Receipt,
  },
  {
    key: "Preparing",
    label: "Preparing",
    desc: "Kitchen is preparing your food",
    icon: Utensils,
  },
  {
    key: "Out for Delivery",
    label: "Out for Delivery",
    desc: "Delivery partner is on the way",
    icon: Truck,
  },
  {
    key: "Delivered",
    label: "Delivered",
    desc: "Delivered to your address",
    icon: CheckCircle2,
  },
];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch order data
  const fetchOrderData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      if (orderId) {
        const { data } = await axios.get(`/orders/${orderId}`);
        if (data.success && data.order) {
          setOrder(data.order);
        }
      } else {
        const { data } = await axios.get("/orders/user-orders", {
          params: { userId: user?._id },
        });
        const ordersList = data.orders || [];
        if (ordersList.length > 0) {
          setOrder(ordersList[0]);
        }
      }

      if (isManual) {
        showToast("Order status refreshed", "success");
      }
    } catch (error) {
      console.error("Track order error:", error);
      if (isManual) {
        showToast("Could not refresh order status", "error");
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

  // Determine active step index (0 to 3)
  const activeStepIndex = useMemo(() => {
    if (!order) return 0;
    const status = order.orderStatus || "Confirmed";
    switch (status) {
      case "Confirmed":
        return 0;
      case "Preparing":
        return 1;
      case "Out for Delivery":
        return 2;
      case "Delivered":
        return 3;
      case "Cancelled":
        return -1;
      default:
        return 0;
    }
  }, [order]);

  const isCancelled = order?.orderStatus === "Cancelled";
  const isDelivered = order?.orderStatus === "Delivered";

  // Estimated delivery time (35 mins from order creation)
  const estimatedTime = useMemo(() => {
    if (!order?.createdAt) return "30–35 mins";
    const orderDate = new Date(order.createdAt);
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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-[#0c0c12]">
        <Loader />
      </div>
    );
  }

  // If no order exists
  if (!order) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14141e] shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            No Recent Orders Found
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-6">
            You don't have any active orders right now. Explore our menu to place an order.
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition shadow-sm cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Browse Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#0c0c12] text-neutral-900 dark:text-neutral-100 py-6 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ================= 1. TOP HEADER & NAVIGATION ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14141e] text-neutral-600 dark:text-neutral-300 hover:text-orange-500 hover:border-orange-500 transition-colors cursor-pointer"
              title="Back to all orders"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  Order Details
                </h1>
                <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <span>#{order._id?.slice(-8).toUpperCase()}</span>
                  <button
                    onClick={handleCopyId}
                    className="hover:text-orange-500 cursor-pointer p-0.5"
                    title="Copy Order ID"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => fetchOrderData(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#14141e] text-neutral-700 dark:text-neutral-300 hover:border-orange-500 transition-colors cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-orange-500" : ""}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              to="/orders"
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              All Orders
            </Link>
          </div>
        </div>

        {/* ================= 2. CANCELLED ALERT (IF CANCELLED) ================= */}
        {isCancelled && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <h4 className="font-bold text-sm">Order Cancelled</h4>
              <p>
                This order was cancelled. If your payment was deducted, it will be refunded to your original payment method.
              </p>
            </div>
          </div>
        )}

        {/* ================= 3. ORDER STATUS PROGRESS TRACKER ================= */}
        <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#14141e] p-5 sm:p-6 shadow-xs space-y-6">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-850">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Order Status
              </span>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                {isCancelled
                  ? "Order Cancelled"
                  : isDelivered
                  ? "Order Delivered"
                  : order.orderStatus === "Out for Delivery"
                  ? "Out for Delivery"
                  : order.orderStatus === "Preparing"
                  ? "Food is Being Prepared"
                  : "Order Confirmed"}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {isCancelled
                  ? "This order was cancelled."
                  : isDelivered
                  ? "Delivered successfully. Thank you for ordering with us!"
                  : order.orderStatus === "Out for Delivery"
                  ? "Your delivery partner is on the way to your address."
                  : order.orderStatus === "Preparing"
                  ? "The restaurant is preparing your food fresh."
                  : "The restaurant has received your order."}
              </p>
            </div>

            {/* Estimated Delivery Time */}
            {!isCancelled && !isDelivered && (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 self-start sm:self-auto">
                <Clock className="w-4 h-4 shrink-0" />
                <div className="text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[10px] uppercase font-semibold">
                    Estimated Delivery
                  </span>
                  <span className="font-bold">{estimatedTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Progress Bar */}
          {!isCancelled && (
            <div className="py-2">
              <div className="grid grid-cols-4 relative">
                {/* Connecting background line */}
                <div className="absolute top-4 left-6 right-6 h-1 bg-neutral-200 dark:bg-neutral-800 -z-0" />
                
                {/* Connecting active filled line */}
                <div
                  className="absolute top-4 left-6 h-1 bg-emerald-500 transition-all duration-500 -z-0"
                  style={{
                    width: `${Math.min(100, Math.max(0, (activeStepIndex / 3) * (100 - 15)))}%`,
                  }}
                />

                {ORDER_STEPS.map((step, idx) => {
                  const isCompleted = idx < activeStepIndex || isDelivered;
                  const isCurrent = idx === activeStepIndex && !isDelivered;
                  const Icon = step.icon;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10 px-1">
                      {/* Step Circle */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isCurrent
                            ? "bg-orange-500 text-white ring-4 ring-orange-500/20"
                            : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Icon className="w-4 h-4" />
                        )}
                      </div>

                      {/* Step Label */}
                      <p
                        className={`text-xs font-bold mt-2 truncate max-w-[85px] sm:max-w-none ${
                          isCompleted || isCurrent
                            ? "text-neutral-900 dark:text-white"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-neutral-400 hidden sm:block mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ================= 4. TWO-COLUMN DETAILS (ADDRESS & BILL) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          
          {/* Left Column: Delivery Address */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#14141e] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-850">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Delivery Address
              </h3>
            </div>

            <div className="text-xs space-y-1.5 text-neutral-600 dark:text-neutral-300">
              <p className="font-bold text-sm text-neutral-900 dark:text-white">
                {order.deliveryAddress?.fullName}
              </p>
              
              {order.deliveryAddress?.mobileNumber && (
                <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{order.deliveryAddress.mobileNumber}</span>
                </div>
              )}

              <p className="text-neutral-500 dark:text-neutral-400 pt-1 leading-relaxed">
                {[
                  order.deliveryAddress?.roomNumber,
                  order.deliveryAddress?.street,
                  order.deliveryAddress?.city,
                  order.deliveryAddress?.state,
                  order.deliveryAddress?.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          </div>

          {/* Right Column: Order Summary & Bill */}
          <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#14141e] p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-850">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-500 shrink-0" />
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Order Summary
                </h3>
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                {order.items?.length || 0} {order.items?.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-850 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pt-2 first:pt-0">
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-neutral-900 dark:text-white truncate">
                      {item.name || item.foodId?.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Qty: {item.quantity} × ₹{item.price || item.foodId?.price}
                    </p>
                  </div>
                  <span className="font-bold text-neutral-900 dark:text-white shrink-0">
                    ₹{((item.price || item.foodId?.price || 0) * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Bill Calculation */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-850 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Item Total</span>
                <span>₹{(order.cartTotal || 0).toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee !== undefined ? order.deliveryFee : 40}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{order.discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between pt-2 border-t border-neutral-100 dark:border-neutral-850 text-sm font-bold text-neutral-900 dark:text-white">
                <span>Total Amount</span>
                <span>₹{(order.totalAmount || 0).toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400">
                <span>Payment Status</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${
                  order.paymentStatus === "Paid"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-500/10 text-amber-500"
                }`}>
                  {order.paymentStatus || "Paid"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= 5. SIMPLE HELP SECTION ================= */}
        <div className="rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#14141e] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0" />
            <div>
              <p className="font-bold text-neutral-800 dark:text-neutral-200">
                Need help with this order?
              </p>
              <p className="text-neutral-400 text-[11px]">
                Have an issue with your items or delivery? Reach out to support.
              </p>
            </div>
          </div>
          <Link
            to="/orders"
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            View Order History
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TrackOrderPage;
