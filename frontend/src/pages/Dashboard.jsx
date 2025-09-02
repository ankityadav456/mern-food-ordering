import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, List, ChefHat, History, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import CountUp from "react-countup";

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
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-8 text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen"
      >
        {/* Header */}
        <div className="flex items-center gap-5 mb-12">
          <motion.img
            src={avatarUrl}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover border-1.5 border-transparent 
                      bg-gradient-to-tr from-[#FF5722] via-[#FFD54F] to-[#FF5722] p-[2px] shadow-lg"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1, rotate: 2 }}
  whileTap={{ scale: 0.95 }}

            transition={{ delay: 0.2 }}
          />
          <h1 className="text-4xl font-extrabold">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-[#FF5722] to-[#FFD54F] bg-clip-text text-transparent">
              {user?.name || "Yumigo User"}
            </span>
          </h1>
        </div>

        {/* Incomplete profile warning */}
        {!user?.address?.mobileNumber && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 bg-red-100/80 dark:bg-[#2a1a1a] border border-red-500/40 
                       backdrop-blur-md p-5 rounded-xl text-red-700 dark:text-red-300 shadow-md"
          >
            ⚠️ Your profile is incomplete.{" "}
            <Link to="/profile" className="underline text-[#FF5722] font-medium">
              Update now
            </Link>
          </motion.div>
        )}

        {/* Rewards Banner */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative bg-gradient-to-r from-[#FF5722] via-[#FFD54F] to-[#FF5722] 
                     text-black py-6 px-8 rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl"></div>
          <p className="relative text-lg font-bold text-center">
            🎉 You've earned{" "}
            <span className="bg-black px-4 py-1 rounded-full text-[#FFD54F] inline-block mx-1 shadow-md">
              {orders.length * 50} YumPoints
            </span>{" "}
            so far!
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12"
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
              whileHover={{ scale: 1.08, rotate: 1 }}
              className="group bg-white/60 dark:bg-[#1a1a1a]/60 border border-gray-200 
                         dark:border-[#2A2A2A] p-6 rounded-2xl backdrop-blur-md 
                         shadow-md hover:shadow-2xl transition-all cursor-pointer"
            >
              <Link to={action.to} className="flex flex-col items-center gap-2">
                <div className="text-[#FF5722] group-hover:scale-125 transition-transform">
                  {action.icon}
                </div>
                <span className="font-semibold">{action.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
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
            { label: "Total Spent", value: totalSpent },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white/70 dark:bg-[#1a1a1a]/70 border border-gray-200 
                         dark:border-[#2A2A2A] rounded-2xl p-6 text-center 
                         backdrop-blur-md shadow-md"
            >
              <h4 className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.label}</h4>
              <p className="text-3xl font-extrabold text-[#FF5722]">
                <CountUp end={stat.value} duration={1.4} separator="," />
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#FF5722] to-[#FFD54F] bg-clip-text text-transparent">
            Recent Orders
          </h2>

          {loading ? (
            <div className="text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="bg-white/60 dark:bg-[#1a1a1a]/60 border border-gray-200 
                           dark:border-[#2A2A2A] p-6 rounded-2xl text-gray-600 dark:text-gray-300 text-sm">
              No orders yet.{" "}
              <Link to="/menu" className="text-[#FF5722] underline">
                Start ordering now!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.slice(0, 6).map((order, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03, translateY: -4 }}
                  className="bg-white dark:bg-[#1a1a1a] border border-gray-200 
                             dark:border-[#2A2A2A] rounded-2xl p-5 shadow-lg hover:shadow-2xl 
                             transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-lg mb-2">Order #{idx + 1}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {order.items.length} items
                  </p>
                  <p className="text-xl font-bold text-[#FF5722] mt-1">
                    ₹{order.totalAmount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <span
                    className={`mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium ${
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

        {/* Manage Profile CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 px-8 py-3 
                       bg-gradient-to-r from-[#FF5722] to-[#FFD54F] 
                       text-white font-semibold rounded-full shadow-lg 
                       hover:scale-105 hover:shadow-2xl transition-transform"
          >
            <User size={18} /> Manage Profile
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
