// src/pages/MenuPage.jsx
import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { useFood } from "../context/FoodContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { SearchContext } from "../context/SearchContext";
import { ChevronDownIcon, XMarkIcon,XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
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
import { SlidersHorizontal, ArrowDownAZ } from "lucide-react";
const MenuPage = () => {
  const { updateItemQuantity } = useCart();
  const [loading1, setLoading1] = useState(false);
  const { foodItems, loading, setLoading } = useFood();
  const { searchQuery } = useContext(SearchContext);
  const { cartItems, addToCart } = useCart();
  const { theme } = useTheme();

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [priceLimit, setPriceLimit] = useState(1000);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [addLoadingId, setAddLoadingId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const didInitialRender = useRef(false);

  const categories = [
    { name: "All", image: All },
    { name: "Pizza", image: pizza },
    { name: "Burger", image: burger },
    { name: "Chinese", image: chinese },
    { name: "Biryani", image: biryani },
    { name: "Chicken", image: chicken },
  ];

  // filtered results (memoized)
  const filteredResults = useMemo(() => {
    if (!foodItems || foodItems.length === 0) return [];
    let result = [...foodItems];

    const q = searchQuery ? searchQuery.trim().toLowerCase() : "";
    if (q) {
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }
    result = result.filter((item) => Number(item.price) <= Number(priceLimit));
    if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [foodItems, searchQuery, selectedCategory, priceLimit, sortOrder]);

  useEffect(() => {
    if (foodItems && foodItems.length > 0) {
      setFilteredFoods(filteredResults);
    }
  }, [filteredResults, foodItems]);

  useEffect(() => {
    if (quickViewItem) {
      setQuantity(getItemQuantity(quickViewItem._id) || 0);
    }
  }, [quickViewItem, cartItems]);

  const handleSortChange = (value) => setSortOrder(value);
  const handlePriceChange = (e) => setPriceLimit(parseInt(e.target.value, 10));
  const handleCategoryChange = (cat) => setSelectedCategory(cat);
  const handleClearFilters = () => {
    setSortOrder("");
    setPriceLimit(1000);
    setSelectedCategory("All");
    setShowFilterModal(false);
  };

  const getItemQuantity = (id) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find((ci) => ci.foodId?._id === id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = async (food, fromModal = false) => {
    if (!fromModal && addLoadingId) return;
    if (fromModal && modalLoading) return;
    if (fromModal) setModalLoading(true);
    else setAddLoadingId(food._id);

    try {
      await addToCart(food);
      setQuickViewItem(null);
      // toast.success(`${food.name} added to cart`);
    } catch (error) {
      console.error("Cart Error", error);
      // toast.error("Failed to add item to cart.");
    } finally {
      if (fromModal) setModalLoading(false);
      else setAddLoadingId(null);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setLoading1(true);
    try {
      await updateItemQuantity(id, qty);
      setQuickViewItem(null);
      // toast.success("Quantity updated");
    } catch (err) {
      // toast.error("Failed to update quantity");
    } finally {
      setLoading1(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex items-center gap-1 mt-1">{stars}</div>;
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 md:px-6 lg:px-8 transition-colors duration-300 ${theme === "dark"
        ? "text-white"
        : "text-gray-900"
        }`}
    >
      {loading1 && <Loader />}

      {/* Header / Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`max-w-7xl mx-auto rounded-2xl border px-6 py-6 shadow-xl backdrop-blur-md ${theme === "dark"
          ? "bg-black/50 border-[#2a2a2a]"
          : "bg-white/60 border-gray-200"
          }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-primary-light dark:text-primary-dark">
              Discover delicious flavors
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-lg">
              Browse categories, pick your favorites, and add to the cart. Enjoy the playful Yumigo experience.
            </p>
          </div>

          {/* summary chips */}
          {/* <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing{" "}
              <span className="font-semibold text-primary-light dark:text-primary-dark">
                {selectedCategory}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">Sort</div>
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`px-3 py-2 rounded-lg border focus:outline-none text-sm ${theme === "dark" ? "bg-[#111] border-[#333] text-white" : "bg-white border-gray-300 text-gray-800"
                  }`}
                aria-label="Sort foods"
              >
                <option value="">Default</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-300">Max ₹</div>
              <div className="text-sm font-semibold">{priceLimit}</div>
            </div>
          </div> */}

            <motion.div
      className="flex flex-wrap items-center justify-between gap-3 sm:gap-5 mb-4 px-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Category Display */}
      <motion.div
        className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-[#333]"
        whileHover={{ scale: 1.02 }}
      >
        <SlidersHorizontal
          className={`w-4 h-4 ${theme === "dark" ? "text-amber-400" : "text-orange-500"}`}
        />
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing{" "}
          <span className="font-semibold text-primary-light dark:text-primary-dark">
            {selectedCategory}
          </span>
        </div>
      </motion.div>

      {/* Sorting */}
      <motion.div
        className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-[#333]"
        whileHover={{ scale: 1.02 }}
      >
        <ArrowDownAZ
          className={`w-4 h-4 ${theme === "dark" ? "text-amber-400" : "text-orange-500"}`}
        />
        <div className="text-sm text-gray-700 dark:text-gray-300">Sort</div>
        <select
          value={sortOrder}
          onChange={(e) => handleSortChange(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border text-sm focus:ring-2 transition-all ${
            theme === "dark"
              ? "bg-[#1a1a1a] border-[#333] text-white focus:ring-amber-500"
              : "bg-white border-gray-300 text-gray-800 focus:ring-orange-500"
          }`}
          aria-label="Sort foods"
        >
          <option value="">Default</option>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </motion.div>

      {/* Price Limit */}
      <motion.div
        className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-xl shadow-sm border border-gray-200 dark:border-[#333]"
        whileHover={{ scale: 1.02 }}
      >
        <div className="text-sm text-gray-700 dark:text-gray-300">Max ₹</div>
        <motion.div
          key={priceLimit}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-semibold text-primary-light dark:text-primary-dark"
        >
          {priceLimit}
        </motion.div>
      </motion.div>
    </motion.div>

        </div>

        {/* Categories */}
        <div className="mt-6 overflow-x-auto p-3">
          <div className="flex gap-4 items-center">
            {categories.map((category) => {
              const active = selectedCategory === category.name;
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`flex-shrink-0 w-28 md:w-32 flex flex-col items-center gap-0 p-2 rounded-2xl transition-transform transform ${active
                    ? "scale-105"
                    : "hover:scale-105"
                    }`}
                  aria-pressed={active}
                  aria-label={`Category ${category.name}`}
                >
                  <div
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-inner ${active ? "border-2 border-[#FFD700]" : "border border-transparent"}`}
                    style={{ background: theme === "dark" ? "#0b0b0b" : "#fff" }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${active ? "text-[#FFD700]" : "text-gray-700 dark:text-gray-200"}`}>
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Food Grid */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} theme={theme} />
            ))
            : filteredFoods && filteredFoods.length > 0
              ? filteredFoods.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  className="rounded-xl"
                >
                  <FoodCard
                    key={item._id}
                    item={item}
                    theme={theme}
                    getItemQuantity={getItemQuantity}
                    handleAddToCart={handleAddToCart}
                    setQuickViewItem={setQuickViewItem}
                    addLoadingId={addLoadingId}
                  />
                </motion.div>
              ))
              : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300">No food items found.</p>
                </div>
              )}
        </div>
      </div>

      {/* Filter Modal (FAB opens) */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilterModal(false)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-2xl shadow-2xl backdrop-blur-md ${theme === "dark" ? "bg-black/60 border border-[#333]" : "bg-white/80 border border-gray-200"
                }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Filter & Sort</h3>
                <XMarkIcon className="w-6 h-6 cursor-pointer text-gray-500" onClick={() => setShowFilterModal(false)} />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Sort</label>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className={`w-full appearance-none px-4 py-2 pr-10 rounded-lg border focus:outline-none ${theme === "dark" ? "bg-[#111] border-[#333] text-white" : "bg-white border-gray-300 text-gray-800"
                      }`}
                    aria-label="Sort options"
                  >
                    <option value="">Default</option>
                    <option value="asc">Price: Low → High</option>
                    <option value="desc">Price: High → Low</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1">Max Price: ₹{priceLimit}</label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={priceLimit}
                  onChange={handlePriceChange}
                  className="w-full"
                  aria-label="Max price"
                />
              </div>

              <div className="flex justify-between items-center mt-4">
  {/* Clear Filters Button */}
  <button
    onClick={handleClearFilters}
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold shadow-md hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0.5"
  >
    <XCircleIcon className="w-5 h-5" />
    Clear
  </button>

  {/* Done Button */}
  <button
    onClick={() => setShowFilterModal(false)}
    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0.5"
  >
    <CheckCircleIcon className="w-5 h-5" />
    Done
  </button>
</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewItem && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewItem(null)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              className={`relative w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.3)] backdrop-blur-2xl border 
          ${theme === "dark"
                  ? "bg-gradient-to-br from-[#121212]/70 via-[#1E1E1E]/50 to-[#121212]/70 border-[#2A2A2A]"
                  : "bg-gradient-to-br from-white/90 via-white/80 to-white/80 border-white/30 shadow-lg"
                } transition-all`}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Close quick view"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Modal Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                {/* Image Section */}
                <motion.img
                  src={quickViewItem.image}
                  alt={quickViewItem.name}
                  className="w-full h-56 md:h-64 rounded-2xl object-cover shadow-md ring-1 ring-white/20"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 150 }}
                />

                {/* Details Section */}
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-light dark:text-primary-dark">
                      {quickViewItem.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {quickViewItem.description || "Tasty choice — chef's special crafted with love."}
                    </p>
                  </div>

                  {/* Price, Rating, and Info */}
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-semibold">₹{quickViewItem.price}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        ⏱ {quickViewItem.deliveryTime || "25–35 mins"}
                      </div>
                      <div className="mt-2">{renderStars(quickViewItem.rating || 4.5)}</div>
                    </div>

                    <div className="text-sm text-gray-500 text-right">
                      In Cart:{" "}
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {getItemQuantity(quickViewItem._id) || 0}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector & Button */}
                  <div className="mt-5 flex flex-col sm:flex-row items-center gap-4">
                    <div className={`flex items-center justify-between gap-2 border px-3 py-1 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-300/40 dark:border-gray-700/40 w-full sm:w-auto ${quantity == 0 ? "hidden" : ""}`}>
                      <button
                        onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                        className="text-xl font-bold px-2"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[32px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="text-xl font-bold px-2"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <motion.button
                      onClick={() =>
                        quantity > 0
                          ? handleQuantityChange(quickViewItem._id, quantity)
                          : handleAddToCart(quickViewItem, true)
                      }
                      disabled={modalLoading}
                      whileTap={{ scale: 0.96 }}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold tracking-wide shadow-md transition-all
                  ${theme === "dark"
                          ? "bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-black hover:shadow-[0_0_20px_rgba(255,215,79,0.3)]"
                          : "bg-gradient-to-r from-[#FF5722] to-[#FFC107] text-white hover:shadow-[0_0_20px_rgba(255,193,7,0.3)]"
                        }`}
                    >
                      {modalLoading
                        ? "Processing..."
                        : quantity > 0
                          ? `Update (${quantity})`
                          : "Add to Cart"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Floating Filter FAB */}
      <button
        onClick={() => setShowFilterModal(true)}
        aria-label="Open filters"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full shadow-2xl transform transition-all hover:scale-105"
        style={{
          background: theme === "dark"
            ? "linear-gradient(90deg,#FFA000,#FF7043)"
            : "linear-gradient(90deg,#FFB300,#FF5722)",
          color: theme === "dark" ? "#000" : "#fff"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M8 12h8M10 20h4" />
        </svg>
        <span className="font-semibold">Filter</span>
      </button>
    </div>
  );
};

export default MenuPage;
