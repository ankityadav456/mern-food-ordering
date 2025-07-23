import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
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
  LogOut,
  UserRound,
  Sparkles,
} from "lucide-react";
import { SearchContext } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/Images/AppLogo.png";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ isDrawerMode, isZoomed, onNavigate }) => {
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
  const [loading, setLoading] = useState(false);
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
  const handleNavClick = () => {
    if (isDrawerMode) onNavigate?.();
    setNavMenuOpen(false);
  };

  const bgColor = theme === "dark" ? "bg-[#0d0d0d]" : "bg-[#FAF9F6]";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-[#D4AF37]";
  const textColor = theme === "dark" ? "text-white" : "text-[#333]";
  const gold = theme === "dark" ? "#D4AF37" : "#B8860B";

  // const glowStyle = theme === "dark" ? {
  //   boxShadow: "0 0 8px rgba(212, 175, 55, 0.3)",
  // } : {
  //   boxShadow: "0 0 4px rgba(184, 134, 11, 0.2)",
  // };

  //   const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   onSubmit(searchQuery);
  //   setTimeout(() => setLoading(false), 1000); // Simulate loading
  // };

  const handleClear = () => {
    setSearchQuery("");
  };

  const glowStyle = theme === "dark" ? {
    boxShadow: "0 0 8px rgba(212, 175, 55, 0.3)",
  } : {
    boxShadow: "0 0 4px rgba(184, 134, 11, 0.2)",
  };

  // const isActive = (path) => location.pathname === path || location.pathname.startsWith(path);
  const isActive = (path) => {
  if (path === "/") return location.pathname === "/";
  return location.pathname.startsWith(path);
};

  const navButton = (to, icon, label) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => { navigate(to); setNavMenuOpen(false); }}
      className={`flex items-center space-x-2 p-3 py-2 rounded-lg transition border ${borderColor} ${isActive(to)
        ? theme === "dark"
          ? "bg-[#edc337] text-black font-semibold"
          : "bg-[#d9ac3a] text-white font-semibold"
        : theme === "dark"
          ? "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black"
          : "bg-white text-black hover:bg-[#B8860B] hover:text-white"}`}
      style={glowStyle}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );

  return (
    <nav className={`fixed top-0 right-0 z-50 h-18 ${bgColor} border-b ${borderColor} transition-all duration-300 left-0 shadow-md`}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 py-2 gap-4 flex-nowrap">
        {/* Logo & Toggle on md and below */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setNavMenuOpen(prev => !prev)}
            className={`p-2 rounded-md border ${borderColor} transition lg:hidden`}
            style={{ color: gold, backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", ...glowStyle }}
          >
            <Menu size={24} />
          </motion.button>

          <motion.img
            src={logo}
            alt="Yumigo Logo"
            className="h-12 w-12 rounded-full hidden md:block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Search */}
         <form onSubmit={handleSearchSubmit} className="flex-1 mx-4 min-w-0">
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search food items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full py-2.5 pr-12 pl-12 rounded-full border text-sm md:text-base focus:outline-none focus:ring-2 transition
            ${theme === "dark"
              ? "bg-[#1A1A1A] text-white border-[#FFB300] placeholder-gray-400 focus:ring-[#FF5722]"
              : "bg-white text-black border-[#FFB300] placeholder-gray-500 focus:ring-[#FF5722]"}`}
          style={glowStyle}
        />

        {/* Search Icon */}
        <Search
          size={18}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
          style={{ color: "#FFB300" }}
        />

        {/* Right-side Icons: Loader or Clear */}
        {loading ? (
          <Loader2 className="animate-spin absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FF5722]" size={18} />
        ) : (
          searchQuery.length > 0 && (
            <X
              className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
              size={18}
              onClick={handleClear}
            />
          )
        )}
      </div>
    </form>

        {/* Large screen navigation */}
        <div className="hidden lg:flex items-center space-x-4 ml-auto">
          {navButton("/", <Home size={20} />, "Home")}
          {navButton("/menu", <Menu size={20} />, "Menu")}
          {user && navButton("/dashboard", <LayoutDashboard size={20} />, "Dashboard")}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${borderColor} transition`}
            style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", color: gold, ...glowStyle }}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </motion.button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4 ml-auto lg:ml-0">
          <Link to="/cart" className="relative">
            <motion.div whileHover={{ scale: 1.1 }} className={`p-2 rounded-full border ${borderColor}`} style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", ...glowStyle }}>
              <ShoppingCart size={24} style={{ color: gold }} />
            </motion.div>
            {cartItems?.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div ref={userMenuRef} className="relative">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-[2px] rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#B22222] to-[#D4AF37]"
              >
                <div className={`${theme === "dark" ? "bg-[#0d0d0d]" : "bg-white"} p-[2px] rounded-full`}>
                  <img src={avatarUrl} alt="User Avatar" className="h-10 w-10 rounded-full object-cover" />
                </div>
              </motion.button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-3 w-60 z-50 overflow-hidden rounded-xl shadow-xl border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white"}`}
                  >
                    <div className={`px-4 py-3 border-b ${borderColor}`}>
                      <p className={`${textColor} font-semibold`}>{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                    {user.isAdmin && (
                      <Link to="/admin-dashboard" className="block px-5 py-3 hover:bg-red-600 hover:text-white transition">Admin Panel</Link>
                    )}
                    <Link to="/dashboard" className="block px-5 py-3 hover:bg-red-600 hover:text-white transition">Dashboard</Link>
                    <Link to="/profile" className="block px-5 py-3 hover:bg-red-600 hover:text-white transition">Manage Profile</Link>
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

      {/* Drawer Menu */}
      <AnimatePresence>
        {navMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 right-0 w-72 h-full p-5 ${bgColor} border-l ${borderColor} shadow-2xl z-50 lg:hidden`}
            style={{ backdropFilter: 'blur(8px)', ...glowStyle }}
          >
            <div className="flex justify-between items-center mb-6">
              <img src={logo} alt="Yumigo Logo" className="h-10 w-10 rounded-full" />
              <button onClick={() => setNavMenuOpen(false)} className="text-red-600 hover:text-red-400 transition">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {navButton("/", <Home size={20} />, "Home")}
              {navButton("/menu", <Menu size={20} />, "Menu")}
              {user && navButton("/dashboard", <LayoutDashboard size={20} />, "Dashboard")}
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.1 }}
                onClick={toggleTheme}
                className={`w-14 mt-4 p-4 rounded-full border ${borderColor} transition`}
                style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", color: gold, ...glowStyle }}
              >
                {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
