import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { FoodProvider } from "./context/FoodContext";
import { CartProvider } from "./context/CartContext"; // 🛒 Add this
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MenuPage from "./pages/MenuPage";
import AddFoodPage from "./pages/AddFoodPage";
import Cart from "./pages/Cart";

const App = () => {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <AuthProvider>
          <FoodProvider>
            <CartProvider> {/* ✅ Wrap Routes with CartProvider */}
              <Routes>
                {/* Pages Wrapped in Layout (Sidebar & Navbar Included) */}
                <Route path="/" element={<Layout />}>
                <Route index element={<Home />} /> {/* 👈 Now it's PUBLIC */} 
                  <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
                  <Route path="food-management" element={<AdminRoute><AddFoodPage /></AdminRoute>} />
                  <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                </Route>

                {/* Authentication Pages (No Sidebar/Navbar) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Redirect Unknown Routes */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </CartProvider>
          </FoodProvider>
        </AuthProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
};

export default App;
