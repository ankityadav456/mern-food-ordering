import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  console.log(user);
  // Function to close mobile menu after click
  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-green-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          🍔 FoodieApp
        </Link>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Nav Links */}
        <div
          className={`lg:flex items-center space-x-6 ${
            menuOpen
              ? "absolute top-16 left-0 w-full bg-green-600 p-4 flex flex-col space-y-4"
              : "hidden lg:flex"
          }`}
        >
          <Link to="/" onClick={handleMenuClick} className="hover:text-yellow-300 transition">
            Home
          </Link>
          <Link to="/services" onClick={handleMenuClick} className="hover:text-yellow-300 transition">
            Services
          </Link>
          <Link to="/menu" onClick={handleMenuClick} className="hover:text-yellow-300 transition">
            Menu
          </Link>
          <Link to="/contact" onClick={handleMenuClick} className="hover:text-yellow-300 transition">
            Contact
          </Link>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="bg-yellow-500 px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <span>{user.name}</span>
                <ChevronDown size={16} />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg overflow-hidden">
                  {user.isAdmin && ( // ✅ Show Admin Panel for Admins Only
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" onClick={handleMenuClick} className="bg-blue-500 px-4 py-2 rounded-lg">
                Login
              </Link>
              <Link to="/signup" onClick={handleMenuClick} className="bg-yellow-500 px-4 py-2 rounded-lg">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
