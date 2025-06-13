import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const { theme } = useTheme();
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100);
      setIsZoomed(zoomLevel >= 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const bgColor = theme === "dark" ? "bg-[#0d0d0d]" : "bg-[#FAF9F6]";

  return (
    <div className={`${bgColor} min-h-screen transition-all duration-300`}>
      {/* Navbar */}
      <Navbar
        isCollapsed={false}
        toggleSidebar={() => {}}
        isSidebarVisible={false}
        isDrawerMode={false}
        isZoomed={isZoomed}
        onNavigate={() => {}}
      />

      {/* Main Content */}
      <div className="pt-16 px-4 pb-4">
        <Outlet />
      </div>
    <div>
      <Footer />
    </div>
    </div>

  );
};

export default Layout;
