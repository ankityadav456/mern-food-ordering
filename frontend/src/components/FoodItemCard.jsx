import React from "react";
import { Star, Clock, Eye, ShoppingCart, Heart } from "lucide-react";
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
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFav = isInWishlist(item._id);
  const inCart = getItemQuantity(item._id) > 0;
  const isDark = theme === "dark";

  const rating = Number(item.rating) > 0 ? Number(item.rating).toFixed(1) : "4.5";
  const quantity = getItemQuantity(item._id);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-300 group ${
        isDark
          ? "bg-[#1E1E1E] border-[#2C2C2C] hover:shadow-xl hover:shadow-black/40"
          : "bg-white border-gray-200 hover:shadow-lg"
      }`}
    >
      {/* Top Left: Wishlist Heart */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(item);
        }}
        aria-label={isFav ? "Remove from wishlist" : "Add to wishlist"}
        title={isFav ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-2.5 left-2.5 z-20 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-sm ${
          isFav
            ? "bg-red-500/20 text-red-500 border border-red-500/40"
            : "bg-black/40 hover:bg-black/60 text-white border border-white/10"
        }`}
      >
        <Heart
          size={13}
          className={isFav ? "fill-red-500 text-red-500" : "text-white"}
        />
      </button>

      {/* Top Right: In-Cart Count Badge */}
      {inCart && (
        <div className="absolute top-2.5 right-2.5 z-20 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md bg-orange-500 text-white">
          {quantity}
        </div>
      )}

      {/* Food Image Container with Old UI Gray Background & Soft Gradient */}
      <div className="relative w-full h-44 overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-2">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-95"
        />

        {/* Soft bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

        {/* Rating Badge (Bottom Left) */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold bg-black/70 text-yellow-400 backdrop-blur pointer-events-none">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3
          title={item.name}
          className={`text-lg font-semibold truncate ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {item.name}
        </h3>

        {/* Price on Left, Category on Right */}
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg text-orange-500">
            ₹{Number(item.price).toLocaleString("en-IN")}
          </p>

          <span
            className={`text-xs font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {item.category}
          </span>
        </div>

        {/* Delivery Time with Clock Icon */}
        <div
          className={`flex items-center gap-1 text-xs ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <Clock size={14} />
          <span>{item.deliveryTime || "25–35 mins"}</span>
        </div>
      </div>

      {/* Card Action Buttons: View on Left, Add / Stepper on Right */}
      <div
        className={`flex items-center gap-3 px-3 py-3 border-t ${
          isDark ? "border-[#2C2C2C]" : "border-gray-200"
        }`}
      >
        <button
          onClick={() => setQuickViewItem(item)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
            isDark
              ? "bg-[#2A2A2A] text-white hover:bg-[#353535]"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
        >
          <Eye size={15} />
          <span>View</span>
        </button>

        {quantity > 0 ? (
          <div
            className={`flex items-center justify-between px-3 flex-1 py-2 rounded-xl ${
              isDark ? "bg-[#2A2A2A] text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <button
              onClick={() => handleDecrease(item)}
              className="text-base font-bold px-1 hover:text-orange-500 cursor-pointer"
            >
              −
            </button>

            <span className="font-semibold text-sm">{quantity}</span>

            <button
              onClick={() => handleIncrease(item)}
              className="text-base font-bold px-1 hover:text-orange-500 cursor-pointer"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleAddToCart(item)}
            disabled={addLoadingId === item._id}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer ${
              addLoadingId === item._id
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90 active:scale-95"
            }`}
          >
            <ShoppingCart size={15} />
            <span>{addLoadingId === item._id ? "Adding..." : "Add"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FoodItemCard;
