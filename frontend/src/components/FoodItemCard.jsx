// File: components/FoodCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5)
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
  }
  return <div className="flex items-center gap-1 mt-1">{stars}</div>;
};

const FoodCard = ({ item, getItemQuantity, theme, onQuickView, onAddToCart, loading }) => {
  const inCart = getItemQuantity(item._id) > 0;

  if (loading) {
    return (
      <div className="animate-pulse border rounded-xl shadow-md p-3 bg-white dark:bg-[#121212]">
        <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 rounded-md mb-3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          ))}
        </div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mt-2"></div>
        <div className="flex gap-2 mt-4">
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="flex-1 h-10 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={item._id}
      className={`relative border rounded-xl shadow-md transition-all duration-300 ${
        inCart
          ? "border-[#FFD700] shadow-[#FFD700]/40"
          : theme === "dark"
          ? "bg-[#121212] border-[#D4AF37]/10 hover:shadow-[#FFD700]/30"
          : "bg-white border-gray-200 hover:shadow-lg"
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {inCart && (
        <div className="absolute top-2 right-2 bg-[#FFD700] text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
          {getItemQuantity(item._id)}
        </div>
      )}
      <img
        src={item.image}
        alt={item.name}
        className="p-3 w-full h-44 object-cover rounded-md mb-3"
      />
      <div className="p-3">
        <h3 className="text-lg font-bold text-[#FFD700] truncate">{item.name}</h3>
        <p
          className={`text-md font-semibold ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          ₹{item.price.toLocaleString("en-IN")}
        </p>
        <p
          className={`text-xs mt-1 font-semibold ${
            item.category === "Vegetarian"
              ? "text-green-500"
              : item.category === "Non-Vegetarian"
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {item.category}
        </p>
        {renderStars(item.rating || 4.5)}
        <p className="text-xs text-gray-500 mt-1">
          ⏱ {item.deliveryTime || "25-35 mins"}
        </p>
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onQuickView(item)}
            className="flex-1 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
          >
            Quick View
          </button>
          <button
            disabled={inCart}
            onClick={() => onAddToCart(item)}
            className={`flex-1 py-2 rounded-lg font-semibold hover:opacity-90 ${
              inCart
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-[#FFD700] to-[#8B0000] text-black"
            }`}
          >
            {inCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FoodCard;