import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  const noPaddingRoutes = ["/"];
  const isNoPadding = noPaddingRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-100">
      <Navbar isDrawerMode={false} onNavigate={() => { }} />

      <main
        className={`pt-14 mt-4 ${isNoPadding ? "" : "px-4 pb-4"}`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
