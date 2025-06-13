import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useMemo } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const { cartItems = [], clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // Track dark mode (Tailwind 'dark' class on <html>)
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkModeActive = document.documentElement.classList.contains("dark");
      setIsDark(darkModeActive);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const CARD_OPTIONS = useMemo(() => ({
    style: {
      base: {
        fontSize: "16px",
        color: isDark ? "#f1f1f1" : "#000",
        // backgroundColor: isDark ? "#111" : "#fff",  // Stripe doesn't officially support backgroundColor here, but no harm including
        "::placeholder": {
          color: isDark ? "#aaa" : "#888",
        },
        fontFamily: "Arial, sans-serif",
        iconColor: isDark ? "#FFD700" : "#B22222",
      },
      invalid: {
        color: "#FF4136",
      },
    },
  }), [isDark]);

  useEffect(() => {
    if (cartItems.length === 0) return;

    const fetchClientSecret = async () => {
      try {
        const { data } = await axios.post("/payment/create-payment-intent", {
          amount: (getTotalPrice() + 40) * 100,
        });
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error fetching client secret", error);
        setErrorMessage("There was an issue with your payment details. Please try again.");
      }
    };

    fetchClientSecret();
  }, [cartItems, getTotalPrice]);

  const handlePlaceOrder = async () => {
    if (!stripe || !elements || !clientSecret || cartItems.length === 0) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        setErrorMessage("Payment failed. Please check your card details or try again.");
        console.error(error);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await axios.post("/orders", {
          items: cartItems.map((item) => ({
            foodId: item.foodId._id,
            quantity: item.quantity,
          })),
          totalAmount: getTotalPrice(),
        });

        clearCart();
        navigate("/order-success");
      }
    } catch (err) {
      setErrorMessage("An error occurred while processing your order. Please try again.");
      console.error("Order error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto p-6 rounded-2xl shadow-2xl border m-10 mx-12
                 bg-white border-gray-200 text-black 
                 dark:bg-[#111] dark:border-[#FFD700]/30 dark:text-white"
    >
      <h2 className="text-3xl font-bold text-[#B22222] dark:text-[#FFD700] mb-6">Checkout</h2>

      {cartItems.length > 0 ? (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.foodId._id}
                className="flex justify-between items-center border-b pb-4
                           border-gray-300 dark:border-[#333]"
              >
                <div>
                  <h3 className="text-xl font-semibold">{item.foodId.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-[#B22222] dark:text-[#FFD700] font-bold text-lg">
                  ₹{item.foodId.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-6 border-t pt-4 text-right space-y-1
                       border-gray-300 dark:border-[#333]"
          >
            <p className="text-base">Subtotal: ₹{getTotalPrice()}</p>
            <p className="text-base">Delivery Charge: ₹40</p>
            <p className="text-xl font-bold text-[#B22222] dark:text-[#FFD700]">
              Total: ₹{getTotalPrice() + 40}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold text-[#B22222] dark:text-[#FFD700] mb-4">
              Enter Payment Details
            </h3>
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-[#222] dark:border-[#444]">
              <form>
                <CardElement options={CARD_OPTIONS} />
              </form>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-500 text-white rounded-xl">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="mt-6 flex flex-row space-x-4">
            <button
              onClick={() => navigate("/cart")}
              className="w-1/2 bg-gray-200 hover:bg-gray-300 text-black 
                         dark:bg-[#333] dark:hover:bg-[#444] dark:text-white 
                         font-bold py-3 px-6 rounded-xl text-lg"
            >
              Back to Cart
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !clientSecret}
              className="w-1/2 bg-[#B22222] hover:bg-[#a00000] text-white 
                         font-bold py-3 px-6 rounded-xl text-lg"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      ) : (
        <p className="text-center mt-10 dark:text-white">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CheckoutForm;
