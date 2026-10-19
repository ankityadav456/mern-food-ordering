// src/pages/WishlistPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowLeft,
  UtensilsCrossed,
  Star,
  Clock,
  ArrowRight,
  Check,
  ShoppingBag,
  Sparkles,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../utils/showToast.jsx";

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, loading } =
    useWishlist();
  const { addToCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [movingId, setMovingId] = useState(null);
  const [movingAll, setMovingAll] = useState(false);

  // Move a single item from Wishlist to Cart
  const handleMoveToCart = async (dish) => {
    if (!user?._id) {
      if (openAuthModal) openAuthModal("login");
      showToast("Please sign in to add items to cart", "info");
      return;
    }

    const dishId = (dish._id || dish.id)?.toString();
    if (!dishId) return;

    setMovingId(dishId);
    try {
      await addToCart(dish, false);
      await removeFromWishlist(dishId, false);
      showToast(`${dish.name || "Item"} moved to cart!`, "success");
    } catch (error) {
      console.error("Error moving item to cart:", error);
      showToast("Failed to move item to cart", "error");
    } finally {
      setMovingId(null);
    }
  };

  // Move all items from Wishlist to Cart
  const handleMoveAllToCart = async () => {
    if (!user?._id) {
      if (openAuthModal) openAuthModal("login");
      showToast("Please sign in to move items to cart", "info");
      return;
    }

    if (wishlistItems.length === 0) return;

    setMovingAll(true);
    try {
      for (const dish of wishlistItems) {
        await addToCart(dish, false);
      }
      await clearWishlist(false);
      showToast("All items moved to cart successfully!", "success");
    } catch (error) {
      console.error("Error moving all items to cart:", error);
      showToast("Failed to move all items to cart", "error");
    } finally {
      setMovingAll(false);
    }
  };

  return (
    <div
      className={`min-h-[85vh] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-[#09090d] text-white" : "bg-[#fdfbf7] text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80 dark:border-neutral-800">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-orange-500 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-red-500/10 dark:bg-red-500/20 text-red-500 flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 fill-red-500 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  My Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {wishlistItems.length === 0
                    ? "No saved dishes yet"
                    : wishlistItems.length === 1
                    ? "1 favorite dish saved"
                    : `${wishlistItems.length} favorite dishes saved`}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons (Move All, Clear All, Explore) */}
          {wishlistItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Move All to Cart */}
              <button
                onClick={handleMoveAllToCart}
                disabled={movingAll}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                title="Add all wishlist items into cart and clear wishlist"
              >
                {movingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Moving All...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Move All to Cart ({wishlistItems.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Clear Wishlist */}
              <button
                onClick={clearWishlist}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-red-200 dark:border-red-900/50 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              {/* Browse Menu */}
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Menu</span>
              </Link>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div
            className={`py-16 sm:py-20 px-6 text-center rounded-3xl border ${
              isDark
                ? "bg-[#14141a] border-neutral-800"
                : "bg-white border-neutral-200/90 shadow-sm"
            }`}
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 dark:bg-red-500/15 text-red-500 flex items-center justify-center mb-5 shadow-inner">
              <Heart className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mt-2 leading-relaxed">
              Explore our menu and tap the heart icon on any dish to save it here. You can then quickly move your favorites straight to your cart anytime!
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore Menu</span>
              </Link>
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>View Cart</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
            <AnimatePresence>
              {wishlistItems.map((dish) => {
                const dishId = (dish._id || dish.id)?.toString();
                const rating =
                  Number(dish.rating) > 0
                    ? Number(dish.rating).toFixed(1)
                    : "4.5";
                const isMoving = movingId === dishId;

                return (
                  <motion.div
                    key={dishId}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92, y: 10 }}
                    transition={{ duration: 0.22 }}
                    className={`rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
                      isDark
                        ? "bg-[#14141a] border-neutral-800/90 hover:border-neutral-700 shadow-sm"
                        : "bg-white border-neutral-200/80 shadow-sm hover:shadow-md"
                    }`}
                  >
                    {/* Image Header */}
                    <div className="relative w-full h-48 sm:h-52 overflow-hidden rounded-t-3xl bg-neutral-100 dark:bg-neutral-900/60 flex items-center justify-center p-3 border-b border-neutral-100 dark:border-neutral-800/80">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      />

                      {/* Category Tag (Top Left) */}
                      <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white border border-white/10 shadow-sm">
                        {dish.category}
                      </span>

                      {/* Remove / Heart Button (Top Right) */}
                      <button
                        onClick={() => removeFromWishlist(dishId)}
                        aria-label={`Remove ${dish.name} from wishlist`}
                        title="Remove from Wishlist"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-md cursor-pointer border border-neutral-200/50 dark:border-neutral-700/50 group/btn"
                      >
                        <Heart className="w-4 h-4 fill-red-500 text-red-500 group-hover/btn:scale-110 transition-transform" />
                      </button>

                      {/* Bottom Info Bar: Rating & Delivery Time */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-amber-300 font-semibold text-[11px] border border-white/10 shadow-sm">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{rating}</span>
                        </div>

                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md text-neutral-200 text-[11px] border border-white/10 shadow-sm">
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

                      {/* Price & Move to Cart Button */}
                      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-neutral-400 block -mb-0.5">
                            Price
                          </span>
                          <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                            ₹{Number(dish.price).toLocaleString("en-IN")}
                          </span>
                        </div>

                        {/* MOVE TO CART Button */}
                        <button
                          onClick={() => handleMoveToCart(dish)}
                          disabled={isMoving}
                          className="flex items-center justify-center gap-1.5 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-white shadow-sm shadow-orange-500/20 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                          title="Add item to cart and remove from wishlist"
                        >
                          {isMoving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span className="whitespace-nowrap">Moving...</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 shrink-0" />
                              <span className="whitespace-nowrap">Move to Cart</span>
                            </>
                          )}
                        </button>
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
