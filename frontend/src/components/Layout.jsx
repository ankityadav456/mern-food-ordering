import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();

  const noPaddingRoutes = ["/"];
  const isNoPadding = noPaddingRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#fdfbf7] text-text-light dark:bg-[#09090d] dark:text-text-dark transition-colors duration-200">
      <Navbar isDrawerMode={false} onNavigate={() => { }} />

      <main
        className={`w-full max-w-full overflow-x-hidden ${isNoPadding ? "pt-0" : "pt-16 px-4 pb-4"}`}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
