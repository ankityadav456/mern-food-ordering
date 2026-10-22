import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, Heart, ShoppingBag, Minus, Plus } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";

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
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(item._id);
  const isDark = theme === "dark";

  const rating = Number(item.rating) > 0 ? Number(item.rating).toFixed(1) : "4.5";
  const quantity = getItemQuantity(item._id);

  const isVeg =
    item.isVeg !== undefined
      ? item.isVeg
      : ["Pizza", "Chinese", "Burger"].includes(item.category) &&
        !item.name?.toLowerCase().includes("chicken") &&
        !item.name?.toLowerCase().includes("meat") &&
        !item.name?.toLowerCase().includes("mutton") &&
        !item.name?.toLowerCase().includes("fish");

  const originalPrice = item.originalPrice || Math.round(Number(item.price) * 1.25);
  const discountPercent = Math.round(
    ((originalPrice - item.price) / originalPrice) * 100
  );
  const prepTime =
    item.deliveryTime ||
    (item.category === "Burger"
      ? "15 min"
      : item.category === "Pizza"
      ? "18 min"
      : "22 min");

  return (
    <div
      onClick={() => navigate(`/food/${item._id}`)}
      className="rounded-2xl overflow-hidden bg-white dark:bg-[#15151c] border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer active:scale-[0.99]"
    >
      {/* Food Image Container - with Menu Page Background Gradient */}
      <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-2 sm:p-3 border-b border-gray-200/80 dark:border-neutral-800/80">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 active:scale-95 transition-transform duration-300 pointer-events-none select-none"
        />

        {/* Soft bottom background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />

        {/* Wishlist Heart Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(item);
          }}
          aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
          title={isFav ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2 right-2 z-20 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/75 dark:bg-black/50 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-xs cursor-pointer border border-white/60 dark:border-white/10"
        >
          <Heart
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${
              isFav ? "fill-red-500 text-red-500" : "text-neutral-600 dark:text-neutral-300"
            }`}
          />
        </button>

        {/* Clean Modern Blurry Transparent Bottom Overlay Info (Time & Rating) */}
        <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2.5 right-1.5 sm:right-2.5 z-20 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-200 text-[9px] sm:text-[10px] font-medium border border-white/60 dark:border-white/10 shadow-xs">
            <Clock className="w-2.5 h-2.5 text-neutral-400 dark:text-neutral-400" />
            <span>{prepTime}</span>
          </div>

          <div className="flex items-center gap-1 bg-white/80 dark:bg-black/60 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full text-amber-500 dark:text-amber-400 text-[9px] sm:text-[10px] font-bold border border-white/60 dark:border-white/10 shadow-xs">
            <Star className="w-2.5 h-2.5 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Veg/Non-Veg Badge */}
          <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-1.5">
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 truncate">
              {item.category}
            </span>

            {/* Indian Veg / Non-Veg Icon */}
            <div
              className="flex items-center gap-1 flex-shrink-0"
              title={isVeg ? "Vegetarian" : "Non-Vegetarian"}
            >
              <span
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 border flex items-center justify-center p-0.5 rounded-xs ${
                  isVeg ? "border-emerald-600" : "border-red-600"
                }`}
              >
                <span
                  className={`w-1 h-1 rounded-full ${
                    isVeg ? "bg-emerald-600" : "bg-red-600"
                  }`}
                />
              </span>
              <span className="text-[9px] sm:text-[10px] text-neutral-400 font-medium">
                {isVeg ? "Veg" : "Non-Veg"}
              </span>
            </div>
          </div>

          {/* Dish Title */}
          <h3
            className="text-xs sm:text-base font-bold text-neutral-900 dark:text-white leading-snug truncate"
            title={item.name}
          >
            {item.name}
          </h3>
        </div>

        {/* Pricing & Add to Cart */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-1.5 sm:gap-2"
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-lg font-black text-neutral-900 dark:text-white">
                ₹{item.price}
              </span>
              <span className="text-[10px] sm:text-[11px] text-neutral-400 line-through truncate">
                ₹{originalPrice}
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block truncate">
              {discountPercent}% OFF
            </span>
          </div>

          {/* Dynamic Cart Quantity Stepper or Add to Order Button */}
          {quantity > 0 ? (
            <div className="flex items-center bg-orange-600 dark:bg-orange-500 text-white rounded-xl shadow-xs p-0.5 shrink-0">
              <button
                onClick={() => handleDecrease(item)}
                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg hover:bg-black/20 transition-colors cursor-pointer active:scale-95"
                aria-label="Decrease quantity"
              >
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
              <span className="w-5 sm:w-6 text-center text-[11px] sm:text-xs font-black select-none">
                {quantity}
              </span>
              <button
                onClick={() => handleIncrease(item)}
                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-lg hover:bg-black/20 transition-colors cursor-pointer active:scale-95"
                aria-label="Increase quantity"
              >
                <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart(item)}
              disabled={addLoadingId === item._id}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl font-bold text-[11px] sm:text-xs text-white transition-all flex items-center justify-center gap-1 shadow-xs active:scale-95 cursor-pointer shrink-0 ${
                addLoadingId === item._id
                  ? "bg-neutral-400 cursor-not-allowed"
                  : "bg-primary-light dark:bg-primary-dark hover:opacity-95"
              }`}
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="hidden min-[420px]:inline">
                {addLoadingId === item._id ? "Adding..." : "Add To Order"}
              </span>
              <span className="min-[420px]:hidden">
                {addLoadingId === item._id ? "..." : "Add"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
