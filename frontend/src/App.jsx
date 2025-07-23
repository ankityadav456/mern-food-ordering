import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import { FoodProvider } from "./context/FoodContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";

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
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderSummary from "./pages/OrderSummary";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast"; // ✅ Import toast system
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
    <ScrollToTop />
      {/* <DarkModeProvider> */}
      <AuthProvider>
        <FoodProvider>
          <CartProvider>
            <SearchProvider>
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 1500,
                  className: "dark:bg-[#1f1f1f] dark:text-white text-white border border-gray-700"
                }}
                containerStyle={{
                  top: "4.5rem",
                  right: "1rem",
                }}
              />
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
                  <Route path="food-management" element={<AdminRoute><AddFoodPage /></AdminRoute>} />
                  <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                  <Route path="order-success" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><OrderSummary /></ProtectedRoute>} />
                  <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                </Route>

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </SearchProvider>
          </CartProvider>
        </FoodProvider>
      </AuthProvider>
      {/* </DarkModeProvider> */}
    </BrowserRouter>
  );
};

export default App;
