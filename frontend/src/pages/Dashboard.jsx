import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, List, ChefHat, History } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

// All imports remain the same

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const avatarUrl = user?.avatar ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}` : "";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axiosInstance.get("/orders/user-orders", {
          params: { userId: user?._id },
        });
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchOrders();
    }
  }, [user]);

  const pendingOrders = orders.filter((o) => o.paymentStatus !== "Paid");
  const totalSpent = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-8 text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#D4AF37]"
          />
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            Welcome, <span className="text-[#D4AF37]">{user?.name || "User"}</span>
          </h1>
        </div>

        {/* Incomplete profile warning */}
        {!user?.address && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-100 dark:bg-[#2a1a1a] border-l-4 border-red-500 p-4 rounded-lg text-red-700 dark:text-red-300"
          >
            ⚠️ Your profile is incomplete.{" "}
            <Link to="/profile" className="underline text-[#D4AF37] font-medium">
              Update it now
            </Link>
          </motion.div>
        )}

        {/* Rewards banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#D4AF37] via-[#B22222] to-[#D4AF37] text-black py-4 px-6 rounded-xl shadow-lg border border-[#D4AF37] text-center font-semibold"
        >
          🎉 You've earned{" "}
          <span className="bg-black px-3 py-1 rounded-full text-[#D4AF37] inline-block mx-1">
            {orders.length * 50} YumPoints
          </span>{" "}
          from your orders!
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          {[
            { icon: <List size={28} />, label: "Browse Menu", to: "/menu" },
            { icon: <ShoppingCart size={28} />, label: "Your Cart", to: "/cart" },
            { icon: <History size={28} />, label: `Orders (${orders.length})`, to: "/orders" },
            ...(user?.isAdmin
              ? [{ icon: <ChefHat size={28} />, label: "Manage Food", to: "/food-management" }]
              : []),
          ].map((action, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2A2A2A] p-6 rounded-xl text-center hover:shadow-xl transition-all"
            >
              <Link to={action.to} className="flex flex-col items-center text-center">
                <div className="text-[#D4AF37] mb-2">{action.icon}</div>
                <span className="font-semibold text-black dark:text-white">
                  {action.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { label: "Total Orders", value: orders.length },
            { label: "YumPoints", value: orders.length * 50 },
            { label: "Pending Orders", value: pendingOrders.length },
            { label: "Total Spent", value: `₹${totalSpent}` },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-6 text-center shadow-md transition-colors duration-300"
            >
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</h4>
              <p className="text-2xl font-bold text-[#D4AF37]">{card.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Recent Orders</h2>

          {loading ? (
            <div className="text-gray-500 dark:text-gray-400">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2A2A2A] p-6 rounded-xl text-gray-600 dark:text-gray-300 text-sm">
              No orders yet.{" "}
              <Link to="/menu" className="text-[#D4AF37] underline">
                Start ordering now!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 6).map((order, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2A2A2A] rounded-xl p-5 shadow-md hover:shadow-xl transition-all cursor-pointer"
                 
                >
                  <h3 className="font-semibold text-lg mb-1">Order #{idx + 1}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Items: {order.items.length}
                  </p>
                  <p className="text-xl font-bold text-[#D4AF37] mb-1">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      order.paymentStatus === "Paid"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-[#D4AF37]">Recent Activity</h2>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>🛍️ Last order: {orders[0]?.createdAt ? new Date(orders[0].createdAt).toLocaleDateString() : "N/A"}</li>
            <li>🏆 Total YumPoints earned: {orders.length * 50}</li>
            <li>✏️ Profile updated recently</li>
          </ul>
        </motion.div>

        {/* Manage Profile CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/profile"
            className="inline-block bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#B22222] hover:text-white transition-all"
          >
            Manage Profile
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

