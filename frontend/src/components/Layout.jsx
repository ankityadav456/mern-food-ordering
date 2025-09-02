import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {

  return (
    <div className="min-h-screen bg-background-light text-text-light dark:bg-background-dark dark:text-text-dark transition-colors duration-100">
      <Navbar
        isDrawerMode={false}
        onNavigate={() => { }}
      />

      <main className="pt-16 mt-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
