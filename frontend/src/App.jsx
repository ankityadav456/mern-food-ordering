import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"; // ✅ Import AdminRoute
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard"; // ✅ Admin Dashboard
import MenuPage from "./pages/MenuPage"; // Import the MenuPage
import AddFoodPage from "./pages/AddFoodPage"; // Import the MenuPage
import { FoodProvider } from "./context/FoodContext"; // ✅ Import FoodProvider

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="min-h-screen">{children}</main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <DarkModeProvider> {/* ✅ Dark Mode Context */}
        <AuthProvider>
        <FoodProvider> 
          <Layout>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} /> {/* ✅ Admin Protected Route */}
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
              <Route path="/add-food" element={<AdminRoute><AddFoodPage /></AdminRoute>} />
            </Routes>
          </Layout>
          </FoodProvider> 
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;
