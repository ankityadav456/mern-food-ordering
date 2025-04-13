import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Menu,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import logo from "../assets/Images/AppLogo.png";

const Sidebar = ({ isCollapsed, toggleSidebar, isZoomed, isDrawerMode, onNavigate }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={22} /> },
    { name: "Menu", path: "/menu", icon: <Menu size={22} /> },
    { name: "Cart", path: "/cart", icon: <ShoppingCart size={22} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={22} /> },
  ];

  const handleNavClick = () => {
    if (isDrawerMode && onNavigate) {
      onNavigate();
    }
  };

  return (
    <div
      className={`sidebar h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-[#444] scrollbar-track-transparent
        ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}
    >
      {/* Header */}
      <div className="sidebar-header flex items-center justify-between h-16 px-4 border-b border-[#2A2A2A] sticky top-0 bg-[#1A1A1A] z-10">
        <Link to="/" className="flex items-center space-x-2 overflow-hidden" onClick={handleNavClick}>
          <img
            src={logo}
            alt="Yumigo Logo"
            className={`transition-all duration-300 rounded-full 
              ${isCollapsed ? 'h-8 w-8 opacity-0' : 'h-10 w-10 opacity-100'}`}
          />
          {!isCollapsed && (
            <span className="text-[#D4AF37] font-semibold text-lg whitespace-nowrap">
              Yumigo
            </span>
          )}
        </Link>

        {!isZoomed && (
          <button
            onClick={toggleSidebar}
            className={` ml-auto p-1.5 rounded-md bg-[#2A2A2A] text-[#D4AF37] hover:bg-[#B22222] hover:text-white transition-all duration-300  ${isDrawerMode ? "opacity-0" : "opacity-100"}`}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col flex-grow mt-4">
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`${isDrawerMode ? "p-2" : "p-3"} sidebar-link ${isCollapsed ? "mx-auto justify-center" : "mx-5"} ${isActive ? "sidebar-active" : "sidebar-inactive"
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span
                className={`${isCollapsed ? "hidden" : "ml-3 text-lg"} transition-all duration-300`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 mt-auto">
        <button onClick={logout}
          className={`flex items-center w-full justify-${isCollapsed ? "center" : "start"} gap-3 py-2 px-3 rounded-md 
                text-[#D4AF37] border border-[#2A2A2A] bg-[#1A1A1A] hover:bg-[#B22222] hover:text-white 
                transition-all duration-300`}
          aria-label="Logout"
        >
          <LogOut size={22} />
          <span className={`${isCollapsed ? "hidden" : "text-md font-medium"}`}>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
