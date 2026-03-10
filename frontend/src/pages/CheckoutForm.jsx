// src/pages/CheckoutForm.jsx
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import AddressModal from "../components/AddressModal";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  CreditCard,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useTheme } from "../context/ThemeContext";

const CheckoutForm = () => {
  const { cartItems = [], clearCart, getTotalPrice } = useCart();
  const { user, deleteAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false); //  new state
  const { theme } = useTheme();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const { discount = 0, appliedCoupon = null, finalTotal = 0 } = location.state || {};
  useEffect(() => {
    if (user && user.address) setSelectedAddress(user.address);
  }, [user]);

  const CARD_OPTIONS = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "16px",
          color: theme === "dark" ? "#FFFFFF" : "#1E1E1E",
          "::placeholder": {
            color: theme === "dark" ? "#CCCCCC" : "#666666",
          },
          fontFamily: "Poppins, sans-serif",
          iconColor: theme === "dark" ? "#FFD54F" : "#FF5722",
        },
        invalid: { color: "#FF4136" },
      },
    }),
    [theme]
  );

  useEffect(() => {
    if (cartItems.length === 0) return;
    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post("/payment/create-payment-intent", {
          amount: (finalTotal + 40) * 100,
        });
        setClientSecret(data.clientSecret);
      } catch (error) {
        setErrorMessage("Error with payment details. Try again.");
      }
    };
    fetchClientSecret();
  }, [cartItems, getTotalPrice]);

  //  Updated function: shows alert when address is missing
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Swal.fire({
        title: "No Address Found!",
        text: "Please add a delivery address before placing your order.",
        icon: "warning",
        confirmButtonText: "Add Address",
        background: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
        color: theme === "dark" ? "#EAEAEA" : "#111111",
        confirmButtonColor: theme === "dark" ? "#FF5722" : "#FF7043",
      }).then((result) => {
        if (result.isConfirmed) setShowAddressModal(true);
      });
      return;
    }

    const { fullName, mobileNumber, roomNumber, street, city, state, pincode } = selectedAddress;
    if (!fullName || !mobileNumber || !roomNumber || !street || !city || !state || !pincode) {
      setErrorMessage("Please complete all address fields.");
      return;
    }

    if (!stripe || !elements || !clientSecret || cartItems.length === 0) {
      setErrorMessage("Please complete all details before proceeding.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) {
        setErrorMessage("Payment failed. Check card details.");
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axios.post("/orders", {
          items: cartItems.map((item) => ({
            foodId: item.foodId._id,
            quantity: item.quantity,
            name: item.foodId.name,
            price: item.foodId.price,
          })),
          // totalAmount: getTotalPrice(),
           couponCode: appliedCoupon || null,
  deliveryFee: 40,
          deliveryAddress: selectedAddress,
        });

        clearCart();
        setClientSecret(null);
        navigate("/order-success");
      } else {
        setErrorMessage("Unexpected payment status.");
      }
    } catch (err) {
      setErrorMessage("Error processing order.");
    } finally {
      setLoading(false);
    }
  };

  //  Address added handler with loader
  const handleAddressAdded = (address) => {
    setAddressLoading(true);
    setTimeout(() => {
      setSelectedAddress(address);
      setShowAddressModal(false);
      setEditAddress(null);
      setAddressLoading(false);
    }, 1200);
  };

  const handleDeleteAddress = async () => {
    const isDark = theme === "dark";
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This address will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        background: isDark ? "#1E1E1E" : "#FFFFFF",
        color: isDark ? "#EAEAEA" : "#111111",
        confirmButtonColor: isDark ? "#FF5722" : "#FF7043",
        cancelButtonColor: isDark ? "#FFD54F" : "#FFC107",
      });

      if (result.isConfirmed) {
        await deleteAddress();
        setSelectedAddress(null);

        await Swal.fire({
          title: "Deleted!",
          text: "Your address has been removed.",
          icon: "success",
          background: isDark ? "#1E1E1E" : "#FFFFFF",
          color: isDark ? "#EAEAEA" : "#111111",
          confirmButtonColor: isDark ? "#FF5722" : "#FF7043",
        });
      }
    } catch (error) {
      console.error("Error deleting address", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting the address.",
        icon: "error",
        background: isDark ? "#1E1E1E" : "#FFFFFF",
        color: isDark ? "#EAEAEA" : "#111111",
        confirmButtonColor: isDark ? "#FF5722" : "#FF7043",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 mt-12 rounded-3xl shadow-xl
             bg-surface-light dark:bg-surface-dark
             border border-transparent dark:border-transparent
             text-text-light dark:text-text-dark
             transition-all duration-500"
    >
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-primary-light dark:text-primary-dark mb-10">
        Checkout
      </h2>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark shadow-lg 
                   border border-gray-100 dark:border-[#222] flex flex-col"
          >
            <h3 className="flex items-center gap-3 text-2xl font-semibold text-primary-light dark:text-primary-dark mb-6">
              <ShoppingCart className="w-6 h-6" /> Your Order
            </h3>

            <div className="space-y-5 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
              {cartItems.map((item) => (
                <motion.div
                  key={item.foodId._id}
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-between items-center py-3 px-2 rounded-xl
                         hover:bg-primary-light/10 dark:hover:bg-primary-dark/20 transition-all"
                >
                  <div className="flex flex-col">
                    <p className="font-medium text-lg">{item.foodId.name}</p>
                    <p className="text-sm text-text-subtleLight dark:text-text-subtleDark">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-secondary-light dark:text-secondary-dark">
                    ₹{item.foodId.price * item.quantity}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 border-t pt-5 space-y-2 border-gray-100 dark:border-[#222]">
              <p className="text-text-subtleLight dark:text-text-subtleDark">
                Subtotal: ₹{finalTotal + discount}
              </p>

              {appliedCoupon && (
                <p className="text-text-subtleLight dark:text-text-subtleDark">
                  Coupon ({appliedCoupon}): -₹{discount.toFixed(2)}
                </p>
              )}

              <p className="text-text-subtleLight dark:text-text-subtleDark">
                Delivery Fee: ₹40
              </p>

              <p className="text-xl font-bold text-primary-light dark:text-primary-dark">
                Total: ₹{(finalTotal + 40).toFixed(2)}
              </p>
            </div>


          </motion.div>

          {/* Address & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 flex flex-col"
          >
            {/* Address */}
            <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark shadow-lg border border-gray-100 dark:border-[#222]">
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-5 text-primary-light dark:text-primary-dark">
                <MapPin className="w-6 h-6" /> Delivery Address
              </h3>
              {selectedAddress ? (
                <div className="p-5 rounded-2xl bg-background-light dark:bg-background-dark shadow-md">
                  <p className="font-medium">{selectedAddress.fullName}</p>
                  <p className="text-text-subtleLight dark:text-text-subtleDark">
                    Mobile: {selectedAddress.mobileNumber}
                  </p>
                  <p>
                    {selectedAddress.roomNumber}, {selectedAddress.street}
                  </p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state} -{" "}
                    {selectedAddress.pincode}
                  </p>

                  <div className="flex gap-4 mt-5">
                    <button
                      onClick={() => {
                        setEditAddress(selectedAddress);
                        setShowAddressModal(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-primary-light dark:bg-primary-dark text-white font-semibold hover:scale-105 transition-transform"
                    >
                      <Pencil size={18} /> Edit
                    </button>
                    <button
                      onClick={handleDeleteAddress}
                      className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="mt-4 px-6 py-3 rounded-2xl bg-secondary-light dark:bg-secondary-dark font-bold text-black hover:scale-105 transition-transform"
                >
                  Add Address
                </button>
              )}
            </div>

            {/* Payment */}
            <div className="p-6 rounded-3xl bg-surface-light dark:bg-surface-dark shadow-lg border border-gray-100 dark:border-[#222]">
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-4 text-primary-light dark:text-primary-dark">
                <CreditCard className="w-6 h-6" /> Payment
              </h3>
              <div className="border rounded-2xl p-4 text-black dark:text-white bg-background-light dark:bg-background-dark">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                onClick={() => navigate("/cart")}
                className="w-full md:w-1/2 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark font-medium shadow-md hover:scale-105 transition-transform"
              >
                <ArrowLeft className="w-5 h-5" /> Back to Cart
              </button>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || !clientSecret}
                className="w-full md:w-1/2 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#FFD54F] to-[#FF5722] text-white font-semibold shadow-lg hover:scale-105 disabled:opacity-60 transition-transform"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" /> Place Order
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <p className="text-center text-lg text-text-subtleLight dark:text-text-subtleDark mt-20">
          Your cart is empty.
        </p>
      )}

      {/* Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <AddressModal
            onClose={() => {
              setShowAddressModal(false);
              setEditAddress(null);
            }}
            onAddressAdded={handleAddressAdded}
            initialAddress={editAddress}
          />
        )}
      </AnimatePresence>

      {/*  Address Saving Loader */}
      {addressLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 bg-surface-light dark:bg-surface-dark px-8 py-6 rounded-2xl shadow-lg"
          >
            <Loader2 className="w-8 h-8 text-primary-light dark:text-primary-dark animate-spin" />
            <p className="text-text-light dark:text-text-dark font-medium">
              Saving address...
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CheckoutForm;
