import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import {
  ShoppingCart,
  UtensilsCrossed,
  Clock,
  User,
  AlertCircle,
  Award,
  Package,
  ArrowRight,
  Shield,
  Wallet,
  Sparkles,
  ChevronRight,
  Heart,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import CountUp from "react-countup";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { wishlistCount } = useWishlist();
  const isDark = theme === "dark";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const avatarUrl = user?.avatar
    ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
    : "";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
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
  const totalSpent = orders.reduce((acc, o) => acc + (Number(o.totalAmount) || 0), 0);
  const yumPoints = orders.length * 50;

  return (
    <div className={`min-h-screen pb-16 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
    }`}>
      {loading && <Loader />}

      <div className="max-w-7xl mx-auto pt-6 space-y-6">
        {/* ================= PROFILE HERO CARD ================= */}
        <div
          className={`rounded-2xl border p-5 sm:p-7 transition-all ${
            isDark
              ? "bg-[#161619] border-neutral-800"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user?.name || "User"}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 ring-offset-white dark:ring-offset-[#161619]"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center font-bold text-2xl ring-2 ring-primary-light/40">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                {user?.isAdmin && (
                  <span
                    title="Administrator"
                    className="absolute -bottom-1 -right-1 p-1 bg-primary-light text-white rounded-full shadow-sm"
                  >
                    <Shield size={13} />
                  </span>
                )}
              </div>

              {/* User Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Welcome back,{" "}
                    <span className="text-primary-light dark:text-primary-dark">
                      {user?.name || "Foodie"}
                    </span>
                  </h1>
                  {user?.isAdmin && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
              <Link
                to="/profile"
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                  isDark
                    ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <User size={14} />
                <span>Edit Profile</span>
              </Link>

              <Link
                to="/menu"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm"
              >
                <UtensilsCrossed size={14} />
                <span>Order Food</span>
              </Link>
            </div>
          </div>

          {/* Incomplete Profile Alert */}
          {!user?.address?.mobileNumber && (
            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs bg-amber-500/10 border-l-4 border-l-amber-500 p-3 rounded-r-xl text-amber-700 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0" />
                <span>Your phone number and address are missing. Add them for smooth delivery.</span>
              </div>
              <Link
                to="/profile"
                className="font-bold underline text-primary-light dark:text-primary-dark whitespace-nowrap"
              >
                Complete Now
              </Link>
            </div>
          )}
        </div>

        {/* ================= STATS OVERVIEW ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Total Orders */}
          <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              isDark
                ? "bg-[#161619] border-neutral-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                Total Orders
              </span>
              <div className="p-2 rounded-xl bg-orange-500/10 text-primary-light dark:text-primary-dark">
                <Package size={18} />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-bold">
              <CountUp end={orders.length} duration={1} />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
              Lifetime placed orders
            </p>
          </div>

          {/* Total Spent */}
          <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              isDark
                ? "bg-[#161619] border-neutral-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                Total Spent
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Wallet size={18} />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              ₹<CountUp end={totalSpent} duration={1.2} separator="," />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
              Spent across all meals
            </p>
          </div>

          {/* YumPoints */}
          <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              isDark
                ? "bg-[#161619] border-neutral-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                YumPoints
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Award size={18} />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-bold text-amber-500">
              <CountUp end={yumPoints} duration={1.2} separator="," />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
              +50 pts per completed order
            </p>
          </div>

          {/* Pending Orders */}
          <div
            className={`rounded-2xl border p-4 sm:p-5 transition-all ${
              isDark
                ? "bg-[#161619] border-neutral-800"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                Pending Orders
              </span>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <Clock size={18} />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-bold text-blue-500">
              <CountUp end={pendingOrders.length} duration={0.8} />
            </div>
            <p className="text-[11px] text-gray-400 dark:text-neutral-500 mt-1">
              Awaiting confirmation/delivery
            </p>
          </div>
        </div>

        {/* ================= QUICK SHORTCUTS ================= */}
        <div>
          <h2 className="text-base font-bold mb-3 text-gray-800 dark:text-neutral-200">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                title: "Browse Menu",
                desc: "Explore tasty dishes",
                icon: UtensilsCrossed,
                to: "/menu",
                color: "text-orange-500 bg-orange-500/10",
              },
              {
                title: "Your Cart",
                desc: "Review selected items",
                icon: ShoppingCart,
                to: "/cart",
                color: "text-amber-500 bg-amber-500/10",
              },
              {
                title: "All Orders",
                desc: `${orders.length} orders placed`,
                icon: Package,
                to: "/orders",
                color: "text-emerald-500 bg-emerald-500/10",
              },
              {
                title: "My Wishlist",
                desc: `${wishlistCount} saved ${wishlistCount === 1 ? "dish" : "dishes"}`,
                icon: Heart,
                to: "/wishlist",
                color: "text-red-500 bg-red-500/10",
              },
              ...(user?.isAdmin
                ? [
                    {
                      title: "Manage Food",
                      desc: "Add or edit menu items",
                      icon: Shield,
                      to: "/food-management",
                      color: "text-purple-500 bg-purple-500/10",
                    },
                  ]
                : [
                    {
                      title: "Manage Profile",
                      desc: "Update account info",
                      icon: User,
                      to: "/profile",
                      color: "text-blue-500 bg-blue-500/10",
                    },
                  ]),
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.to}
                  className={`p-4 rounded-2xl border transition-all duration-200 group hover:-translate-y-0.5 ${
                    isDark
                      ? "bg-[#161619] border-neutral-800 hover:border-neutral-700"
                      : "bg-white border-gray-200 hover:border-gray-300 shadow-sm"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${action.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors">
                    {action.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                    {action.desc}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= RECENT ORDERS ================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 dark:text-neutral-200">
              Recent Orders
            </h2>
            {orders.length > 0 && (
              <Link
                to="/orders"
                className="text-xs font-semibold text-primary-light dark:text-primary-dark hover:underline flex items-center gap-1"
              >
                <span>View All ({orders.length})</span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div
              className={`p-8 text-center rounded-2xl border ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-300"
                  : "bg-white border-gray-200 text-gray-700 shadow-sm"
              }`}
            >
              <Package size={32} className="mx-auto text-gray-400 mb-2 opacity-60" />
              <h3 className="font-bold text-sm">No orders yet</h3>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                Hungry? Discover mouth-watering pizzas, burgers, biryanis and more on our menu.
              </p>
              <Link
                to="/menu"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm"
              >
                <span>Explore Menu</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.slice(0, 6).map((order, idx) => (
                <div
                  key={order._id || idx}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between gap-3 ${
                    isDark
                      ? "bg-[#161619] border-neutral-800"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Order #{orders.length - idx}
                      </span>
                      <p className="text-[11px] text-gray-500 dark:text-neutral-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-gray-600 dark:text-neutral-300">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {order.items?.length || 0}
                    </span>{" "}
                    {order.items?.length === 1 ? "dish" : "dishes"}
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-medium block">Total</span>
                      <span className="text-base font-bold text-primary-light dark:text-primary-dark">
                        ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <Link
                      to="/orders"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
