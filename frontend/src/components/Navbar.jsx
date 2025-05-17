import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Menu, Search, ShoppingCart, X, Sun, Moon } from "lucide-react";
import { SearchContext } from "../context/SearchContext";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/Images/AppLogo.png";

const Navbar = ({ isCollapsed, toggleSidebar, isSidebarVisible, isDrawerMode, isZoomed, onNavigate }) => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

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
  const handleNavClick = () => isDrawerMode && onNavigate?.();

  // Theme colors for consistency with Sidebar
  const bgColor = theme === "dark" ? "bg-[#0d0d0d]" : "bg-[#FAF9F6]";
  const borderColor = theme === "dark" ? "border-[#2A2A2A]" : "border-[#D4AF37]";
  const textColor = theme === "dark" ? "text-white" : "text-[#333]";
  const gold = theme === "dark" ? "#D4AF37" : "#B8860B";
  const danger = theme === "dark" ? "#B22222" : "#DC2626";

  return (
    <nav className={`fixed top-0 right-0 z-50 h-18 ${bgColor} border-b ${borderColor} transition-all duration-300 ${isSidebarVisible && !isDrawerMode ? (isCollapsed ? "left-16" : "left-60") : "left-0"}`}>
      <div className="w-full max-w-[1440px] mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo + Toggle */}
        {(isZoomed || isDrawerMode) && (
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className={`p-2 rounded-md border ${borderColor} transition hover:bg-[${danger}] hover:text-white`}
              style={{ color: gold, backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff" }}
            >
              <Menu size={24} />
            </button>
            <Link to="/" onClick={handleNavClick} className="flex items-center space-x-2">
              <img src={logo} alt="Yumigo Logo" className="h-10 w-10 rounded-full" />
              {!isCollapsed && (
                <span className="font-semibold text-lg hidden sm:inline" style={{ color: gold }}>
                  Yumigo
                </span>
              )}
            </Link>
          </div>
        )}

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md ml-4">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 pr-10 rounded-full border focus:outline-none focus:ring-2 transition
              ${theme === "dark" ? "bg-[#1A1A1A] text-white border-[#D4AF37] placeholder-gray-400 focus:ring-[#D4AF37]" : "bg-white text-black border-[#D4AF37] placeholder-gray-500 focus:ring-[#D4AF37]"}`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className={`absolute right-10 top-3 text-sm ${theme === "dark" ? "text-[#ffe523]" : "text-[#a97d1f]"} hover:text-red-700`}
            >
              <X size={16} />
            </button>
          )}
          <Search size={20} className="absolute right-3 top-2.5" style={{ color: gold }} />
        </form>

        {/* Actions */}
        <div className="flex items-center space-x-4 ml-auto relative">
          {/* Cart */}
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

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border ${borderColor} transition hover:bg-[${danger}] hover:text-white`}
            style={{ backgroundColor: theme === "dark" ? "#1A1A1A" : "#fff", color: gold }}
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>

          {/* User */}
          {user ? (
            <div ref={userMenuRef} className="relative group">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="focus:outline-none p-[2px] rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#B22222] to-[#D4AF37] hover:scale-105 transition"
              >
                <div className={`${theme === "dark" ? "bg-[#0d0d0d]" : "bg-white"} p-[2px] rounded-full`}>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover border-2"
                  />
                </div>
              </button>
              {userMenuOpen && (
                <div className={`absolute right-0 mt-3 w-60 z-50 overflow-hidden rounded-xl shadow-xl animate-fade-in border ${borderColor} ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white"}`}>
                  <div className={`px-4 py-3 border-b ${borderColor}`}>
                    <p className={`${textColor} font-semibold`}>{user.name}</p>
                    <p className="text-sm text-gray-400 truncate">{user.email}</p>
                  </div>
                  {user.isAdmin && (
                    <Link to="/admin-dashboard" className="block px-5 py-3 hover:bg-red-600 hover:text-white transition">
                      Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" className="block px-5 py-3 hover:bg-red-600 hover:text-white transition">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="w-full text-left px-5 py-3 hover:bg-red-600 hover:text-white transition">
                    Logout
                  </button>
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
    </nav>
  );
};

export default Navbar;
