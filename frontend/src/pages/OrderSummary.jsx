import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { Tag, MapPin } from "lucide-react";

const OrderSummary = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/user-orders", {
          params: { userId: user?._id },
        });
        setOrders(data.orders);
      } catch (err) {
        console.error("Fetch orders error", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchOrders();
  }, [user]);

  if (loading) return <Loader />;

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen p-6 md:p-10 transition-colors duration-500
      ${isDark ? "bg-[#121212] text-[#EAEAEA]" : "bg-[#FAFAFA] text-[#1E1E1E]"}`}
    >
      <motion.h2
        className="text-4xl font-extrabold text-center mb-12
        text-[#FF5722]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        My Orders
      </motion.h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No orders found.
        </p>
      ) : (
        <div className="space-y-10 max-w-5xl mx-auto">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-3xl p-6 md:p-7 shadow-xl border
              ${
                isDark
                  ? "bg-[#1E1E1E] border-[#2A2A2A]"
                  : "bg-white border-gray-200"
              }`}
            >
              {/* ---------- HEADER ---------- */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Order ID
                  </p>
                  <p className="font-semibold break-all text-sm">
                    {order._id}
                  </p>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* ---------- ITEMS ---------- */}
              <div className="space-y-2 mb-6">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm md:text-base"
                  >
                    <span className="font-medium">
                      {item.foodId.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ₹{item.foodId.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* ---------- PRICE BREAKDOWN ---------- */}
              <div
                className={`rounded-2xl p-4 mb-6 border border-dashed
                ${isDark ? "border-[#2A2A2A]" : "border-gray-300"}`}
              >
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Subtotal</span>
                  <span>₹{order.cartTotal}</span>
                </div>

                {order.appliedCoupon && (
                  <div className="flex justify-between text-sm mt-1 text-[#4CAF50]">
                    <span className="flex items-center gap-1">
                      <Tag size={14} />
                      Coupon ({order.appliedCoupon.code})
                    </span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm mt-1 text-gray-400">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>

                <div className="flex justify-between font-extrabold text-lg mt-4 text-[#FF5722]">
                  <span>Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>

              {/* ---------- ADDRESS ---------- */}
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="mt-1 text-[#FFC107]" />
                <div>
                  <p className="font-semibold">
                    {order.deliveryAddress.fullName}
                  </p>
                  <p className="text-gray-400">
                    {order.deliveryAddress.roomNumber},{" "}
                    {order.deliveryAddress.street},{" "}
                    {order.deliveryAddress.city},{" "}
                    {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.pincode}
                  </p>
                  <p className="text-gray-400">
                    Mobile: {order.deliveryAddress.mobileNumber}
                  </p>
                </div>
              </div>

              {/* ---------- STATUS ---------- */}
              <div className="flex justify-end mt-6">
                <span
                  className="px-4 py-1 rounded-full text-xs font-semibold
                  bg-[#4CAF50]/20 text-[#4CAF50]"
                >
                  Paid
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
