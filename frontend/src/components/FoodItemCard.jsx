import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";

const FoodItemCard = ({
  item,
  theme,
  getItemQuantity,
  handleAddToCart,
  setQuickViewItem,
  addLoadingId,
}) => {
  const inCart = getItemQuantity(item._id) > 0;

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative rounded-2xl border transition-all overflow-hidden
        ${inCart
          ? theme === "dark"
            ? "border-primary-dark shadow-[0_0_5px_rgba(255,87,34,0.6)]"
            : "border-primary-light shadow-[0_0_5px_rgba(255,87,34,0.4)]"
          : theme === "dark"
            ? "bg-[#121212] border-[#2C2C2C] hover:border-primary-dark hover:shadow-[0_0_10px_rgba(255,87,34,0.25)]"
            : "bg-[#FAFAFA] border-gray-200 hover:border-primary-light hover:shadow-[0_0_10px_rgba(255,87,34,0.2)]"
        }`}
    >
      {/* Quantity Badge */}
      {inCart && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute top-2 right-2 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md bg-primary-light dark:bg-primary-dark text-white"
        >
          {getItemQuantity(item._id)}
        </motion.div>
      )}

      {/* Image */}
      <motion.img
        src={item.image}
        alt={item.name}
        className="p-3 w-full h-44 object-cover rounded-md pb-0 transition-transform duration-500 group-hover:scale-105"
        whileHover={{ rotate: 1 }}
      />

      {/* Content */}
      <div className="p-3">
        <h3
          className={`text-lg font-bold truncate ${theme === "dark" ? "text-primary-dark" : "text-primary-light"
            }`}
        >
          {item.name}
        </h3>
        <p
          className={`text-md font-semibold ${theme === "dark" ? "text-white" : "text-black"
            }`}
        >
          ₹{item.price.toLocaleString("en-IN")}
        </p>
        <p
          className={`text-xs mt-1 font-semibold ${item.category === "Vegetarian"
            ? "text-green-500"
            : item.category === "Non-Vegetarian"
              ? "text-red-500"
              : theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
        >
          {item.category}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) =>
            i < Math.floor(item.rating || 4.5) ? (
              <FaStar key={i} className="text-yellow-400" />
            ) : (
              <FaRegStar key={i} className="text-yellow-400" />
            )
          )}
        </div>

        <p
          className={`text-xs mt-1 flex items-center gap-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
        >
          ⏱ {item.deliveryTime || "25-35 mins"}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setQuickViewItem(item)}
            className={`flex-1 py-2 rounded-lg font-semibold ${theme === "dark"
              ? "bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]"
              : "bg-[#F5F5F5] text-black hover:bg-[#FFE0B2]"
              }`}
          >
            Quick View
          </motion.button>

          <motion.button
            whileHover={{ scale: inCart ? 1 : 1.05 }}
            whileTap={{ scale: inCart ? 1 : 0.95 }}
            onClick={() => !inCart && handleAddToCart(item)}
            disabled={addLoadingId === item._id || inCart}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors duration-200
    ${addLoadingId === item._id || inCart
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white hover:opacity-90"
              }`}
          >
            {addLoadingId === item._id
              ? "Adding..."
              : inCart
                ? "In Cart"
                : "Add"}
          </motion.button>

        </div>
      </div>
    </motion.div>
  );
};

export default FoodItemCard;
