import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Users, BarChart, LogOut, Utensils } from "lucide-react"; // Added Utensils icon
import { useFood } from "../context/FoodContext";
import { motion } from "framer-motion"; // Added for motion animations

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { foodItems } = useFood(); // Get food data
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  const location = useLocation(); // Get the current location (page)

  if (!user || !user.isAdmin) {
    return <p className="text-center text-red-500 text-lg mt-10">🚫 Access Denied</p>;
  }

  // Simulate fetching user/order count
  useEffect(() => {
    setUserCount(1234); // Replace with API call
    setOrderCount(456);  // Replace with API call
  }, []);

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "flex items-center space-x-2 hover:text-yellow-400 text-yellow-400 transition"
      : "flex items-center space-x-2 hover:text-yellow-400 transition";
  };

  // Close sidebar when a menu item is clicked (for mobile view)
  const handleMenuItemClick = () => {
    if (sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div 
        className={`bg-gray-900 text-white w-64 p-5 space-y-6 absolute lg:relative lg:translate-x-0 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:flex lg:flex-col`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close Button for Mobile */}
        <button className="lg:hidden mb-4" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-yellow-400">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <motion.div 
            className={getLinkClass("/admin-dashboard")}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuItemClick} // Close sidebar on click
          >
            <BarChart size={20} /> <Link to="/admin-dashboard">Dashboard</Link>
          </motion.div>
          <motion.div 
            className={getLinkClass("/admin-users")}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuItemClick} // Close sidebar on click
          >
            <Users size={20} /> <Link to="/admin-users">Manage Users</Link>
          </motion.div>
          <motion.div 
            className={getLinkClass("/food-management")}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuItemClick} // Close sidebar on click
          >
            <Utensils size={20} /> <Link to="/food-management">Manage Food</Link>
          </motion.div>
          <motion.button 
            className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              logout();
              handleMenuItemClick(); // Close sidebar on logout
            }}
          >
            <LogOut size={20} /> <span>Logout</span>
          </motion.button>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 p-6 lg:ml-5">
        {/* Mobile Menu Button */}
        <motion.button 
          className="lg:hidden text-gray-900 mb-4" 
          onClick={() => setSidebarOpen(true)}
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
        >
          <Menu size={28} />
        </motion.button>

        <motion.h1 
          className="text-3xl font-bold mb-4 text-center text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Welcome, {user.name} (Admin)
        </motion.h1>

        {/* Admin Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div 
            className="bg-white shadow-lg rounded-lg p-6"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold text-blue-600">Total Users</h2>
            <p className="text-4xl font-bold text-blue-500">{userCount}</p>
          </motion.div>

          <motion.div 
            className="bg-white shadow-lg rounded-lg p-6"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold text-green-600">Total Orders</h2>
            <p className="text-4xl font-bold text-green-500">{orderCount}</p>
          </motion.div>

          <motion.div 
            className="bg-white shadow-lg rounded-lg p-6"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-xl font-semibold text-orange-600">Total Food Items</h2>
            <p className="text-4xl font-bold text-orange-500">{foodItems.length}</p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-x-4">
          <motion.div 
            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition"
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/food-management">🍽️ Manage Food Items</Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
