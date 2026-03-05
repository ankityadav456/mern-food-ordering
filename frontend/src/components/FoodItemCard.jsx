// src/components/FoodItemCard.jsx
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
  const isDark = theme === "dark";

  return (
    <motion.div
      layout
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-md transition-all duration-300
  ${isDark
          ? "bg-[#1E1E1E]/90 border-[#2C2C2C] shadow-sm hover:shadow-lg hover:shadow-black/30"
          : "bg-white border-gray-200 shadow-sm hover:shadow-md"
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
        className="w-full h-44 object-cover rounded-t-2xl transition-transform duration-700 hover:scale-105"
        loading="lazy"
      />

      {/* Content */}
      <div className="p-4 flex flex-col gap-1">
        <motion.h3
          layout
          className={`text-lg font-semibold truncate ${isDark ? "text-white" : "text-gray-900"
            }`}
        >
          {item.name}
        </motion.h3>

        <div className="flex items-center justify-between mt-1">
          <p
            className={`font-bold ${isDark ? "text-primary-dark" : "text-primary-light"
              }`}
          >
            ₹{item.price.toLocaleString("en-IN")}
          </p>
          <p
            className={`text-xs font-medium ${item.category === "Vegetarian"
                ? "text-green-500"
                : item.category === "Non-Vegetarian"
                  ? "text-red-500"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
          >
            {item.category}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) =>
            i < Math.floor(item.rating || 4.5) ? (
              <FaStar key={i} className="text-yellow-400 text-sm" />
            ) : (
              <FaRegStar key={i} className="text-yellow-400 text-sm" />
            )
          )}
        </div>

        <p
          className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"
            }`}
        >
          ⏱ {item.deliveryTime || "25–35 mins"}
        </p>
      </div>

      {/* Bottom Action Buttons */}
      <div
        className={`flex items-center gap-2 px-4 py-3 border-t backdrop-blur-lg
          ${isDark ? "border-[#2C2C2C]" : "border-gray-200"}`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setQuickViewItem(item)}
          className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all duration-200
            ${isDark
              ? "bg-[#2A2A2A]/80 text-white hover:bg-[#353535]/90"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
        >
          Quick View
        </motion.button>

        <motion.button
          whileHover={{ scale: inCart ? 1 : 1.05 }}
          whileTap={{ scale: inCart ? 1 : 0.95 }}
          onClick={() => !inCart && handleAddToCart(item)}
          disabled={addLoadingId === item._id || inCart}
          className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm
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
    </motion.div>
  );
};

export default FoodItemCard;
