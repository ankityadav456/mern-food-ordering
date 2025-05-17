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
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ isCollapsed, toggleSidebar, isZoomed, isDrawerMode, onNavigate }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { theme } = useTheme();

  // Define theme-based styles
  const styles = {
    dark: {
      bgColor: "bg-[#1A1A1A]",
      textColor: "text-white",
      goldText: "text-[#D4AF37]",
      borderColor: "border-[#2A2A2A]",
      hoverBgColor: "hover:bg-[#B22222]",
      buttonBg: "bg-[#2A2A2A]",
      activeBg: "bg-[#B22222]",
      activeText: "text-white",
      scrollbarThumb: "scrollbar-thumb-[#D4AF37]",
      scrollbarTrack: "scrollbar-track-[#1A1A1A]",
    },
    light: {
      bgColor: "bg-[#F8F4F1]",
      textColor: "text-[#3B3A36]",
      goldText: "text-[#B39D6A]",
      borderColor: "border-[#D3D0C8]",
      hoverBgColor: "hover:bg-[#F0D4B8]",
      buttonBg: "bg-[#F0D4B8]",
      activeBg: "bg-[#F5E2D4]",
      activeText: "text-[#3B3A36]",
      scrollbarThumb: "scrollbar-thumb-[#B39D6A]",
      scrollbarTrack: "scrollbar-track-[#F8F4F1]",
    },
  };

  const s = styles[theme];

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
      className={`sidebar py-1 h-screen overflow-y-auto scrollbar-thin ${s.scrollbarThumb} ${s.scrollbarTrack}
        ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"} ${s.bgColor}`}
    >
      {/* Header */}
      <div
        className={`sidebar-header flex items-center justify-between h-16 px-4 border-b ${s.borderColor} sticky top-0 z-10`}
      >
        <Link to="/" className="flex items-center space-x-2 overflow-hidden" onClick={handleNavClick}>
          <img
            src={logo}
            alt="Yumigo Logo"
            className={`transition-all duration-300 rounded-full 
              ${isCollapsed ? "h-8 w-8 opacity-0" : "h-10 w-10 opacity-100"}`}
          />
          {!isCollapsed && <span className={`font-semibold text-lg whitespace-nowrap ${s.goldText}`}>Yumigo</span>}
        </Link>

        {!isZoomed && (
          <button
            onClick={toggleSidebar}
            className={`ml-auto p-1.5 rounded-md ${s.buttonBg} ${s.goldText} ${s.hoverBgColor} hover:text-white transition-all duration-300 ${
              isDrawerMode ? "opacity-0" : "opacity-100"
            }`}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-grow overflow-y-auto">
        <nav className="flex flex-col flex-grow mt-4 gap-y-3">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                aria-current={isActive ? "page" : undefined}
                className={`transition-all duration-300 ${
                  isDrawerMode ? "p-2" : "p-3"
                } ${isCollapsed ? "mx-auto justify-center" : "mx-5"} flex items-center rounded-lg
                  ${isActive ? `${s.activeBg} ${s.activeText} font-semibold` : `${s.textColor} opacity-80`}
                  ${s.hoverBgColor} hover:${s.goldText}`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className={`${isCollapsed ? "hidden" : "ml-3 text-lg"} transition-all duration-300`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 mt-auto">
        <button
          onClick={logout}
          className={`flex items-center w-full ${
            isCollapsed ? "justify-center" : "justify-start"
          } gap-3 py-2 px-3 rounded-md ${s.goldText} ${s.borderColor} border ${s.bgColor} ${s.hoverBgColor} hover:text-white transition-all duration-300`}
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