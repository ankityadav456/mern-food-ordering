import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import AddressModal from "../components/AddressModal";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, MapPin, CreditCard, Loader2, CheckCircle, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

const CheckoutForm = () => {
  const { cartItems = [], clearCart, getTotalPrice } = useCart();
  const { user, deleteAddress } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(null);

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("light")
  );

  useEffect(() => {
    if (user && user.address) setSelectedAddress(user.address);
  }, [user]);

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const CARD_OPTIONS = useMemo(
    () => ({
      style: {
        base: {
          fontSize: "16px",
          color: isDark ? "#FFFFFF" : "#1E1E1E",
          "::placeholder": { color: isDark ? "#CCCCCC" : "#666666" },
          fontFamily: "Poppins, sans-serif",
          iconColor: isDark ? "#FFD54F" : "#FF5722",
        },
        invalid: { color: "#FF4136" },
      },
    }),
    [isDark]
  );

  useEffect(() => {
    if (cartItems.length === 0) return;
    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post("/payment/create-payment-intent", {
          amount: (getTotalPrice() + 40) * 100,
        });
        setClientSecret(data.clientSecret);
      } catch (error) {
        setErrorMessage("Error with payment details. Try again.");
      }
    };
    fetchClientSecret();
  }, [cartItems, getTotalPrice]);

  const handlePlaceOrder = async () => {
    if (!stripe || !elements || !clientSecret || cartItems.length === 0 || !selectedAddress) {
      setErrorMessage("Please complete all details before proceeding.");
      return;
    }

    const { fullName, mobileNumber, roomNumber, street, city, state, pincode } = selectedAddress;
    if (!fullName || !mobileNumber || !roomNumber || !street || !city || !state || !pincode) {
      setErrorMessage("Please complete all address fields.");
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
          totalAmount: getTotalPrice(),
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

  const handleAddressAdded = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    setEditAddress(null);
  };


  const handleDeleteAddress = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This address will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF5722", // match your Yumigo theme
        cancelButtonColor: "#6B7280",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await deleteAddress();
        setSelectedAddress(null);

        Swal.fire({
          title: "Deleted!",
          text: "Your address has been removed.",
          icon: "success",
          confirmButtonColor: "#FF5722",
        });
      }
    } catch (error) {
      console.error("Error deleting address", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong while deleting the address.",
        icon: "error",
        confirmButtonColor: "#FF5722",
      });
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 mt-10 rounded-2xl shadow-xl 
      bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-[#333] 
      text-text-light dark:text-text-dark"
    >
      <h2 className="text-3xl font-bold text-center text-primary-light dark:text-primary-dark mb-8">
        Checkout
      </h2>

      {cartItems.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* 🛒 Cart Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-md border border-gray-200 dark:border-[#333]"
          >
            <h3 className="flex items-center gap-2 text-xl font-semibold text-primary-light dark:text-primary-dark mb-4">
              <ShoppingCart className="w-5 h-5" /> Your Order
            </h3>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <motion.div
                  key={item.foodId._id}
                  whileHover={{ translateY: -2 }}
                  className="flex justify-between items-center border-b pb-3 border-gray-200 dark:border-[#333]"
                >
                  <div>
                    <p className="font-medium">{item.foodId.name}</p>
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
            <div className="mt-6 border-t pt-4 space-y-1 border-gray-200 dark:border-[#333]">
              <p className="text-text-subtleLight dark:text-text-subtleDark">
                Subtotal: ₹{getTotalPrice()}
              </p>
              <p className="text-text-subtleLight dark:text-text-subtleDark">
                Delivery Fee: ₹40
              </p>
              <p className="text-lg font-bold text-primary-light dark:text-primary-dark">
                Total: ₹{getTotalPrice() + 40}
              </p>
            </div>
          </motion.div>

          {/* 📍 Address & Payment */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Address Section */}
            <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-md border border-gray-200 dark:border-[#333]">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-primary-light dark:text-primary-dark">
                <MapPin className="w-5 h-5" /> Delivery Address
              </h3>
              {selectedAddress ? (
                <div className="p-4 rounded-lg bg-background-light dark:bg-background-dark shadow-sm">
                  <p>{selectedAddress.fullName}</p>
                  <p>Mobile: {selectedAddress.mobileNumber}</p>
                  <p>
                    {selectedAddress.roomNumber}, {selectedAddress.street}
                  </p>
                  <p>
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>

                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => {
                        setEditAddress(selectedAddress);
                        setShowAddressModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-light dark:bg-primary-dark hover:opacity-90 text-white transition-all duration-200"
                    >
                      <Pencil size={18} /> Edit
                    </button>

                    <button
                      onClick={handleDeleteAddress}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>

                </div>
              ) : (
                <p className="text-text-subtleLight dark:text-text-subtleDark mb-4">
                  No address added yet.
                </p>
              )}

              {!selectedAddress ?
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="mt-3 px-5 py-2 rounded-xl bg-secondary-light dark:bg-secondary-dark text-black font-bold hover:opacity-90"
                >
                  {selectedAddress ? "Change Address" : "Add Address"}
                </button>
                : ""}
            </div>

            {/* Payment Section */}
            <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark shadow-md border border-gray-200 dark:border-[#333]">
              <h3 className="flex items-center gap-2 text-xl font-semibold mb-4 text-primary-light dark:text-primary-dark">
                <CreditCard className="w-5 h-5" /> Payment
              </h3>
              <div className="border rounded-xl p-4 bg-background-light dark:bg-background-dark">
                <CardElement options={CARD_OPTIONS} />
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-500 text-white text-center"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              {/* Back to Cart Button */}
              <button
                onClick={() => navigate("/cart")}
                className="w-1/2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
      bg-surface-light dark:bg-surface-dark 
      text-text-light dark:text-text-dark 
      font-medium shadow-md 
      hover:bg-gray-300 dark:hover:bg-[#444] 
      transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </button>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !clientSecret}
                className="w-1/2 flex items-center justify-center gap-2 px-6 py-3 
    rounded-xl bg-gradient-to-r from-[#FFD54F] to-[#FF5722]
    text-white font-semibold shadow-md
    hover:scale-105 disabled:opacity-60 
    transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>

            </div>

          </motion.div>
        </div>
      ) : (
        <p className="text-center text-text-subtleLight dark:text-text-subtleDark">
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
    </motion.div>
  );
};

export default CheckoutForm;
