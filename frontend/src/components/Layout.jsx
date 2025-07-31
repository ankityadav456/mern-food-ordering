import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useTheme } from "../context/ThemeContext";

const Layout = () => {
  const { theme } = useTheme();
  // const [isZoomed, setIsZoomed] = useState(false);

  // useEffect(() => {
  //   const handleResize = () => {
  //     const zoomLevel = Math.round((window.outerWidth / window.innerWidth) * 100);
  //     setIsZoomed(zoomLevel >= 150);
  //   };

  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-300">
      {/* Navbar */}
      <Navbar
        // isCollapsed={false}
        // toggleSidebar={() => {}}
        // isSidebarVisible={false}
        isDrawerMode={false}
        onNavigate={() => {}}
      />

      {/* Main Content */}
      <main className="pt-16 px-4 pb-4 transition-colors duration-300">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
