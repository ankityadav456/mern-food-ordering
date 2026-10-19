import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FoodProvider } from "./context/FoodContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { SearchProvider } from "./context/SearchContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import MenuPage from "./pages/MenuPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import BookTablePage from "./pages/BookTablePage";
import WishlistPage from "./pages/WishlistPage";
import AddFoodPage from "./pages/AddFoodPage";
import Cart from "./pages/Cart";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderSummary from "./pages/OrderSummary";
import ProfilePage from "./pages/ProfilePage";
import ManageUser from "./pages/ManageUser";
import TrackOrderPage from "./pages/TrackOrderPage";
import AnalyticsPageTracker from "./AnalyticsPageTracker";
import AnalyticsConsent from "./AnalyticsConsent";

import { Toaster } from "react-hot-toast";
import AuthModal from "./components/AuthModal";

const Providers = ({ children }) => (
  <AuthProvider>
    <FoodProvider>
      <CartProvider>
        <WishlistProvider>
          <SearchProvider>
            {children}
            <AuthModal />
          </SearchProvider>
        </WishlistProvider>
      </CartProvider>
    </FoodProvider>
  </AuthProvider>
);


const App = () => {
  return (
    <BrowserRouter>
      <Providers>
        <ScrollToTop />
        <AnalyticsPageTracker />
        <AnalyticsConsent />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            className:
              "dark:bg-[#1f1f1f] dark:text-white text-white border border-gray-700",
          }}
          containerStyle={{
            top: "4.5rem",
            right: "1rem",
            zIndex: 99999999,
          }}
        />

        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="admin-dashboard"
              element={<AdminRoute><AdminDashboard /></AdminRoute>}
            />
            <Route path="menu" element={<MenuPage />} />
            <Route path="food/:id" element={<FoodDetailPage />} />
            <Route path="book-table" element={<BookTablePage />} />
            <Route path="reservations" element={<BookTablePage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route
              path="food-management"
              element={<AdminRoute><AddFoodPage /></AdminRoute>}
            />
            <Route
              path="cart"
              element={<ProtectedRoute><Cart /></ProtectedRoute>}
            />
            <Route
              path="order-success"
              element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>}
            />
            <Route
              path="orders"
              element={<ProtectedRoute><OrderSummary /></ProtectedRoute>}
            />
            <Route
              path="track-order"
              element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>}
            />
            <Route
              path="track-order/:orderId"
              element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>}
            />
            <Route
              path="checkout"
              element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
            />
            <Route
              path="profile"
              element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}
            />
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <ManageUser />
                  </AdminRoute>
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Providers>
    </BrowserRouter>
  );
};


export default App;
