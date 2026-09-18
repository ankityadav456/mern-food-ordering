import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  UtensilsCrossed,
  Star,
  Clock,
  Sparkles,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } =
    useWishlist();
  const { cartItems, addToCart, updateItemQuantity, removeFromCart } = useCart();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const getItemQuantity = (id) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find(
      (ci) => ci.foodId?._id === id || ci.foodId === id || ci._id === id
    );
    return item ? item.quantity : 0;
  };

  return (
    <div
      className={`min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-[#09090d] text-white" : "bg-[#faf8f5] text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-neutral-200 dark:border-neutral-800">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-orange-500 transition-colors mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  My Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {wishlistItems.length === 1
                    ? "1 favorite dish saved"
                    : `${wishlistItems.length} favorite dishes saved`}
                </p>
              </div>
            </div>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500 hover:bg-orange-600 text-white shadow-sm shadow-orange-500/20 transition-all cursor-pointer"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Explore Menu</span>
              </Link>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div
            className={`py-20 px-6 text-center rounded-3xl border ${
              isDark
                ? "bg-[#14141a] border-neutral-800"
                : "bg-white border-neutral-200 shadow-sm"
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Your Wishlist is Empty
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
              Explore our chef's signature creations and tap the heart icon on
              any dish to save it here for quick ordering.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Browse Menu</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            <AnimatePresence>
              {wishlistItems.map((dish) => {
                const dishId = (dish._id || dish.id)?.toString();
                const quantity = getItemQuantity(dishId);
                const rating =
                  Number(dish.rating) > 0
                    ? Number(dish.rating).toFixed(1)
                    : "4.5";

                return (
                  <motion.div
                    key={dishId}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
                      isDark
                        ? "bg-[#15151c] border-neutral-800 shadow-sm hover:border-neutral-700"
                        : "bg-white border-neutral-200/90 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Image Header */}
                    <div className="relative w-full h-48 overflow-hidden rounded-t-3xl bg-neutral-100/70 dark:bg-[#14141c] flex items-center justify-center p-3 border-b border-neutral-100 dark:border-neutral-800/80">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      />

                      {/* Category Tag (Top Left) */}
                      <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10">
                        {dish.category}
                      </span>

                      {/* Remove / Heart Button (Top Right) */}
                      <button
                        onClick={() => removeFromWishlist(dishId)}
                        aria-label={`Remove ${dish.name} from wishlist`}
                        title="Remove from Wishlist"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-sm cursor-pointer border border-neutral-200/50 dark:border-neutral-700/50 group/btn"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover/btn:scale-110 transition-transform" />
                      </button>

                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 font-semibold text-[11px] border border-white/10">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{rating}</span>
                        </div>

                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-neutral-200 text-[11px] border border-white/10">
                          <Clock className="w-3 h-3 text-neutral-300" />
                          <span>{dish.deliveryTime || "20-25 min"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-base line-clamp-1 group-hover:text-orange-500 transition-colors">
                          {dish.name}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                          {dish.description ||
                            "Freshly prepared with handpicked ingredients and authentic spices."}
                        </p>
                      </div>

                      {/* Price and Cart Actions */}
                      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-neutral-400 block -mb-0.5">
                            Price
                          </span>
                          <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                            ₹{Number(dish.price).toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* Cart Stepper or Add Button */}
                        {quantity > 0 ? (
                          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 rounded-xl px-2 py-1 text-orange-600 dark:text-orange-400">
                            <button
                              onClick={() => {
                                if (quantity === 1) {
                                  removeFromCart(dishId);
                                } else {
                                  updateItemQuantity(dishId, quantity - 1);
                                }
                              }}
                              className="w-6 h-6 rounded-lg bg-white dark:bg-neutral-800 flex items-center justify-center text-xs font-bold hover:bg-neutral-100 transition shadow-xs cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold min-w-4 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(dishId, quantity + 1)
                              }
                              className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold hover:bg-orange-600 transition shadow-xs cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(dish)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 active:scale-95 text-white shadow-sm shadow-orange-500/20 transition-all cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
