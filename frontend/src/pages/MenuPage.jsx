import React, { useState, useEffect, useContext } from "react";
import { useFood } from "../context/FoodContext";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
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
  const {
    updateItemQuantity,
  } = useCart();
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
  const [quantity, setQuantity] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const categories = [
    { name: "All", image: All },
    { name: "Pizza", image: pizza },
    { name: "Burger", image: burger },
    { name: "Chinease", image: chinese },
    { name: "Biryani", image: biryani },
    { name: "Chicken", image: chicken },
  ];

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const result = foodItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(result);
    } else {
      filterFoods(selectedCategory, priceLimit);
    }
  }, [searchQuery, foodItems, sortOrder, priceLimit, selectedCategory]);

  useEffect(() => {
    if (quickViewItem) {
      setQuantity(getItemQuantity(quickViewItem._id) || 1);
    }
  }, [quickViewItem]);

  const handleClearFilters = () => {
    setSortOrder(""); // Reset sorting
    setPriceLimit(1000); // Or your default max price
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return <div className="flex items-center gap-1 mt-1">{stars}</div>;
  };

  const filterFoods = (category, priceCap = priceLimit) => {
    setLoading(true);
    setTimeout(() => {
      let result =
        category === "All"
          ? foodItems
          : foodItems.filter((item) => item.category === category);
      result = result.filter((item) => item.price <= priceCap);
      if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
      if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);
      setFilteredFoods(result);
      setLoading(false);
    }, 400);
  };

  const handleAddToCart = async (food) => {
    try {
      await addToCart(food);
      // toast.success(`${food.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };
  const handleQuantityChange = async (id, quantity) => {
    if (quantity < 1) return;
    await updateItemQuantity(id, quantity);
    setQuickViewItem(null);
    setQuantity(1);

  };


  const handleSortChange = (value) => {
    setSortOrder(value);
    filterFoods(selectedCategory, priceLimit);
  };

  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceLimit(value);
    filterFoods(selectedCategory, value);
  };

  const getItemQuantity = (id) => {
    const item = cartItems.find((ci) => ci.foodId._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className={`min-h-screen p-4 pt-8 relative transition-colors duration-300 ${theme === "dark" ? "bg-[#0d0d0d] text-white" : "bg-[#FAF9F6] text-black"}`}>
      <Toaster position="top-right" />
      {loading && <Loader />}

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl shadow-xl p-6 mx-2 md:mx-6 border transition-all ${theme === "dark" ? "bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border-[#2A2A2A]" : "bg-gray-100 border-gray-300"}`}
      >
        <h2 className="text-3xl font-bold text-center text-[#D4AF37]">Menu</h2>
        <div className="text-sm text-center mt-2">
          Showing: <span className="text-[#FFD700] font-bold">{selectedCategory}</span>, Sort:{" "}
          <span className="text-[#FFD700] font-bold">{sortOrder || "Default"}</span>, Max Price:{" "}
          <span className="text-[#FFD700] font-bold">₹{priceLimit}</span>
        </div>

        {/* Category Chips */}
        <div className="mt-6 px-4 overflow-x-auto scrollbar-hide flex gap-6 py-2">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => {
                setSelectedCategory(category.name);
                filterFoods(category.name);
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className={`w-24 h-24 rounded-full overflow-hidden shadow-md transition-all duration-300 ${selectedCategory === category.name ? "ring-4 ring-[#FFD700] scale-105" : "bg-white"}`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className={`mt-2 text-sm font-semibold text-center transition-colors duration-300 ${selectedCategory === category.name ? "text-[#FFD700]" : "text-gray-800 dark:text-white"}`}>
                {category.name}
              </p>
            </div>
          ))}
        </div>

        {/* Sorting & Filtering Controls for Desktop */}
        {/* <div className="hidden md:grid mt-6 grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-3">
            <label className="text-lg text-[#FFD700] font-extrabold">Sort By:</label>
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

          <div className="flex flex-col items-center">
            <label className="text-lg text-[#FFD700] font-extrabold mb-2">Max Price: ₹{priceLimit}</label>
            <input type="range" min="50" max="500" step="50" value={priceLimit} onChange={handlePriceChange} className="w-full accent-[#FFD700] bg-transparent" />
          </div>
        </div> */}
      </motion.div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <motion.div
              key={item._id}
              className={`relative border rounded-xl shadow-md transition-all duration-300 ${getItemQuantity(item._id) > 0 ? "border-[#FFD700] shadow-[#FFD700]/40" : theme === "dark" ? "bg-[#121212] border-[#D4AF37]/10 hover:shadow-[#FFD700]/30" : "bg-white border-gray-200 hover:shadow-lg"}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {getItemQuantity(item._id) > 0 && (
                <div className="absolute top-2 right-2 bg-[#FFD700] text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {getItemQuantity(item._id)}
                </div>
              )}
              <img src={item.image} alt={item.name} className="p-3 w-full h-44 object-cover rounded-md mb-3" />
              <div className="p-3">
                <h3 className="text-lg font-bold text-[#FFD700] truncate">{item.name}</h3>
                <p className={`text-md font-semibold ${theme === "dark" ? "text-white" : "text-black"}`}>₹{item.price.toLocaleString("en-IN")}</p>
                <p className={`text-xs mt-1 font-semibold ${item.category === "Vegetarian" ? "text-green-500" : item.category === "Non-Vegetarian" ? "text-red-500" : "text-gray-500"}`}>{item.category}</p>
                {renderStars(item.rating || 4.5)}
                <p className="text-xs text-gray-500 mt-1">⏱ {item.deliveryTime || "25-35 mins"}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setQuickViewItem(item)} className="flex-1 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700">Quick View</button>
                  <button
                    disabled={getItemQuantity(item._id) > 0}
                    onClick={() => handleAddToCart(item)}
                    className={`flex-1 py-2 rounded-lg font-semibold hover:opacity-90 ${getItemQuantity(item._id) ? "bg-gray-400 cursor-not-allowed text-white" : "bg-gradient-to-r from-[#FFD700] to-[#8B0000] text-black"}`}
                  >
                    {getItemQuantity(item._id) > 0 ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && <p className="text-center col-span-full text-gray-500">No food items found.</p>
        )}
      </div>

      {/* Filter Floating Button (Mobile) */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-[#FFD700] text-black rounded-full p-4 shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 group"
        onClick={() => setShowFilterModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        >
          <path d="M3 5a1 1 0 011-1h16a1 1 0 01.8 1.6l-5.8 7.73V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-4.67L3.2 6.6A1 1 0 013 5z" />
        </svg>
      </button>


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
              setQuantity(1);
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
                  setQuantity(1);
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
              <div className="flex items-center justify-between mt-4">
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
                onClick={() => handleQuantityChange(quickViewItem._id, quantity)}
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
