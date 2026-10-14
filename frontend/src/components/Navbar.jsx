import { useEffect, useState, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import GlobalSearch from "./GlobalSearch";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  ShoppingCart,
  Heart,
  X,
  Sun,
  Moon,
  Home,
  LayoutDashboard,
  UtensilsCrossed,
  User,
  LogOut,
  Shield,
  ShoppingBag,
  Navigation,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { SearchContext } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/Images/AppLogo.png";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { user, logout, openAuthModal } = useAuth();
  const { cartItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const avatarUrl = user?.avatar ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}` : "";
  const [scrolled, setScrolled] = useState(false);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (navMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [navMenuOpen]);

  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;
  const cartSubtotal = Array.isArray(cartItems)
    ? cartItems.reduce(
        (acc, item) =>
          acc + (Number(item.foodId?.price) || 0) * (Number(item.quantity) || 1),
        0
      )
    : 0;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isHome = location.pathname === "/";
  const isMenu = location.pathname === "/menu";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => e.preventDefault();

  const isDark = theme === "dark";

  // Desktop Nav Button
  const navButton = (to, icon, label) => {
    const active = isActive(to);
    return (
      <button
        key={to}
        onClick={() => {
          navigate(to);
          setNavMenuOpen(false);
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 cursor-pointer ${
          active
            ? "bg-primary-light dark:bg-primary-dark text-white shadow-md shadow-orange-500/25 font-semibold border border-orange-400/40"
            : "text-gray-700 dark:text-neutral-300 hover:text-black dark:hover:text-white border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700/70 hover:bg-black/5 dark:hover:bg-white/[0.06]"
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 rounded-b-2xl sm:rounded-b-3xl backdrop-blur-2xl backdrop-saturate-150 border-b ${
        scrolled
          ? "bg-[#fdfbf7]/85 dark:bg-[#09090d]/85 border-neutral-200/80 dark:border-white/[0.1] shadow-lg shadow-black/[0.04] dark:shadow-black/40"
          : "bg-[#fdfbf7]/60 dark:bg-[#09090d]/65 border-neutral-200/50 dark:border-white/[0.06] shadow-sm shadow-black/[0.02] dark:shadow-black/20"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 gap-4">
        {/* Left Section: Mobile Menu Button + Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setNavMenuOpen((p) => !p)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-200 lg:hidden hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            <Menu size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src={logo}
              alt="Yumigo Logo"
              className="h-10 w-10 rounded-full object-cover transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-primary-light to-amber-500 bg-clip-text text-transparent">
              Yumigo
            </span>
          </Link>
        </div>

        {/* Center Section: Global Search (Visible on /menu) */}
        {isMenu && (
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-2 sm:mx-4 hidden sm:block">
            <GlobalSearch query={searchQuery} setQuery={setSearchQuery} theme={theme} />
          </form>
        )}

        {/* Right Section: Nav Items, Theme, Cart, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1.5 mr-2">
            {navButton("/", <Home size={16} />, "Home")}
            {navButton("/menu", <UtensilsCrossed size={16} />, "Menu")}
            {user && navButton("/dashboard", <LayoutDashboard size={16} />, "Dashboard")}
          </div>

          {/* Theme Toggle Button (Desktop & Tablet) */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="hidden sm:flex w-9 h-9 rounded-full border border-neutral-200/90 dark:border-neutral-700/80 bg-white dark:bg-[#1a1a22] hover:bg-neutral-100 dark:hover:bg-[#242430] hover:border-neutral-300 dark:hover:border-neutral-600 text-gray-700 dark:text-neutral-200 transition-all duration-200 items-center justify-center flex-shrink-0 cursor-pointer shadow-sm shadow-black/[0.04] dark:shadow-black/40"
          >
            {isDark ? (
              <Sun size={17} className="text-amber-400" />
            ) : (
              <Moon size={17} className="text-gray-600" />
            )}
          </button>

          {/* Wishlist Icon Button (Desktop & Tablet) */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="hidden sm:flex relative w-9 h-9 rounded-full border border-neutral-200/90 dark:border-neutral-700/80 bg-white dark:bg-[#1a1a22] hover:bg-neutral-100 dark:hover:bg-[#242430] hover:border-neutral-300 dark:hover:border-neutral-600 text-gray-700 dark:text-neutral-200 transition-all duration-200 items-center justify-center flex-shrink-0 shadow-sm shadow-black/[0.04] dark:shadow-black/40"
          >
            <Heart
              size={17}
              className={
                wishlistCount > 0
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 dark:text-neutral-200"
              }
            />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md border border-white dark:border-neutral-900 pointer-events-none">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon Button */}
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative w-9 h-9 rounded-full border border-neutral-200/90 dark:border-neutral-700/80 bg-white dark:bg-[#1a1a22] hover:bg-neutral-100 dark:hover:bg-[#242430] hover:border-neutral-300 dark:hover:border-neutral-600 text-gray-700 dark:text-neutral-200 transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-sm shadow-black/[0.04] dark:shadow-black/40"
          >
            <ShoppingCart size={17} className="text-primary-light dark:text-primary-dark" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-primary-light dark:bg-primary-dark text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md border border-white dark:border-neutral-900 pointer-events-none">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User Profile / Auth Links */}
          {user ? (
            <div ref={userMenuRef} className="relative flex items-center">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User Profile"
                className="w-9 h-9 rounded-full border-2 border-orange-500/80 hover:border-orange-500 transition-all duration-200 cursor-pointer flex items-center justify-center overflow-hidden flex-shrink-0 p-0.5 bg-white dark:bg-[#1a1a22] shadow-sm shadow-orange-500/20"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary-light/10 text-primary-light flex items-center justify-center font-bold text-xs">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`absolute right-0 top-full mt-2.5 w-60 z-50 overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-2xl ${
                      isDark
                        ? "bg-[#161619]/95 border-neutral-800 text-white"
                        : "bg-white/95 border-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-white/[0.02]">
                      <p className="font-bold text-sm truncate text-gray-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      {user.isAdmin && (
                        <Link
                          to="/admin-dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark transition"
                        >
                          <Shield size={15} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark transition"
                      >
                        <LayoutDashboard size={15} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark transition"
                      >
                        <ShoppingBag size={15} />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark transition"
                      >
                        <Heart size={15} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} />
                        <span>My Wishlist ({wishlistCount})</span>
                      </Link>
                      <Link
                        to="/track-order"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark transition"
                      >
                        <Navigation size={15} />
                        <span>Track Live Order</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-700 dark:text-neutral-200 hover:bg-primary-light/10 hover:text-primary-light dark:hover:bg-primary-dark/15 dark:hover:text-primary-dark transition"
                      >
                        <User size={15} />
                        <span>Profile Settings</span>
                      </Link>
                    </div>

                    <div className="p-1.5 border-t border-gray-100 dark:border-neutral-800">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="px-3 sm:px-3.5 py-1.5 rounded-full bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 active:scale-95 transition shadow-sm cursor-pointer font-bold whitespace-nowrap"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => openAuthModal("signup")}
                className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full border border-gray-300 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer whitespace-nowrap"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation (Rendered in document.body via Portal to escape nav backdrop-filter) */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {navMenuOpen && (
              <>
                {/* Frosted Dark Backdrop Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setNavMenuOpen(false)}
                  className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9998] lg:hidden"
                />

                {/* Slide-out Drawer from Left */}
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 350, damping: 32 }}
                  className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] h-screen h-[100dvh] shadow-2xl z-[9999] lg:hidden flex flex-col border-r ${
                    isDark
                      ? "bg-[#141417] border-neutral-800 text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-neutral-800 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <img src={logo} alt="Yumigo Logo" className="h-9 w-9 rounded-full object-cover" />
                      <div>
                        <span className="font-extrabold text-lg bg-gradient-to-r from-primary-light to-amber-500 bg-clip-text text-transparent block leading-tight">
                          Yumigo
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                          Fresh & Fast Kitchen
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNavMenuOpen(false)}
                      aria-label="Close menu"
                      className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800/80 text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* User Identity Banner */}
                  <div className="p-4 border-b border-gray-100 dark:border-neutral-800/70 shrink-0">
                    {user ? (
                      <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-neutral-900/70 border border-gray-100 dark:border-neutral-800">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-primary-light/40 flex items-center justify-center bg-primary-light/10 text-primary-light font-bold text-sm">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name?.charAt(0)?.toUpperCase() || "U"
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs truncate text-gray-900 dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary-light/10 to-amber-500/10 border border-primary-light/20 space-y-2.5">
                        <div>
                          <p className="font-bold text-xs text-gray-900 dark:text-white">
                            Welcome to Yumigo!
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-neutral-400">
                            Sign in to track orders and save your address
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setNavMenuOpen(false);
                              openAuthModal("login");
                            }}
                            className="flex-1 py-1.5 px-3 rounded-xl text-center text-xs font-semibold border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer"
                          >
                            Log In
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNavMenuOpen(false);
                              openAuthModal("signup");
                            }}
                            className="flex-1 py-1.5 px-3 rounded-xl text-center text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm cursor-pointer"
                          >
                            Sign Up
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Items (Scrollable) */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Main Section */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 block mb-1.5">
                        Explore
                      </span>

                      {/* Home */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/");
                          setNavMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive("/")
                            ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                            : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Home size={17} />
                          <span>Home</span>
                        </div>
                        {isActive("/") && <div className="w-1.5 h-1.5 rounded-full bg-primary-light dark:bg-primary-dark" />}
                      </button>

                      {/* Menu */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/menu");
                          setNavMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive("/menu")
                            ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                            : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <UtensilsCrossed size={17} />
                          <span>Food Menu</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Fresh
                        </span>
                      </button>

                      {/* Cart */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/cart");
                          setNavMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive("/cart")
                            ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                            : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingCart size={17} />
                          <span>My Cart</span>
                        </div>
                        {cartCount > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light dark:bg-primary-dark text-white">
                            {cartCount} • ₹{cartSubtotal}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">Empty</span>
                        )}
                      </button>

                      {/* Wishlist */}
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/wishlist");
                          setNavMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive("/wishlist")
                            ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                            : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Heart size={17} className={wishlistCount > 0 ? "fill-red-500 text-red-500" : ""} />
                          <span>My Wishlist</span>
                        </div>
                        {wishlistCount > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
                            {wishlistCount}
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">Empty</span>
                        )}
                      </button>
                    </div>

                    {/* Account Section (if logged in) */}
                    {user && (
                      <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-neutral-800/60">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-neutral-500 px-3 block mb-1.5">
                          Account & Orders
                        </span>

                        {/* Orders */}
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/orders");
                            setNavMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isActive("/orders")
                              ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                              : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <ShoppingBag size={17} />
                            <span>My Orders</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>

                        {/* Track Live Order */}
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/track-order");
                            setNavMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isActive("/track-order")
                              ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                              : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Navigation size={17} className="text-primary-light dark:text-primary-dark" />
                            <span>Track Live Order</span>
                          </div>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        </button>

                        {/* Dashboard */}
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/dashboard");
                            setNavMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isActive("/dashboard")
                              ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                              : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <LayoutDashboard size={17} />
                            <span>Dashboard</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>

                        {/* Profile */}
                        <button
                          type="button"
                          onClick={() => {
                            navigate("/profile");
                            setNavMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isActive("/profile")
                              ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                              : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <User size={17} />
                            <span>Profile Settings</span>
                          </div>
                          <ChevronRight size={14} className="text-gray-400" />
                        </button>

                        {/* Admin Panel (if admin) */}
                        {user?.isAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              navigate("/admin-dashboard");
                              setNavMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                              isActive("/admin-dashboard")
                                ? "bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark font-bold"
                                : "text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800/60"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Shield size={17} />
                              <span>Admin Panel</span>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Drawer Bottom Actions */}
                  <div className="p-4 border-t border-gray-100 dark:border-neutral-800 space-y-2 bg-gray-50/50 dark:bg-neutral-900/30 shrink-0">
                    {/* Theme Toggle Button */}
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-semibold transition cursor-pointer"
                    >
                      <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300">
                        {isDark ? <Moon size={15} className="text-amber-400" /> : <Sun size={15} className="text-amber-500" />}
                        <span>Theme: {isDark ? "Dark Mode" : "Light Mode"}</span>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-primary-light dark:text-primary-dark">
                        Switch
                      </span>
                    </button>

                    {/* Sign Out Button (if logged in) */}
                    {user && (
                      <button
                        type="button"
                        onClick={() => {
                          setNavMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200 dark:border-red-900/30 transition cursor-pointer"
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  );
};

export default Navbar;
