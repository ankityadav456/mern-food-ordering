import React, { useState, useEffect, useContext } from "react";
import { useFood } from "../context/FoodContext";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { SearchContext } from "../context/SearchContext";
import { useCart } from "../context/CartContext";
import Loader from "../components/Loader"; // ✅

const MenuPage = () => {
  const [loading, setLoading] = useState(false); // ✅ Loader state
  const { foodItems } = useFood();
  const { searchQuery } = useContext(SearchContext);
  const { addToCart } = useCart();

  const [filteredFoods, setFilteredFoods] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const categories = ["All", "Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const result = foodItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredFoods(result);
    } else {
      filterFoods(selectedCategory);
    }
  }, [searchQuery, foodItems]);

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

  const filterFoods = (category) => {
    setLoading(true); // ✅ Show loader
    setTimeout(() => {
      let result =
        category === "All"
          ? foodItems
          : foodItems.filter(item => item.category === category);

      if (sortOrder === "asc") result.sort((a, b) => a.price - b.price);
      if (sortOrder === "desc") result.sort((a, b) => b.price - a.price);

      setFilteredFoods(result);
      setLoading(false); // ✅ Hide loader
    }, 500); // Simulate network delay
  };

  const handleAddToCart = async (food) => {
    try {
      await addToCart(food); // from context
      // toast.success(`${food.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    filterFoods(selectedCategory);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-4 relative">
      <Toaster position="top-right" />

      {loading && <Loader />} {/* ✅ Conditional Loader */}

      {/* Menu Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border border-[#2A2A2A] rounded-2xl shadow-xl p-6 mx-2 md:mx-6"
      >
        <h2 className="text-3xl font-bold text-center text-[#D4AF37]">Menu</h2>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Sort Dropdown */}
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-[#1A1A1A] border border-[#D4AF37] text-white"
          >
            <option value="">Sort By</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          {/* Categories */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  filterFoods(category);
                }}
                className={`px-4 py-2 rounded-full border ${selectedCategory === category
                  ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                  : "bg-transparent text-white border-[#2A2A2A] hover:border-[#D4AF37]"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <motion.div
              key={item._id}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden hover:shadow-[#D4AF37]/40 transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#D4AF37] truncate">{item.name}</h3>
                <p className="text-white text-lg font-bold">
                  ₹{item.price.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-400">{item.category}</p>
                {renderStars(item.rating || 4.5)}
                <p className="text-xs text-gray-500 mt-1">⏱ Estimated Delivery: {item.deliveryTime || "25-35 mins"}</p>
                <div className="flex mt-4">
                  <button
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B22222] text-black font-semibold hover:opacity-90"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
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
    </div>
  );
};

export default MenuPage;
