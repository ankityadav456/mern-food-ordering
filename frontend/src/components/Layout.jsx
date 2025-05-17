import { useEffect, useRef, useState, useContext } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";

// Example: if you're using a ThemeContext
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isDrawerMode, setIsDrawerMode] = useState(false);
  const [isTemporarySidebarVisible, setIsTemporarySidebarVisible] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const sidebarRef = useRef();

  useEffect(() => {
    const checkZoom = () => {
      const zoom = window.devicePixelRatio;
      setIsZoomed(zoom > 2);
    };
    checkZoom();
    window.addEventListener("resize", checkZoom);
    return () => window.removeEventListener("resize", checkZoom);
  }, []);

  const toggleSidebar = () => {
    if (isDrawerMode) {
      setIsTemporarySidebarVisible(true);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const closeTemporarySidebar = () => {
    setIsTemporarySidebarVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const zoom = window.outerWidth / window.innerWidth;
      const width = window.innerWidth;
      if (zoom >= 1.5 || width < 640) {
        setIsSidebarVisible(false);
        setIsDrawerMode(true);
      } else {
        setIsSidebarVisible(true);
        setIsCollapsed(false);
        setIsDrawerMode(false);
        setIsTemporarySidebarVisible(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowSidebar = isSidebarVisible || isTemporarySidebarVisible;

  useEffect(() => {
    if (isDrawerMode && isTemporarySidebarVisible) {
      setIsTemporarySidebarVisible(false);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isDrawerMode &&
        isTemporarySidebarVisible &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setIsTemporarySidebarVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDrawerMode, isTemporarySidebarVisible]);

  const dynamicMargin = isDrawerMode
    ? "ml-0"
    : isSidebarVisible
    ? isCollapsed
      ? "ml-16"
      : "ml-60"
    : "ml-0";

  const bgBase = theme === "dark" ? "bg-[#121212]" : "bg-[#FAF9F6]";
  const bgMain = theme === "dark" ? "bg-[#1A1A1A]" : "bg-white";
  const textColor = theme === "dark" ? "text-white" : "text-black";
  const borderColor = theme === "dark" ? "border-[#222]" : "border-[#ddd]";
  const sidebarBg = theme === "dark" ? "bg-[#1A1A1A]" : "bg-[#f5f5f5]";
  const sidebarBorder = theme === "dark" ? "border-[#333]" : "border-[#ccc]";
  const backdrop = theme === "dark" ? "bg-black bg-opacity-50" : "bg-black bg-opacity-20";

  return (
    <div className={`relative min-h-screen ${bgBase} ${textColor}`}>
      {/* Sidebar */}
      {shouldShowSidebar && (
        <div
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full ${sidebarBg} border-r ${sidebarBorder} transition-all duration-300
            ${isDrawerMode ? "z-50 w-60" : "z-20"} ${
            isCollapsed && !isDrawerMode ? "w-16" : "w-60"
          }`}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            isZoomed={isZoomed}
            isDrawerMode={isDrawerMode}
          />
        </div>
      )}

      {/* Backdrop */}
      {isTemporarySidebarVisible && (
        <div
          className={`fixed inset-0 ${backdrop} z-40`}
          onClick={closeTemporarySidebar}
        />
      )}

      {/* Navbar */}
      <div className={`fixed top-0 z-30 w-full transition-all duration-300 ${dynamicMargin}`}>
        <div className="max-w-[1440px] mx-auto px-4">
          <Navbar
            isCollapsed={isCollapsed}
            toggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
            setIsSidebarVisible={setIsSidebarVisible}
            isDrawerMode={isDrawerMode}
            isZoomed={isZoomed}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`pt-16 transition-all duration-300 ${dynamicMargin}`}>
        <div className="max-w-[1440px] mx-auto">
          <main className={`min-h-screen ${bgMain} ${textColor} transition-colors duration-300`}>
            <Outlet />
          </main>
          <div className={`border-t ${borderColor}`}>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
