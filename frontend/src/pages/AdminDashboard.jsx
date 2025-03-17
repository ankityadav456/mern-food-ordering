import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Users, BarChart, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user || !user.isAdmin) {
    return <p className="text-center text-red-500 text-lg mt-10">Access Denied</p>;
  }
  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white w-64 p-5 space-y-6 absolute lg:relative lg:translate-x-0 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:flex lg:flex-col`}>
        {/* Close Button for Mobile */}
        <button className="lg:hidden mb-4" onClick={() => setSidebarOpen(false)}>
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link to="/admin-dashboard" className="flex items-center space-x-2 hover:text-yellow-400 transition">
            <BarChart size={20} /> <span>Dashboard</span>
          </Link>
          <Link to="/admin-users" className="flex items-center space-x-2 hover:text-yellow-400 transition">
            <Users size={20} /> <span>Manage Users</span>
          </Link>
          <button onClick={logout} className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition">
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-900 mb-4" onClick={() => setSidebarOpen(true)}>
          <Menu size={28} />
        </button>

        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name} (Admin)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Users Overview */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-4xl font-bold text-blue-500">1,234</p>
          </div>

          {/* Card 2: Orders Overview */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-4xl font-bold text-green-500">456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
