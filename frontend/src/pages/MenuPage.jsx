import React, { useState, useEffect, useRef, useContext } from "react";
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

const MenuPage = () => {
  const { updateItemQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const { foodItems } = useFood();
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

  const didInitialRender = useRef(false);

  const categories = [
    { name: "All", image: All },
    { name: "Pizza", image: pizza },
    { name: "Burger", image: burger },
    { name: "Chinese", image: chinese },
    { name: "Biryani", image: biryani },
    { name: "Chicken", image: chicken },
  ];

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let result = [...foodItems];

      if (selectedCategory !== "All") {
        result = result.filter((item) => item.category === selectedCategory);
      }

      result = result.filter((item) => item.price <= priceLimit);

      if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
      if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);

      setFilteredFoods(result);
      setLoading(false);
    }, 400);
  };

  // Debounced search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        const result = foodItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFoods(result);
      } else {
        // Avoid double trigger on initial load
        if (didInitialRender.current) {
          applyFilters();
        } else {
          didInitialRender.current = true;
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, foodItems, selectedCategory, priceLimit, sortOrder]);

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
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find((ci) => ci.foodId._id === id);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = async (food) => {
    try {
      await addToCart(food);
      setQuickViewItem(null);
    } catch (error) {
      console.error("Cart Error", error);
    }
  };

  const handleQuantityChange = async (id, qty) => {
    if (qty < 1) return;
    await updateItemQuantity(id, qty);
    setQuickViewItem(null);
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
    <div className="py-6 max-w-6xl mx-auto text-gray-900 dark:text-white">
      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl shadow-xl p-6 mx-2 md:mx-6 border transition-all ${
          theme === "dark"
            ? "bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border-[#2A2A2A]"
            : "bg-gray-100 border-gray-300"
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-[#D4AF37]">Menu</h2>
        <div className="text-sm text-center mt-2">
          Showing:{" "}
          <span className="text-[#FFD700] font-bold">{selectedCategory}</span>, Sort:{" "}
          <span className="text-[#FFD700] font-bold">{sortOrder || "Default"}</span>, Max Price:{" "}
          <span className="text-[#FFD700] font-bold">₹{priceLimit}</span>
        </div>

        <div className="mt-6 px-4 overflow-x-auto scrollbar-hide flex gap-6 py-2">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryChange(category.name)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`w-24 h-24 rounded-full overflow-hidden shadow-md transition-all duration-300 ${
                  selectedCategory === category.name
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
                className={`mt-2 text-sm font-semibold text-center transition-colors duration-300 ${
                  selectedCategory === category.name
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <motion.div
              key={item._id}
              className={`relative border rounded-xl shadow-md transition-all duration-300 ${
                getItemQuantity(item._id) > 0
                  ? "border-[#FFD700] shadow-[#FFD700]/40"
                  : theme === "dark"
                  ? "bg-[#121212] border-[#D4AF37]/10 hover:shadow-[#FFD700]/30"
                  : "bg-white border-gray-200 hover:shadow-lg"
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {getItemQuantity(item._id) > 0 && (
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
                    onClick={() => setQuickViewItem(item)}
                    className="flex-1 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700"
                  >
                    Quick View
                  </button>
                  <button
                    disabled={getItemQuantity(item._id) > 0}
                    onClick={() => handleAddToCart(item)}
                    className={`flex-1 py-2 rounded-lg font-semibold hover:opacity-90 ${
                      getItemQuantity(item._id)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-[#FFD700] to-[#8B0000] text-black"
                    }`}
                  >
                    {getItemQuantity(item._id) > 0 ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && (
            <p className="text-center col-span-full text-gray-500">No food items found.</p>
          )
        )}
      </div>

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
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-2xl shadow-2xl transition-all duration-300 ${theme === "dark" ? "bg-[#1a1a1a] text-white" : "bg-white text-black"}`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Filter Options</h3>
                <XMarkIcon
                  className="h-6 w-6 cursor-pointer hover:text-red-500"
                  onClick={() => setShowFilterModal(false)}
                />
              </div>

              <div className="mb-5">
                <label className="block font-semibold mb-1">Sort By:</label>
                <div className="relative w-full">
                  <select
                    value={sortOrder}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className={`w-full appearance-none px-4 py-2 pr-10 rounded-lg border focus:outline-none cursor-pointer ${theme === "dark" ? "bg-[#111] border-[#FFD700] text-white" : "bg-white border-gray-400 text-black"}`}
                  >
                    <option value="">Default</option>
                    <option value="asc">Price: Low → High</option>
                    <option value="desc">Price: High → Low</option>
                  </select>
                  <ChevronDownIcon className="w-5 h-5 absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 pointer-events-none dark:text-white" />
                </div>
              </div>

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
                  className="w-full accent-red-500"
                />
              </div>

              {/* Clear Filters Button */}
              <div className="mt-6 text-right">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
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
              <p className="text-sm mt-1 text-gray-400">{quickViewItem.description || "No description available."}</p>
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
                onClick={() => quantity > 1 ? handleQuantityChange(quickViewItem._id, quantity) : handleAddToCart(quickViewItem)}
                className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#8B0000] text-black font-bold hover:opacity-90"
              >
                {quantity > 1 ? `Update Quantity to ${quantity}` : "Add to Cart"}
              </button>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
