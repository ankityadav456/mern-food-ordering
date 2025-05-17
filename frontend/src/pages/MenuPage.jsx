import React, { useState, useEffect, useContext } from "react";
import { useFood } from "../context/FoodContext";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { SearchContext } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader";
import { useTheme } from "../context/ThemeContext";

const MenuPage = () => {
  const [loading, setLoading] = useState(false);
  const { foodItems } = useFood();
  const { searchQuery } = useContext(SearchContext);
  const { cartItems, addToCart } = useCart();
  // const { theme } = useContext(useTheme);
    const { theme } = useTheme();

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [priceLimit, setPriceLimit] = useState(500);

  const categories = ["All", "Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const result = foodItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(result);
    } else {
      filterFoods(selectedCategory, priceLimit);
    }
  }, [searchQuery, foodItems, sortOrder, priceLimit, selectedCategory]);

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
          : foodItems.filter(item => item.category === category);

      result = result.filter(item => item.price <= priceCap);

      if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
      if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);

      setFilteredFoods(result);
      setLoading(false);
    }, 400);
  };

  const handleAddToCart = async (food) => {
    try {
      await addToCart(food);
      toast.success(`${food.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
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
    const item = cartItems.find(ci => ci.foodId._id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className={`min-h-screen p-4 relative transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0d0d0d] text-white' : 'bg-white text-black'
    }`}>
      <Toaster position="top-right" />
      {loading && <Loader />}

      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`rounded-2xl shadow-xl p-6 mx-2 md:mx-6 border transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border-[#2A2A2A]'
            : 'bg-gray-100 border-gray-300'
        }`}
      >
        <h2 className="text-3xl font-bold text-center text-[#D4AF37]">Menu</h2>

        {/* Active Filters */}
        <div className="text-sm text-center text-gray-400 mt-2">
          Showing: <span className="text-[#FFD700] font-medium">{selectedCategory}</span>, 
          Sort: <span className="text-[#FFD700] font-medium">{sortOrder || "Default"}</span>, 
          Max Price: <span className="text-[#FFD700] font-medium">₹{priceLimit}</span>
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3 items-center">
            <label className="text-sm text-[#FFD700] font-medium">Sort:</label>
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className={`px-4 py-2 rounded-lg border focus:outline-none ${
                theme === 'dark'
                  ? 'bg-[#111] border-[#FFD700] text-white'
                  : 'bg-white border-gray-400 text-black'
              }`}
            >
              <option value="">Default</option>
              <option value="asc">Price: Low → High</option>
              <option value="desc">Price: High → Low</option>
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm text-[#FFD700] font-medium">Max Price:</label>
            <input
              type="range"
              min="50"
              max="500"
              step="50"
              value={priceLimit}
              onChange={handlePriceChange}
              className="w-32 accent-[#FFD700] bg-transparent"
            />
            <span className="text-sm">₹{priceLimit}</span>
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 mt-4 scrollbar-hide py-1">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                filterFoods(category);
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-full border transition-all duration-200 ${
                selectedCategory === category
                  ? theme === 'dark'
                    ? 'bg-[#FFD700] text-black font-semibold'
                    : 'bg-[#8B0000] text-white font-semibold'
                  : theme === 'dark'
                  ? 'bg-[#111] text-white border-[#2A2A2A] hover:border-[#FFD700]'
                  : 'bg-white text-black border-gray-300 hover:border-[#8B0000]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <motion.div
              key={item._id}
              className={`relative border rounded-xl shadow-md transition-all duration-300 ${
                getItemQuantity(item._id) > 0
                  ? 'border-[#FFD700] shadow-[#FFD700]/40'
                  : theme === 'dark'
                  ? 'bg-[#121212] border-[#D4AF37]/10 hover:shadow-[#FFD700]/30'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {getItemQuantity(item._id) > 0 && (
                <div title="Qty" className="absolute top-2 right-2 bg-[#FFD700] text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                  {getItemQuantity(item._id)}
                </div>
              )}

              <img src={item.image} alt={item.name} className="p-3 w-full h-40 object-cover rounded-md mb-3" />
              <div className="p-3">
                <h3 className="text-lg font-bold text-[#FFD700] truncate">{item.name}</h3>
                <p className={`text-md font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                {/* Category Badge */}
                <p className={`text-xs mt-1 font-semibold ${
                  item.category === "Vegetarian"
                    ? "text-green-500"
                    : item.category === "Non-Vegetarian"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}>
                  {item.category}
                </p>

                {renderStars(item.rating || 4.5)}
                <p className="text-xs text-gray-500 mt-1">⏱ {item.deliveryTime || "25-35 mins"}</p>

                <button
                  className={`mt-3 w-full py-2 rounded-lg font-semibold hover:opacity-90 ${
                    getItemQuantity(item._id) > 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-[#FFD700] to-[#8B0000] text-black'
                  }`}
                  disabled={getItemQuantity(item._id) > 0}
                  onClick={() => handleAddToCart(item)}
                >
                  {getItemQuantity(item._id) > 0 ? "In Cart" : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          !loading && (
            <p className="text-center col-span-full text-gray-500">No food items found.</p>
          )
        )}
      </div>
    </div>
  );
};

export default MenuPage;
