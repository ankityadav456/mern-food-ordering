// Updated Navbar Component
import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Menu, Search, ShoppingCart, X, Sun, Moon, Home, LayoutDashboard } from "lucide-react";
import { SearchContext } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/Images/AppLogo.png";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = ({ isCollapsed, toggleSidebar, isSidebarVisible, isDrawerMode, isZoomed, onNavigate }) => {
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
  const handleNavClick = () => {
    if (isDrawerMode) onNavigate?.();
    setNavMenuOpen(false);
  };

  const bgColor = theme === "dark" ? "bg-[#0d0d0d]" : "bg-[#FAF9F6]";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-[#D4AF37]";
  const textColor = theme === "dark" ? "text-white" : "text-[#333]";
  const gold = theme === "dark" ? "#D4AF37" : "#B8860B";

  const navLinks = (
    <>
      <Link to="/" onClick={handleNavClick} className={`group flex items-center space-x-2 transition px-3 py-2 rounded-md ${location.pathname === "/" ? theme === "dark" ? "bg-[#D4AF37] text-black font-semibold" : "bg-[#B8860B] text-white font-semibold" : theme === "dark" ? "hover:bg-[#e6d18d] hover:text-white" : "hover:bg-[#d1b87a6f] hover:text-black"}`}>
        <Home size={18} className="transition-colors" color={location.pathname === "/" ? theme === "dark" ? "black" : "white" : gold} />
        <span>Home</span>
      </Link>

      <Link to="/menu" onClick={handleNavClick} className={`group flex items-center space-x-2 transition px-3 py-2 rounded-md ${location.pathname.startsWith("/menu") ? theme === "dark" ? "bg-[#D4AF37] text-black font-semibold" : "bg-[#B8860B] text-white font-semibold" : theme === "dark" ? "hover:bg-[#e6d18d] hover:text-white" : "hover:bg-[#d1b87a6f] hover:text-black"}`}>
        <Menu size={18} className="transition-colors group-hover:text-black" color={location.pathname.startsWith("/menu") ? theme === "dark" ? "black" : "white" : gold} />
        <span>Menu</span>
      </Link>

      {user && (
        <Link to="/dashboard" onClick={handleNavClick} className={`group flex items-center space-x-2 transition px-3 py-2 rounded-md ${location.pathname.startsWith("/dashboard") ? theme === "dark" ? "bg-[#D4AF37] text-black font-semibold" : "bg-[#B8860B] text-white font-semibold" : theme === "dark" ? "hover:bg-[#e6d18d] hover:text-white" : "hover:bg-[#d1b87a6f] hover:text-black"}`}>
          <LayoutDashboard size={18} className="transition-colors group-hover:text-black" color={location.pathname.startsWith("/dashboard") ? theme === "dark" ? "black" : "white" : gold} />
          <span>Dashboard</span>
        </Link>
      )}
    </>
  );

  return (
    <nav className={`fixed top-0 right-0 z-50 h-18 ${bgColor} border-b ${borderColor} transition-all duration-300 left-0`}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 py-2 gap-4 flex-nowrap">
        <div className="flex items-center space-x-3 flex-shrink-0">
          {(isZoomed || isDrawerMode || window.innerWidth <= 768) && (
            <button onClick={() => setNavMenuOpen(prev => !prev)} className={`p-2 rounded-md border ${borderColor} transition`} style={{ color: gold, backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff" }}>
              <Menu size={24} />
            </button>
          )}
        </div>

        <div className="hidden md:block">
          <img src={logo} alt="Yumigo Logo" className="h-12 w-12 rounded-full" />
        </div>

        <form onSubmit={handleSearchSubmit} className="flex-1 mx-4 min-w-0">
          <div className="relative w-full">
            <input type="text" placeholder="Search food items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={`w-full px-3 py-2.5 pr-10 rounded-full border text-sm md:text-base focus:outline-none focus:ring-2 transition ${theme === "dark" ? "bg-[#1A1A1A] text-white border-[#D4AF37] placeholder-gray-400 focus:ring-[#D4AF37]" : "bg-white text-black border-[#D4AF37] placeholder-gray-500 focus:ring-[#D4AF37]"}`} />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className={`absolute right-10 top-4 text-sm ${theme === "dark" ? "text-[#ffe523]" : "text-[#a97d1f]"} hover:text-red-700`}>
                <X size={14} />
              </button>
            )}
            <Search size={18} className="absolute right-3 top-4" style={{ color: gold }} />
          </div>
        </form>

        <div className="flex items-center space-x-4 ml-auto relative flex-shrink-0">
          <div className="hidden lg:flex items-center space-x-6 ml-8 text-base font-medium">
            {navLinks}
          </div>

          <Link to="/cart" className="relative group">
            <div className={`p-2 rounded-full border ${borderColor} transition-all duration-300`} style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff" }}>
              <ShoppingCart size={24} className="transition-transform group-hover:scale-110" style={{ color: gold }} />
            </div>
            {cartItems?.length > 0 && (
              <div className="absolute top-0 right-0 text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: gold, color: "#000" }}>
                {cartItems.length}
              </div>
            )}
          </Link>

          <button onClick={toggleTheme} className={`hidden lg:block p-2 rounded-full border ${borderColor} transition`} style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", color: gold }}>
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {user ? (
            <div ref={userMenuRef} className="relative group">
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="focus:outline-none p-[2px] rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#B22222] to-[#D4AF37] hover:scale-105 transition">
                <div className={`${theme === "dark" ? "bg-[#0d0d0d]" : "bg-white"} p-[2px] rounded-full`}>
                  <img src={avatarUrl} alt="User Avatar" className={` h-10 w-10 rounded-full object-cover`} />
                </div>
              </button>
              {userMenuOpen && (
                <div className={`absolute right-0 mt-3 w-60 z-50 overflow-hidden rounded-xl shadow-xl animate-fade-in border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white"}`}>
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
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className={`${textColor} hover:text-[${gold}] transition`}>Login</Link>
              <Link to="/signup" className={`${textColor} hover:text-[${gold}] transition`}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {navMenuOpen && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`fixed top-0 right-0 w-72 h-full p-5 ${bgColor} border-l ${borderColor} shadow-lg z-50`} style={{ backdropFilter: 'blur(8px)' }}>
            <div className="flex justify-between items-center mb-6">
              <img src={logo} alt="Yumigo Logo" className="h-10 w-10 rounded-full" />
              <button onClick={() => setNavMenuOpen(false)} className="text-red-600 hover:text-red-400 transition">
                <X size={28} />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={() => { navigate("/"); setNavMenuOpen(false); }} className={`flex items-center space-x-2 p-3 rounded-lg transition border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black" : "bg-white text-black hover:bg-[#B8860B] hover:text-white"}`}>
                <Home size={20} />
                <span>Home</span>
              </motion.button>

              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={() => { navigate("/menu"); setNavMenuOpen(false); }} className={`flex items-center space-x-2 p-3 rounded-lg transition border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black" : "bg-white text-black hover:bg-[#B8860B] hover:text-white"}`}>
                <Menu size={20} />
                <span>Menu</span>
              </motion.button>

              {user && (
                <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} onClick={() => { navigate("/dashboard"); setNavMenuOpen(false); }} className={`flex items-center space-x-2 p-3 rounded-lg transition border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A] text-white hover:bg-[#D4AF37] hover:text-black" : "bg-white text-black hover:bg-[#B8860B] hover:text-white"}`}>
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </motion.button>
              )}

              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.1 }} onClick={toggleTheme} className={`w-14 mt-4 p-4 rounded-full border ${borderColor} transition`} style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", color: gold }}>
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
