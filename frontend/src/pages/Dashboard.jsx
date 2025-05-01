import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, List, ChefHat, History } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 md:p-8 text-white min-h-screen bg-[#0d0d0d]"
    >
      {/* Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-4"
      >
        Welcome back,{" "}
        <span className="text-[#D4AF37]">{user?.name || "User"}!</span>
      </motion.h1>

      {/* Rewards Banner */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-[#D4AF37] via-[#B22222] to-[#D4AF37] text-black py-4 px-6 rounded-xl shadow-md border border-[#D4AF37] text-center font-semibold"
      >
        🎉 You’ve earned{" "}
        <span className="bg-black px-2 py-1 rounded-full text-[#D4AF37]">
          {orders.length * 50 || 0} YumPoints
        </span>{" "}
        from your orders! 🎁
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
          {
            icon: <List size={32} className="text-[#D4AF37] mb-2" />,
            label: "Browse Menu",
            to: "/menu",
          },
          {
            icon: <ShoppingCart size={32} className="text-[#D4AF37] mb-2" />,
            label: "View Cart",
            to: "/cart",
          },
          {
            icon: <History size={32} className="text-[#D4AF37] mb-2" />,
            label: `Orders (${orders.length})`,
            to: "/orders",
          },
          ...(user?.isAdmin
            ? [
                {
                  icon: <ChefHat size={32} className="text-[#D4AF37] mb-2" />,
                  label: "Manage Food",
                  to: "/food-management",
                },
              ]
            : []),
        ].map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-center hover:shadow-xl transition-all"
          >
            <Link to={action.to} className="flex flex-col items-center">
              {action.icon}
              <span className="text-white text-lg font-semibold mt-2">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#D4AF37]">Your Orders</h2>

        {loading ? (
          <div className="text-gray-400">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-gray-300 text-sm">
            You haven’t placed any orders yet. Start by exploring the{" "}
            <Link to="/menu" className="text-[#D4AF37] underline">
              menu
            </Link>
            !
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => navigate(`/order-summary/${order._id}`)}
              >
                <h3 className="text-lg font-semibold mb-2">Order #{idx + 1}</h3>
                <p className="text-sm text-gray-400 mb-2">Items: {order.items.length}</p>
                <p className="text-xl font-bold text-[#D4AF37] mb-2">₹{order.totalAmount}</p>
                <p className="text-sm text-gray-500">
                  Placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Manage Profile */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
      >
        <Link
          to="/profile"
          className="inline-block bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#B22222] hover:text-white transition-all"
        >
          Manage Profile
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
