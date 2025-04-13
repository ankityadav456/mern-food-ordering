import { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, ChevronDown, Search, ShoppingCart, MoreVertical, X } from "lucide-react";
import { SearchContext } from "../context/SearchContext";

const Navbar = ({ isCollapsed, toggleSidebar, isSidebarVisible, isDrawerMode, isZoomed }) => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // if (searchQuery.trim()) {
    //   navigate(`/dashboard?search=${searchQuery}`);
    // }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 right-0 z-50 h-16 bg-[#0d0d0d] border-b border-[#2A2A2A] transition-all duration-300
      ${isSidebarVisible && !isDrawerMode ? (isCollapsed ? "left-16" : "left-60") : "left-0"}
    `}
    >
      <div className="w-full max-w-[1440px] mx-auto flex justify-between items-center px-4 py-2">

        {/* Sidebar Toggle */}
        <div className="flex items-center space-x-2">
          {(isZoomed || isDrawerMode) && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-[#D4AF37] hover:bg-[#B22222] hover:text-white transition"
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Search */}
          <form
           className="flex items-center relative w-full max-w-[160px] sm:max-w-[200px] md:max-w-[280px] lg:max-w-md ml-2 sm:ml-4"
            onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search food items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1A1A1A] text-white px-4 py-2 pr-10 rounded-full border border-[#D4AF37] placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-10 text-[#B22222] hover:text-red-700"
              >
                <X size={16} />
              </button>
            )}
            <Search size={20} className="absolute right-3 text-[#D4AF37]" />
          </form>


          {/* Cart & User */}
          <div className="flex items-center space-x-4 ml-auto relative z-50">
            <Link to="/cart" className="relative group">
              {/* Cart Icon Button */}
              <div className="p-2 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#D4AF37] shadow-sm hover:shadow-gold transition-all duration-300">
                <ShoppingCart size={24} className="text-[#D4AF37] group-hover:scale-110 transition-transform" />
              </div>

              {/* Tooltip */}
              <div className="absolute left-1/2 transform -translate-x-1/2 top-[115%] bg-[#1A1A1A] text-white text-xs px-2 py-1 rounded-md border border-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                View Cart
              </div>
            </Link>


            {user ? (
              <div className="relative group">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="focus:outline-none p-[2px] rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#B22222] to-[#D4AF37] hover:scale-105 transition"
                >
                  <div className="bg-[#0d0d0d] p-[2px] rounded-full">
                    <img
                      src={user.avatar || "https://api.dicebear.com/7.x/initials/svg?seed=" + user.name}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full object-cover border-2 border-[#0d0d0d]"
                    />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-[#2A2A2A]">
                      <p className="text-white font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                    {user.isAdmin && (
                      <Link
                        to="/admin-dashboard"
                        className="block px-5 py-3 text-white hover:bg-[#B22222] transition"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="block px-5 py-3 text-white hover:bg-[#B22222] transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-5 py-3 text-white hover:bg-[#B22222] transition"
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
