import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import {
  Tag,
  MapPin,
  ShoppingBag,
  Navigation,
  ArrowLeft,
  Calendar,
  CreditCard,
  ChefHat,
  Bike,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const OrderSummary = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/user-orders", {
          params: { userId: user?._id },
        });
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch orders error", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div
      className={`min-h-screen pb-20 pt-4 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ================= BREADCRUMBS & TOP NAV ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1">
              <Link to="/dashboard" className="hover:text-primary-light transition">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-neutral-200">My Orders</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Order History
              </h1>
              {orders.length > 0 && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </span>
              )}
            </div>
          </div>

          <Link
            to="/menu"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer self-start sm:self-auto ${
              isDark
                ? "bg-[#161619] border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <ArrowLeft size={14} />
            <span>Order Food Now</span>
          </Link>
        </div>

        {/* ================= ORDERS LIST ================= */}
        {orders.length === 0 ? (
          <div
            className={`text-center py-16 px-6 rounded-3xl border max-w-xl mx-auto my-8 ${
              isDark
                ? "bg-[#161619] border-neutral-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} />
            </div>
            <h2 className="text-xl font-bold tracking-tight mb-1">
              No Orders Found Yet
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
              You haven't placed any orders yet. Discover our fresh flavours and start your culinary journey today!
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-md"
            >
              <span>Explore Menu</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const status = order.orderStatus || "Preparing";
              const isDelivered = status === "Delivered";

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                    isDark
                      ? "bg-[#161619] border-neutral-800"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-neutral-800">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-neutral-500 uppercase font-bold tracking-wider">
                          Order
                        </span>
                        <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            isDelivered
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                              : "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark border-primary-light/20"
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1.5">
                        <Calendar size={12} />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </p>
                    </div>

                    {/* Track Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/track-order/${order._id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-95 transition shadow-sm cursor-pointer"
                      >
                        <Navigation size={13} />
                        <span>Track Live Status</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items & Breakdown Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                    {/* Items List (7 cols) */}
                    <div className="md:col-span-7 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                        Items Ordered ({order.items?.length || 0})
                      </h4>

                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1 divide-y divide-gray-100 dark:divide-neutral-800/60">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 pt-2 first:pt-0 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.foodId?.image && (
                                <img
                                  src={item.foodId.image}
                                  alt={item.name || item.foodId.name}
                                  className="w-9 h-9 rounded-lg object-contain bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-0.5 shrink-0"
                                />
                              )}
                              <div className="min-w-0">
                                <span className="font-semibold text-gray-900 dark:text-white truncate block">
                                  {item.name || item.foodId?.name}
                                </span>
                                <span className="text-[11px] text-gray-500 dark:text-neutral-400">
                                  Qty: {item.quantity} × ₹{item.price || item.foodId?.price}
                                </span>
                              </div>
                            </div>

                            <span className="font-bold text-gray-900 dark:text-white shrink-0">
                              ₹{((item.price || item.foodId?.price || 0) * item.quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address Pill */}
                      {order.deliveryAddress && (
                        <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 flex items-start gap-2 text-xs text-gray-600 dark:text-neutral-400">
                          <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                          <p className="leading-snug">
                            <strong className="text-gray-900 dark:text-white font-medium">
                              {order.deliveryAddress.fullName}:
                            </strong>{" "}
                            {[
                              order.deliveryAddress.roomNumber,
                              order.deliveryAddress.street,
                              order.deliveryAddress.city,
                              order.deliveryAddress.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bill Breakdown (5 cols) */}
                    <div
                      className={`md:col-span-5 p-4 rounded-xl border space-y-2 text-xs ${
                        isDark
                          ? "bg-neutral-900/60 border-neutral-800"
                          : "bg-gray-50/80 border-gray-200"
                      }`}
                    >
                      <h4 className="font-bold uppercase tracking-wider text-[10px] text-gray-400 dark:text-neutral-500 pb-1 border-b border-gray-200/50 dark:border-neutral-800">
                        Bill Summary
                      </h4>

                      <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                        <span>Items Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₹{order.cartTotal?.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 dark:text-neutral-400">
                        <span>Delivery Fee</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ₹{order.deliveryFee || 40}
                        </span>
                      </div>

                      {order.discount > 0 && (
                        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                          <span>
                            Coupon {order.appliedCoupon?.code ? `(${order.appliedCoupon.code})` : ""}
                          </span>
                          <span>-₹{order.discount?.toLocaleString("en-IN")}</span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">
                            Total Paid
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            ✓ {order.paymentStatus || "Paid"}
                          </span>
                        </div>
                        <span className="text-base font-black text-primary-light dark:text-primary-dark">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
