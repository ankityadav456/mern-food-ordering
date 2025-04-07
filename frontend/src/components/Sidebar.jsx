import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

const Sidebar = ({ isCollapsed, toggleSidebar, isZoomed }) => {
  const location = useLocation();


  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={22} /> },
    { name: "Menu", path: "/menu", icon: <Menu size={22} /> },
    { name: "Cart", path: "/cart", icon: <ShoppingCart size={22} /> },
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={22} /> },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}`}>
      {/* Header */}
      <div className="sidebar-header flex items-center justify-between h-16 px-4 border-b border-[#2A2A2A]">
        <Link to="/" className="flex items-center space-x-2 overflow-hidden">
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
            className="text-[#D4AF37] hover:text-[#B22222]"
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
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
              className={`sidebar-link ${isCollapsed ? "mx-auto justify-center" : "mx-5"} ${isActive ? "sidebar-active" : "sidebar-inactive"
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
        <button className="logout-btn" aria-label="Logout">
          <LogOut size={22} />
          <span className={`${isCollapsed ? "hidden" : "ml-3"} transition-all duration-300`}>
            Logout
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
