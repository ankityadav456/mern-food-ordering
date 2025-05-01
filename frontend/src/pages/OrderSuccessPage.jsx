import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/menu"); // Redirect to menu for more items
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center py-10">
      <motion.div
        className="max-w-2xl w-full bg-[#222] text-white p-8 rounded-2xl shadow-2xl border border-[#FFD700]/30"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-center">
          {/* Success Icon */}
          <motion.div
            className="mx-auto mb-6 p-6 rounded-full bg-[#FFD700] text-black inline-block"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M16.293 5.293a1 1 0 00-1.414 0L7 12.586 4.121 9.707a1 1 0 00-1.414 1.414l3.5 3.5a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>

          {/* Success Message */}
          <motion.h2
            className="text-4xl font-semibold text-[#FFD700] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Order Placed Successfully!
          </motion.h2>

          <motion.p
            className="text-lg text-white mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Your order is confirmed. Thank you for choosing us! You can continue shopping or track your order.
          </motion.p>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={handleContinueShopping}
              className="bg-[#FFD700] hover:bg-[#e6c200] transition-all duration-300 text-black font-bold py-3 px-8 rounded-xl text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              Continue Shopping
            </motion.button>

            <motion.button
              onClick={() => navigate("/orders")}
              className="bg-[#8B0000] hover:bg-[#a00000] transition-all duration-300 text-white font-bold py-3 px-8 rounded-xl text-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              View My Orders
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
