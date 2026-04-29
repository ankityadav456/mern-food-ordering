import React from "react";
import { motion } from "framer-motion";
import { Star, StarHalf, Clock, Eye, ShoppingCart } from "lucide-react";

const FoodItemCard = ({
  item,
  theme,
  getItemQuantity,
  handleAddToCart,
  handleIncrease,
  handleDecrease,
  setQuickViewItem,
  addLoadingId,
}) => {
  const inCart = getItemQuantity(item._id) > 0;
  const isDark = theme === "dark";

  const rating = item.rating || 4.5;
  const quantity = getItemQuantity(item._id);

  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group
      ${
        isDark
          ? "bg-[#1E1E1E] border-[#2C2C2C] hover:shadow-xl hover:shadow-black/40"
          : "bg-white border-gray-200 hover:shadow-lg"
      }`}
    >
      {inCart && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-md bg-primary-light dark:bg-primary-dark text-white z-20"
        >
          {getItemQuantity(item._id)}
        </motion.div>
      )}

      <div className="relative w-full h-44 overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <motion.img
          src={`${import.meta.env.VITE_API_URL}${item.image}`}
          alt={item.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-95"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-black/70 text-yellow-400 backdrop-blur">
          <Star className="w-3 h-3 fill-yellow-400" />
          {rating}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <h3
          className={`text-lg font-semibold truncate ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {item.name}
        </h3>

        <div className="flex items-center justify-between">
          <p
            className={`font-bold text-lg ${
              isDark ? "text-primary-dark" : "text-primary-light"
            }`}
          >
            ₹{item.price.toLocaleString("en-IN")}
          </p>

          <span
            className={`text-xs font-medium ${
              item.category === "Vegetarian"
                ? "text-green-500"
                : item.category === "Non-Vegetarian"
                  ? "text-red-500"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
            }`}
          >
            {item.category}
          </span>
        </div>

            

        <div
          className={`flex items-center gap-1 text-xs ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Clock size={14} />
          {item.deliveryTime || "25–35 mins"}
        </div>
      </div>

      <div
        className={`flex items-center gap-3 px-2 py-3 border-t
  ${isDark ? "border-[#2C2C2C]" : "border-gray-200"}`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setQuickViewItem(item)}
          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-medium transition
    ${
      isDark
        ? "bg-[#2A2A2A] text-white hover:bg-[#353535]"
        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
    }`}
        >
          <Eye size={16} />
          View
        </motion.button>

        {quantity > 0 ? (
          <div
            className={`flex items-center justify-center gap-3 flex-1 py-2 rounded-xl
      ${isDark ? "bg-[#2A2A2A] text-white" : "bg-gray-100 text-gray-900"}`}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDecrease(item)}
              className="text-lg font-bold px-2 hover:text-primary-light"
            >
              -
            </motion.button>

            <span className="font-semibold text-sm">{quantity}</span>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => handleIncrease(item)}
              className="text-lg font-bold px-2 hover:text-primary-light"
            >
              +
            </motion.button>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAddToCart(item)}
            disabled={addLoadingId === item._id}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-sm font-semibold transition shadow-sm
      ${
        addLoadingId === item._id
          ? "bg-gray-400 text-white cursor-not-allowed"
          : "bg-gradient-to-r from-primary-light to-secondary-light dark:from-primary-dark dark:to-secondary-dark text-white hover:opacity-90"
      }`}
          >
            <ShoppingCart size={16} />
            {addLoadingId === item._id ? "Adding..." : "Add"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default FoodItemCard;
