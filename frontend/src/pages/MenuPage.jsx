// src/pages/MenuPage.jsx
import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useFood } from "../context/FoodContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { SearchContext } from "../context/SearchContext";
import { ChevronDownIcon, XMarkIcon, XCircleIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
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
import { SlidersHorizontal, ArrowDownAZ, Clock } from "lucide-react";
const MenuPage = () => {
  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category");
  const { updateItemQuantity, removeFromCart } = useCart();
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
  // const didInitialRender = useRef(false);
  const categories = [
    { name: "All", image: All },
    { name: "Pizza", image: pizza },
    { name: "Burger", image: burger },
    { name: "Chinese", image: chinese },
    { name: "Biryani", image: biryani },
    { name: "Chicken", image: chicken },
  ];

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
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  useEffect(() => {
  if (categoryFromURL) {
    setSelectedCategory(categoryFromURL);
  }
}, [categoryFromURL]);

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
    setLoading1(true);
    if (!fromModal && addLoadingId) return;
    if (fromModal && modalLoading) return;
    if (fromModal) setModalLoading(true);
    else setAddLoadingId(food._id);

    try {
      await addToCart(food);
      setQuickViewItem(null);
    } catch (error) {
      console.error("Cart Error", error);
    } finally {
      setLoading1(false);
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
    } catch (err) {
      console.log(err)
    } finally {
      setLoading1(false);
    }
  };

  const handleIncrease = async (item) => {
    setLoading1(true);
    const currentQty = getItemQuantity(item._id);
    await updateItemQuantity(item._id, currentQty + 1);
    toast.success(`${item.name} quantity increased`);
    setLoading1(false);
  };

  const handleDecrease = async (item) => {
    setLoading1(true);
    const currentQty = getItemQuantity(item._id);

    if (currentQty <= 1) {
      await removeFromCart(item._id);
      setLoading1(false);
    } else {
      await updateItemQuantity(item._id, currentQty - 1);
      toast.success(`${item.name} quantity decrease`);
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

          <motion.div
            className="flex flex-wrap items-center justify-between gap-3 sm:gap-2 mb-4 px-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category Display */}
            <motion.div
              className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-[#333]"
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
                className={`px-3 py-1 rounded-lg border text-sm focus:ring-2 transition-all ${theme === "dark"
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
              className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-[#333]"
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
                    className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-inner ${active ? (theme === "dark" ? "border-2 border-[#FFD700]" : "border-2 border-primary-light") : "border border-transparent"}`}
                    style={{ background: theme === "dark" ? "#0b0b0b" : "#fff" }}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <span className={`text-sm font-semibold ${active ? (theme === "dark" ? "text-[#FFD700]" : "text-primary-light") : "text-gray-700 dark:text-gray-200"}`}>
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
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                  layout
                  transition={{ layout: { duration: 0.3 } }}
                  className="rounded-xl"
                >
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
            className="fixed inset-0 z-50 flex items-center justify-center
             bg-black/80 backdrop-blur-xl px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setQuickViewItem(null)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.85, y: 80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 60 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              className={`relative w-full max-w-4xl rounded-3xl overflow-hidden
  border backdrop-blur-2xl
  ${theme === "dark"
                  ? "bg-[#121212]/80 border-white/10"
                  : "bg-white/80 border-gray-200"}
  shadow-[0_20px_80px_rgba(0,0,0,0.45)]`}
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewItem(null)}
                className="absolute top-5 right-5 z-20
             bg-black/40 hover:bg-red-500
             backdrop-blur-md
             p-2 rounded-full
             transition-all duration-300 hover:scale-110"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>

              <div className="grid md:grid-cols-2 gap-10 p-7 md:p-10 items-center">

                <motion.div
                  className="relative group"
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {/* Glow background */}
                  <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30
                  bg-gradient-to-tr from-orange-500 to-yellow-400"></div>

                  <motion.img
                    src={`${import.meta.env.VITE_BACKEND_URL}${quickViewItem.image}`}
                    alt={quickViewItem.name}
                    className="relative w-full h-60 object-cover rounded-2xl
               shadow-2xl"
                    whileHover={{ scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
                {/* Details */}
                <motion.div
                  className="flex flex-col gap-5"
                  initial={{ x: 60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >

                  {/* Title */}
                  <h3 className="text-3xl font-bold tracking-tight">
                    {quickViewItem.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-300">
                    {quickViewItem.description ||
                      "Chef crafted delight prepared with premium ingredients and rich flavors."}
                  </p>

                  {/* Price + Rating */}
                  <div className="flex items-center justify-between mt-2">

                    <div>
                      <div className="text-3xl font-bold text-orange-500">
                        ₹{quickViewItem.price}
                      </div>


                      <div
                        className={`flex items-center gap-1 text-xs`}
                      >
                        <Clock size={14} />{quickViewItem.deliveryTime || "25–35 mins"}
                      </div>

                      <div className="mt-2">
                        {renderStars(quickViewItem.rating || 4.5)}
                      </div>
                    </div>

                    <div className="text-center px-4 py-2 rounded-xl
                  bg-orange-500/10 border border-orange-400/20">
                      <div className="text-xs text-gray-500">In Cart</div>
                      <div className="text-xl font-bold text-orange-500">
                        {getItemQuantity(quickViewItem._id) || 0}
                      </div>
                    </div>

                  </div>

                  {/* Quantity + Add */}
                  <div className="flex items-center gap-4 mt-3">

                    {/* Quantity Controller */}
                    {quantity > 0 && (
                      <div className="flex items-center gap-3
                px-4 py-2 rounded-xl
                bg-surface border border-gray-300 dark:border-gray-700">

                        <button
                          onClick={() => setQuantity((p) => Math.max(1, p - 1))}
                          className="w-9 h-9 rounded-full
             bg-gray-200 dark:bg-gray-700
             hover:scale-110 transition"
                        >
                          −
                        </button>

                        <span className="font-semibold text-lg">{quantity}</span>

                        <button
                          onClick={() => setQuantity((p) => p + 1)}
                          className="w-9 h-9 rounded-full
             bg-gray-200 dark:bg-gray-700
             hover:scale-110 transition"
                        >
                          +
                        </button>

                      </div>
                    )}

                    {/* Add / Update Button */}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      disabled={modalLoading}
                      onClick={() =>
                        quantity > 0
                          ? handleQuantityChange(quickViewItem._id, quantity)
                          : handleAddToCart(quickViewItem, true)
                      }
                      className="flex-1 relative overflow-hidden
             px-7 py-3 rounded-xl font-semibold
             bg-gradient-to-r from-orange-500 to-yellow-400
             text-black shadow-lg
             hover:shadow-orange-500/40 transition"
                    >
                      <span className="relative z-10">
                        {modalLoading
                          ? "Processing..."
                          : quantity > 0
                            ? `Update (${quantity})`
                            : "Add to Cart"}
                      </span>

                      <div className="absolute inset-0 opacity-0 hover:opacity-100
                  transition bg-white/10"></div>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



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
