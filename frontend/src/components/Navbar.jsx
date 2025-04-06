import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, ChevronDown, Search, ShoppingCart, MoreVertical, X } from "lucide-react";

const Navbar = ({ isCollapsed, toggleSidebar, isSidebarVisible, isDrawerMode, isZoomed }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebarDropdown, setShowSidebarDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${searchQuery}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 right-0 z-50 h-16 bg-[#0d0d0d] border-b border-[#2A2A2A] transition-all duration-300
      ${isSidebarVisible && !isDrawerMode ? (isCollapsed ? "left-16" : "left-60") : "left-0"}
    `}
    >
      <div className="w-full flex justify-between items-center px-4 py-2">
        {/* Left Side - Sidebar Toggle */}
        <div className="flex items-center space-x-2">
          {(isZoomed || isDrawerMode) && (
            <button onClick={toggleSidebar} className="text-[#D4AF37] hover:text-[#B22222] transition">
              <Menu size={28} />
            </button>
          )}

          {isDrawerMode && (
            <div className="relative">
              <button
                onClick={() => setShowSidebarDropdown(!showSidebarDropdown)}
                className="text-[#D4AF37] hover:text-[#B22222] transition"
              >
                <MoreVertical size={24} />
              </button>
              {showSidebarDropdown && (
                <div className="absolute top-10 left-0 bg-[#1A1A1A] border border-[#333] p-2 rounded shadow-lg z-50">
                  <Link to="/" className="block px-3 py-1 text-white hover:bg-[#B22222] rounded">Home</Link>
                  <Link to="/menu" className="block px-3 py-1 text-white hover:bg-[#B22222] rounded">Menu</Link>
                  <Link to="/cart" className="block px-3 py-1 text-white hover:bg-[#B22222] rounded">Cart</Link>
                  <Link to="/dashboard" className="block px-3 py-1 text-white hover:bg-[#B22222] rounded">Dashboard</Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center - Search */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center relative max-w-md w-full ml-4"
        >
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1A1A1A] text-white px-4 py-2 pr-10 rounded-full focus:outline-none border border-[#D4AF37] placeholder-gray-400 w-full transition"
          />
          <Search size={20} className="absolute right-3 text-[#D4AF37]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-10 text-[#B22222] hover:text-red-700"
            >
              <X size={16} />
            </button>
          )}
        </form>

        {/* Right - Cart & User */}
        <div className="flex items-center space-x-4 ml-auto relative z-50">
          <Link to="/cart">
            <button className="mt-2 text-gold sidebar-title hover:text-[#D4AF37] transition">
              <ShoppingCart size={24} />
            </button>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="sidebar-title hover:text-[#D4AF37] flex items-center space-x-1 transition"
              >
                <span className="font-medium">{user.name}</span>
                <ChevronDown size={16} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#1A1A1A] border border-[#333] rounded-lg shadow-lg overflow-hidden">
                  {user.isAdmin && (
                    <Link to="/admin-dashboard" className="block px-4 py-2 text-white hover:bg-[#B22222] transition">Admin Panel</Link>
                  )}
                  <Link to="/dashboard" className="block px-4 py-2 text-white hover:bg-[#B22222] transition">Dashboard</Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#B22222] transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-white hover:text-[#D4AF37] transition">Login</Link>
              <Link to="/signup" className="text-white hover:text-[#D4AF37] transition">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
