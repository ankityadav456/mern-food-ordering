import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import GlobalSearch from "./GlobalSearch";
import { useAuth } from "../context/AuthContext";
import {
  Menu,
  Search,
  ShoppingCart,
  X,
  Sun,
  Moon,
  Home,
  LayoutDashboard,
} from "lucide-react";
import { SearchContext } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/Images/AppLogo.png";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const avatarUrl = user?.avatar ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}` : "";

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

  const bgColor = theme === "dark" ? "bg-[#0d0d0d]/90" : "bg-[#FAF9F6]/90";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-[#E6E6E6]";
  const textColor = theme === "dark" ? "text-white" : "text-[#333]";
  const gold = theme === "dark" ? "#FFB300" : "#FF5722";

  // detect active route
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // nav button
  const navButton = (to, icon, label, index = 0) => (
    <motion.button
      key={to}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.07 }}
      onClick={() => {
        navigate(to);
        setNavMenuOpen(false);
      }}
      className={`relative flex items-center gap-2 px-5 py-2 rounded-full font-medium text-sm md:text-base
        ${isActive(to)
          ? theme === "dark"
            ? "bg-gradient-to-r from-[#FFD700] to-[#FF9800] text-black shadow-lg"
            : "bg-gradient-to-r from-[#FFB300] to-[#FF5722] text-white shadow-lg"
          : theme === "dark"
            ? "bg-[#1A1A1A] text-white hover:bg-gradient-to-r hover:from-[#FFB300] hover:to-[#FF9800] hover:text-black hover:shadow-[0_0_12px_rgba(255,179,0,0.4)]"
            : "bg-white text-black border border-[#FFD54F] hover:bg-gradient-to-r hover:from-[#FFD54F] hover:to-[#FF9800] hover:text-black hover:shadow-[0_0_12px_rgba(255,152,0,0.4)]"
        }`}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${bgColor} backdrop-blur-lg`}>
      {/* glowing animated underline */}
      <div
        className="absolute bottom-0 left-0 w-full   opacity-50
             bg-gradient-to-r from-[#FF5722] via-[#FFD54F] to-[#FF5722] 
             bg-[length:200%_100%] bg-left animate-shimmer"
      />


      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 py-3 gap-4">

        {/* Left section (menu + logo) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.15 }}
            onClick={() => setNavMenuOpen((p) => !p)}
            className={`p-2 rounded-lg border ${borderColor} lg:hidden`}
            style={{ color: gold, backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff" }}
          >
            <Menu size={24} />
          </motion.button>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <img src={logo} alt="Yumigo Logo" className="h-12 w-12 rounded-full hidden md:block" />
            <h1 className="hidden md:block font-extrabold text-xl tracking-widest bg-gradient-to-r from-[#FF5722] to-[#FFD54F] bg-clip-text text-transparent">
              Yumigo
            </h1>
          </motion.div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 mx-4">
          <GlobalSearch query={searchQuery} setQuery={setSearchQuery} theme={theme} />
        </form>

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Large screen nav links */}
          <div className="hidden lg:flex items-center gap-3">
            {navButton("/", <Home size={18} />, "Home", 0)}
            {navButton("/menu", <Menu size={18} />, "Menu", 1)}
            {user && navButton("/dashboard", <LayoutDashboard size={18} />, "Dashboard", 2)}
          </div>
          {/* Theme toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ rotate: 15, scale: 1.1 }}
            onClick={toggleTheme}
            className={`p-2.5 rounded-full border ${borderColor} shadow-md hidden lg:block`}
            style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", color: gold }}
          >
            <motion.div
              key={theme}
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 14 }}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </motion.div>
          </motion.button>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <motion.div
              whileHover={{ scale: 1.15 }}
              className={`p-2.5 rounded-full border ${borderColor} shadow-md`}
              style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff" }}
            >
              <ShoppingCart size={20} style={{ color: gold }} />
            </motion.div>
            {cartItems?.length > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md"
              >
                {cartItems.length}
              </motion.span>
            )}
          </Link>

          {/* User menu */}
          {user ? (
            <div ref={userMenuRef} className="relative">
              <motion.button
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-[2px] rounded-full shadow-md bg-gradient-to-tr from-[#FF5722] via-[#FFD54F] to-[#FF5722]"
              >
                <div className={`${theme === "dark" ? "bg-[#0d0d0d]" : "bg-white"} p-[2px] rounded-full`}>
                  <img src={avatarUrl} alt="User Avatar" className="h-9 w-9 rounded-full object-cover" />
                </div>
              </motion.button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className={`absolute right-0 mt-3 w-60 overflow-hidden rounded-xl shadow-xl border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white"}`}
                  >
                    <div className={`px-4 py-3 border-b ${borderColor}`}>
                      <p className={`${textColor} font-semibold`}>{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                     {user.isAdmin && (
                      <Link to="/admin-dashboard" className="block px-5 py-3 hover:bg-gradient-to-r hover:from-[#FF5722] hover:to-[#FFD54F] hover:text-black transition">Admin Panel</Link>
                    )}
                    <Link to="/dashboard" className="block px-5 py-3 hover:bg-gradient-to-r hover:from-[#FF5722] hover:to-[#FFD54F] hover:text-black transition">Dashboard</Link>
                    <Link to="/profile" className="block px-5 py-3 hover:bg-gradient-to-r hover:from-[#FF5722] hover:to-[#FFD54F] hover:text-black transition">Manage Profile</Link>
                    <button onClick={logout} className="w-full text-left px-5 py-3 hover:bg-red-600 hover:text-white transition">Logout</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex space-x-3 text-sm font-medium">
              <Link to="/login" className={`${textColor} hover:text-[${gold}] transition`}>Login</Link>
              <Link to="/signup" className={`${textColor} hover:text-[${gold}] transition`}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      {/* Drawer menu */}
      <AnimatePresence>
        {navMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
            className={`fixed top-0 right-0 w-72 h-screen p-6 ${bgColor} border-l ${borderColor} shadow-2xl z-50 lg:hidden backdrop-blur-xl`}
          >
            {/* header */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <img src={logo} alt="Yumigo Logo" className="h-10 w-10 rounded-full border border-orange-500" />
                <span className={`font-semibold text-lg tracking-wide ${textColor}`}>Yumigo</span>
              </div>
              <button onClick={() => setNavMenuOpen(false)} className="text-red-600 hover:text-red-400 transition">
                <X size={26} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navButton("/", <Home size={20} />, "Home", 0)}
              {navButton("/menu", <Menu size={20} />, "Menu", 1)}
              {user && navButton("/dashboard", <LayoutDashboard size={20} />, "Dashboard", 2)}
            </div>

            <div className="mt-10">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={toggleTheme}
                className={`flex items-center justify-center gap-3 w-full py-3 rounded-xl border ${borderColor} shadow-md`}
                style={{ backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFF", color: gold }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-sm font-medium">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
