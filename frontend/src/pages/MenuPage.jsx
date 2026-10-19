// src/pages/MenuPage.jsx
import React, { useMemo, useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { SearchContext } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext";
import All from "../assets/Images/allimage.jpg";
import pizza from "../assets/Images/pizza1.png";
import burger from "../assets/Images/burger1.png";
import chinese from "../assets/Images/Chinese-Food-Download-Free-PNG.png";
import chicken from "../assets/Images/chicken.png";
import biryani from "../assets/Images/biryani.png";
import SkeletonCard from "../components/SkeletonCard";
import FoodCard from "../components/FoodItemCard";
import { useWishlist } from "../context/WishlistContext";
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  Star,
  Clock,
  ChevronDown,
  Heart,
} from "lucide-react";
import { showToast } from "../utils/showToast.jsx";

const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category");
  const { updateItemQuantity, removeFromCart, cartItems, addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [loadingAction, setLoadingAction] = useState(false);
  const { foodItems, loading } = useFood();
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [priceLimit, setPriceLimit] = useState(1000);
  const [minRating, setMinRating] = useState(0);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [addLoadingId, setAddLoadingId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const categories = [
    { name: "All", label: "All Items", image: All },
    { name: "Pizza", label: "Pizza", image: pizza },
    { name: "Burger", label: "Burger", image: burger },
    { name: "Chinese", label: "Chinese", image: chinese },
    { name: "Biryani", label: "Biryani", image: biryani },
    { name: "Chicken", label: "Chicken", image: chicken },
  ];

  // Sync category with URL
  useEffect(() => {
    if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
    }
  }, [categoryFromURL]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getItemQuantity = (id) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find((ci) => ci.foodId?._id === id);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    if (quickViewItem) {
      setQuantity(getItemQuantity(quickViewItem._id) || 0);
    }
  }, [quickViewItem, cartItems]);

  // Filtered & Sorted Foods
  const filteredResults = useMemo(() => {
    if (!foodItems || foodItems.length === 0) return [];
    let result = [...foodItems];

    const q = searchQuery ? searchQuery.trim().toLowerCase() : "";
    if (q) {
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    result = result.filter((item) => Number(item.price) <= Number(priceLimit));

    if (minRating > 0) {
      result = result.filter((item) => (Number(item.rating) || 4.2) >= minRating);
    }

    if (sortOrder === "asc") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortOrder === "desc") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortOrder === "rating") {
      result.sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    }

    return result;
  }, [foodItems, searchQuery, selectedCategory, priceLimit, minRating, sortOrder]);

  const hasActiveFilters =
    Boolean(searchQuery && searchQuery.trim().length > 0) ||
    selectedCategory !== "All" ||
    sortOrder !== "" ||
    priceLimit < 1000 ||
    minRating > 0;

  const activeFiltersCount = [
    Boolean(searchQuery && searchQuery.trim().length > 0),
    selectedCategory !== "All",
    Boolean(sortOrder),
    priceLimit < 1000,
    minRating > 0,
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    setSortOrder("");
    setPriceLimit(1000);
    setSelectedCategory("All");
    setMinRating(0);
    if (setSearchQuery) setSearchQuery("");
    setShowFilterModal(false);
    setSearchParams({});
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleAddToCart = async (food, fromModal = false) => {
    setLoadingAction(true);
    if (!fromModal && addLoadingId) return;
    if (fromModal && modalLoading) return;
    if (fromModal) setModalLoading(true);
    else setAddLoadingId(food._id);

    try {
      await addToCart(food);
      if (fromModal) setQuickViewItem(null);
    } catch (error) {
      console.error("Cart Error", error);
    } finally {
      setLoadingAction(false);
      if (fromModal) setModalLoading(false);
      else setAddLoadingId(null);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setLoadingAction(true);
    try {
      await updateItemQuantity(id, qty);
      setQuickViewItem(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleIncrease = async (item) => {
    setLoadingAction(true);
    const currentQty = getItemQuantity(item._id);
    await updateItemQuantity(item._id, currentQty + 1);
    showToast(`${item.name} added`, "success");
    setLoadingAction(false);
  };

  const handleDecrease = async (item) => {
    setLoadingAction(true);
    const currentQty = getItemQuantity(item._id);

    if (currentQty <= 1) {
      await removeFromCart(item._id);
      showToast(`${item.name} removed`, "info");
      setLoadingAction(false);
    } else {
      await updateItemQuantity(item._id, currentQty - 1);
      setLoadingAction(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-amber-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-amber-400" />);
      else stars.push(<FaRegStar key={i} className="text-neutral-400" />);
    }
    return <div className="flex items-center gap-1">{stars}</div>;
  };

  return (
    <div
      className={`min-h-screen pb-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      {loadingAction && <Loader />}

      <div className="max-w-7xl mx-auto pt-6 space-y-6">
        {/* ================= HEADER & CATEGORIES CARD ================= */}
        <div
          className={`rounded-2xl border p-5 sm:p-7 ${
            isDark
              ? "bg-[#161619] border-neutral-800"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-primary-light dark:text-primary-dark">
                Discover delicious flavors
              </h1>
              <p
                className={`mt-1 text-sm ${
                  isDark ? "text-neutral-400" : "text-gray-600"
                }`}
              >
                Browse categories, pick your favorites, and add to the cart. Enjoy the playful Yumigo experience.
              </p>
            </div>

            {/* Quick Filter Status Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                  isDark
                    ? "bg-neutral-800 border-neutral-700 text-neutral-300"
                    : "bg-gray-100 border-gray-200 text-gray-700"
                }`}
              >
                Category: <strong className="text-primary-light dark:text-primary-dark">{selectedCategory}</strong>
              </span>

              {priceLimit < 1000 && (
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                    isDark
                      ? "bg-neutral-800 border-neutral-700 text-neutral-300"
                      : "bg-gray-100 border-gray-200 text-gray-700"
                  }`}
                >
                  Max: <strong className="text-primary-light dark:text-primary-dark">₹{priceLimit}</strong>
                </span>
              )}

              {sortOrder && (
                <span
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${
                    isDark
                      ? "bg-neutral-800 border-neutral-700 text-neutral-300"
                      : "bg-gray-100 border-gray-200 text-gray-700"
                  }`}
                >
                  Sort:{" "}
                  <strong className="text-primary-light dark:text-primary-dark">
                    {sortOrder === "asc"
                      ? "Low to High"
                      : sortOrder === "desc"
                      ? "High to Low"
                      : "Rating"}
                  </strong>
                </span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 px-2 py-1 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* ================= CATEGORIES ROW ================= */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto py-3 px-2 scroll-smooth no-scrollbar">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryChange(cat.name)}
                    className="flex flex-col items-center gap-2 group flex-shrink-0 cursor-pointer p-1.5 focus:outline-none"
                  >
                    <div
                      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 transition-all duration-200 ${
                        isActive
                          ? "ring-2 ring-primary-light dark:ring-primary-dark ring-offset-2 ring-offset-white dark:ring-offset-[#161619]"
                          : "border border-gray-200 dark:border-neutral-700 group-hover:border-gray-400"
                      }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 dark:bg-neutral-800">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors ${
                        isActive
                          ? "text-primary-light dark:text-primary-dark font-bold"
                          : isDark
                          ? "text-neutral-300 group-hover:text-white"
                          : "text-gray-700 group-hover:text-black"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ================= CONTROLS & STATUS ROW ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
            Showing{" "}
            <span className="text-primary-light dark:text-primary-dark font-bold">
              {filteredResults.length}
            </span>{" "}
            {filteredResults.length === 1 ? "item" : "items"}
            {selectedCategory !== "All" && (
              <span className="text-gray-500 dark:text-neutral-400 font-normal"> in {selectedCategory}</span>
            )}
          </div>

          {/* Controls: Sort & Filter Button */}
          <div className="flex items-center gap-2">
            {/* Sort select */}
            <div
              className={`relative flex items-center px-3 py-2 rounded-xl border text-xs font-medium ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-200"
                  : "bg-white border-gray-200 text-gray-800 shadow-sm"
              }`}
            >
              <span className="text-gray-500 dark:text-neutral-400 mr-1.5 font-normal">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer pr-4"
              >
                <option value="" className={isDark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"}>
                  Default
                </option>
                <option value="asc" className={isDark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"}>
                  Price: Low to High
                </option>
                <option value="desc" className={isDark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"}>
                  Price: High to Low
                </option>
                <option value="rating" className={isDark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"}>
                  Top Rated
                </option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2 text-gray-400" />
            </div>

            {/* Filter modal toggle */}
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                activeFiltersCount > 0
                  ? "bg-primary-light dark:bg-primary-dark text-white border-transparent shadow-sm"
                  : isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-200 hover:border-neutral-700"
                  : "bg-white border-gray-200 text-gray-800 hover:bg-gray-50 shadow-sm"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-primary-light text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ================= FOOD GRID OR EMPTY STATE ================= */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <SkeletonCard key={idx} theme={theme} />
              ))}
            </div>
          ) : filteredResults && filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
              {filteredResults.map((item) => (
                <FoodCard
                  key={item._id}
                  item={item}
                  theme={theme}
                  getItemQuantity={getItemQuantity}
                  handleAddToCart={handleAddToCart}
                  handleIncrease={handleIncrease}
                  handleDecrease={handleDecrease}
                  setQuickViewItem={setQuickViewItem}
                  addLoadingId={addLoadingId}
                />
              ))}
            </div>
          ) : (
            /* Clean, Humanized Empty State */
            <div
              className={`py-16 px-6 text-center rounded-2xl border ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-white"
                  : "bg-white border-gray-200 text-gray-900 shadow-sm"
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center mb-3">
                <Search size={22} />
              </div>
              <h3 className="text-lg font-semibold">No food items found</h3>
              <p
                className={`mt-1 text-sm max-w-sm mx-auto ${
                  isDark ? "text-neutral-400" : "text-gray-600"
                }`}
              >
                No dishes match your selected filters. Try searching for something else or reset your filters.
              </p>

              <button
                onClick={handleClearFilters}
                className="mt-4 px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark hover:opacity-90 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= FILTER MODAL ================= */}
      {showFilterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-xl ${
              isDark
                ? "bg-[#18181b] border-neutral-800 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
              <h3 className="font-bold text-base">Filter & Sort</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryChange(cat.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        selectedCategory === cat.name
                          ? "bg-primary-light dark:bg-primary-dark text-white border-transparent shadow-sm font-semibold"
                          : isDark
                          ? "bg-neutral-900 border-neutral-700 text-neutral-300"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-gray-500 dark:text-neutral-400 uppercase tracking-wider font-semibold">
                    Max Price
                  </span>
                  <span className="font-bold text-primary-light dark:text-primary-dark">₹{priceLimit}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={priceLimit}
                  onChange={(e) => setPriceLimit(parseInt(e.target.value, 10))}
                  className="w-full accent-primary-light cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-gray-500 dark:text-neutral-400 mt-1">
                  <span>₹50</span>
                  <span>₹500</span>
                  <span>₹1000</span>
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                  Rating
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "All", val: 0 },
                    { label: "4.0★+", val: 4.0 },
                    { label: "4.5★+", val: 4.5 },
                  ].map((rt) => (
                    <button
                      key={rt.val}
                      onClick={() => setMinRating(rt.val)}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        minRating === rt.val
                          ? "bg-primary-light dark:bg-primary-dark text-white border-transparent font-bold shadow-sm"
                          : isDark
                          ? "bg-neutral-900 border-neutral-700 text-neutral-300"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {rt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between gap-3">
              <button
                onClick={handleClearFilters}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  isDark
                    ? "bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                    : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Clear All
              </button>

              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-xs font-semibold bg-primary-light dark:bg-primary-dark hover:opacity-90 text-white transition text-center cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= QUICK VIEW MODAL ================= */}
      {quickViewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setQuickViewItem(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-2xl rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? "bg-[#18181b] border-neutral-800 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
              <button
                onClick={() => toggleWishlist(quickViewItem)}
                aria-label={
                  isInWishlist(quickViewItem._id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                title={
                  isInWishlist(quickViewItem._id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <Heart
                  size={18}
                  className={
                    isInWishlist(quickViewItem._id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  }
                />
              </button>

              <button
                onClick={() => setQuickViewItem(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="w-full h-56 rounded-xl bg-gray-50 dark:bg-neutral-900 flex items-center justify-center p-4">
                <img
                  src={quickViewItem.image}
                  alt={quickViewItem.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                    {quickViewItem.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400">
                    <Clock size={12} />
                    <span>{quickViewItem.deliveryTime || "25–35 min"}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold">{quickViewItem.name}</h3>

                <div className="flex items-center gap-2">
                  {renderStars(quickViewItem.rating || 4.2)}
                  <span className="text-xs text-gray-500 dark:text-neutral-400">
                    ({quickViewItem.rating || 4.2})
                  </span>
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    isDark ? "text-neutral-400" : "text-gray-600"
                  }`}
                >
                  {quickViewItem.description ||
                    "Prepared fresh with quality ingredients and authentic taste."}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">
                    ₹{Number(quickViewItem.price).toLocaleString("en-IN")}
                  </div>

                  <div className="flex items-center gap-2">
                    {quantity > 0 && (
                      <div className="flex items-center border border-gray-300 dark:border-neutral-700 rounded-lg">
                        <button
                          onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm font-bold cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((p) => p + 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    )}

                    <button
                      disabled={modalLoading}
                      onClick={() =>
                        quantity > 0
                          ? handleQuantityChange(quickViewItem._id, quantity)
                          : handleAddToCart(quickViewItem, true)
                      }
                      className="px-4 py-2 rounded-lg bg-primary-light dark:bg-primary-dark hover:opacity-90 text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                    >
                      {modalLoading
                        ? "Saving..."
                        : quantity > 0
                        ? `Update Cart`
                        : `Add to Cart`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Filter Button on Mobile */}
      <button
        onClick={() => setShowFilterModal(true)}
        className="sm:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary-light dark:bg-primary-dark text-white text-xs font-semibold shadow-lg cursor-pointer"
      >
        <SlidersHorizontal size={15} />
        <span>Filter</span>
        {activeFiltersCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-white text-primary-light text-[10px] font-bold flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default MenuPage;
