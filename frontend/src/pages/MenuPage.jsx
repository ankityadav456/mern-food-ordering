import React, { useMemo, useState, useEffect, useRef, useContext } from "react";
import { useFood } from "../context/FoodContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { SearchContext } from "../context/SearchContext";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext";
import pizza from "../assets/Images/pizza1.png";
import burger from "../assets/Images/burger1.png";
import chinese from "../assets/Images/Chinese-Food-Download-Free-PNG.png";
import chicken from "../assets/Images/chicken.png";
import biryani from "../assets/Images/biryani.png";
import All from "../assets/Images/allimage.jpg";
import SkeletonCard from '../components/SkeletonCard'
import FoodCard from '../components/FoodItemCard'

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

  // ✅ Compute filtered list
  const filteredResults = useMemo(() => {
    if (!foodItems || foodItems.length === 0) return [];
    let result = [...foodItems];

    if (searchQuery.trim() !== "") {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((item) => item.category === selectedCategory);
    }
    result = result.filter((item) => item.price <= priceLimit);
    if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [foodItems, searchQuery, selectedCategory, priceLimit, sortOrder]);

  // ✅ Update filtered foods
  useEffect(() => {
    if (foodItems && foodItems.length > 0) {
      setFilteredFoods(filteredResults);
    }
  }, [filteredResults, foodItems]);

  // ✅ Update quick view qty
  useEffect(() => {
    if (quickViewItem) {
      setQuantity(getItemQuantity(quickViewItem._id) || 0);
    }
  }, [quickViewItem, cartItems]);

  const handleSortChange = (value) => setSortOrder(value);
  const handlePriceChange = (e) => setPriceLimit(parseInt(e.target.value));
  const handleCategoryChange = (cat) => setSelectedCategory(cat);
  const handleClearFilters = () => {
    setSortOrder("");
    setPriceLimit(1000);
    setSelectedCategory("All");
    setShowFilterModal(false);
  };

  const getItemQuantity = (id) => {
    const item = Array.isArray(cartItems)
      ? cartItems.find((ci) => ci.foodId._id === id)
      : 0;
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
    } catch (error) {
      console.error("Cart Error", error);
      toast.error("Failed to add item to cart.");
    } finally {
      if (fromModal) setModalLoading(false);
      else setAddLoadingId(null);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    setLoading1(true);
    await updateItemQuantity(id, qty);
    setQuickViewItem(null);
    setLoading1(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return <div className="flex items-center gap-1 mt-1">{stars}</div>;
  };

  return (
    <div className="py-6 max-w-7xl mx-auto text-gray-900 dark:text-white">
      {loading1 && <Loader />}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl shadow-xl p-6 mx-2 md:mx-0 border transition-all ${theme === "dark"
            ? "bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border-[#2A2A2A]"
            : "bg-gray-100 border-gray-300"
          }`}
      >
        <h2 className="text-3xl font-bold text-center text-primary-light dark:text-primary-dark">
          Menu
        </h2>
        <div className="text-sm text-center mt-2 text-text-light dark:text-text-dark">
          Showing:{" "}
          <span className="font-bold text-primary-light dark:text-primary-dark">
            {selectedCategory}
          </span>
          , Sort:{" "}
          <span className="font-bold text-primary-light dark:text-primary-dark">
            {sortOrder || "Default"}
          </span>
          , Max Price:{" "}
          <span className="font-bold text-primary-light dark:text-primary-dark">
            ₹{priceLimit}
          </span>
        </div>

        {/* 🔹 Category Selector */}
        <div className="mt-6 px-4 overflow-x-auto scrollbar-hide flex gap-6 py-2">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryChange(category.name)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-24 h-24 rounded-full overflow-hidden shadow-md transition-all duration-300 ${selectedCategory === category.name
                    ? "ring-4 ring-[#FFD700] scale-105"
                    : "bg-white"
                  }`}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p
                className={`mt-2 text-sm font-semibold text-center ${selectedCategory === category.name
                    ? "text-[#FFD700]"
                    : "text-gray-800 dark:text-white"
                  }`}
              >
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🔹 Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6 px-5 md:px-1">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} theme={theme} />
          ))
          : filteredFoods.length > 0
            ? filteredFoods.map((item) => (
              <FoodCard
                key={item._id}
                item={item}
                theme={theme}
                getItemQuantity={getItemQuantity}
                handleAddToCart={handleAddToCart}
                setQuickViewItem={setQuickViewItem}
                addLoadingId={addLoadingId}
              />
            ))
            : (
              <p className="text-center col-span-full text-gray-500 dark:text-gray-400">
                No food items found.
              </p>
            )}
      </div>

      {/* 🔹 Filter Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${theme === "dark"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-white text-black"
                }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Filter Options</h3>
                <XMarkIcon
                  className="h-6 w-6 cursor-pointer hover:text-red-500"
                  onClick={() => setShowFilterModal(false)}
                />
              </div>

              {/* Sort */}
              <div className="mb-5">
                <label className="block font-semibold mb-1">Sort By:</label>
                <div className="relative w-full">
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className={`w-full appearance-none px-4 py-2 pr-10 rounded-lg border focus:outline-none cursor-pointer ${theme === "dark"
                        ? "bg-[#111] border-[#FFD700] text-white"
                        : "bg-white border-gray-400 text-black"
                      }`}
                  >
                    <option value="">Default</option>
                    <option value="asc">Price: Low → High</option>
                    <option value="desc">Price: High → Low</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none dark:text-white" />
                </div>
              </div>

              {/* Price */}
              <div className="mb-5">
                <label className="block font-semibold mb-1">
                  Max Price: ₹{priceLimit}
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={priceLimit}
                  onChange={handlePriceChange}
                  className="w-full accent-orange-500"
                />
              </div>

              {/* Clear */}
              <div className="mt-6 text-right">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quickViewItem && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setQuickViewItem(null);
              // setQuantity(1);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl shadow-lg p-6 relative ${theme === "dark" ? "bg-[#1a1a1a] text-white" : "bg-white text-black"}`}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setQuickViewItem(null);
                  // setQuantity(1);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Quantity in Cart Ribbon */}
              <div className="absolute top-3 left-4 text-sm bg-[#FFD700] text-white px-3 py-1 rounded-full w-fit">
                In Cart: {getItemQuantity(quickViewItem._id) || 0}
              </div>

              {/* Image */}
              <img
                src={quickViewItem.image}
                alt={quickViewItem.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              {/* Details */}
              <h3 className="text-xl font-bold text-[#FFD700]">{quickViewItem.name}</h3>
              <p className="text-sm mt-1 text-gray-400">{quickViewItem.description || ""}</p>
              <p className="text-lg font-semibold mt-2">₹{quickViewItem.price}</p>
              <div className="mt-2">{renderStars(quickViewItem.rating || 4.5)}</div>
              <p className="text-sm mt-1 text-gray-500">⏱ {quickViewItem.deliveryTime || "25-35 mins"}</p>

              {/* Quantity Selector */}
              <div className={`flex items-center justify-between mt-4 ${quantity == 0 ? "hidden" : ""}`}>
                <span className="text-sm">Select Quantity</span>
                <div className="flex items-center gap-2 border px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="text-xl font-bold px-2"
                  >
                    −
                  </button>
                  <span className="min-w-[24px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="text-xl font-bold px-2"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() =>
                  quantity > 0
                    ? handleQuantityChange(quickViewItem._id, quantity)
                    : handleAddToCart(quickViewItem, true)
                }
                disabled={modalLoading}
                className={`mt-4 w-full py-2 rounded-lg ${theme === "dark"
                  ? "bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-black hover:opacity-90"
                  : "bg-gradient-to-r from-[#FF5722] to-[#FFC107] text-white hover:opacity-90"} text-black font-bold hover:opacity-90 flex items-center justify-center`}
              >
                {modalLoading ? (
                  <span className="loader w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin"></span>
                ) : quantity > 0 ? `Update Quantity to ${quantity}` : "Add to Cart"}
              </button>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setShowFilterModal(true)}
        aria-label="Open Filters"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-[#FFB300] to-[#FF5722] text-white dark:from-[#FFA000] dark:to-[#FF7043] font-semibold px-5 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
          />
        </svg>
        Filter
      </button>
    </div>
  );
};

export default MenuPage;
