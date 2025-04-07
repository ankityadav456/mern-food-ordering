import React, { useState, useEffect } from "react";
import { useFood } from "../context/FoodContext";
import { motion } from "framer-motion";

const UserDashboard = () => {
  const { foodItems } = useFood();
  const [filteredFoods, setFilteredFoods] = useState(foodItems);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

  const filterFoods = (category) => {
    if (category === "All") {
      setFilteredFoods(foodItems);
    } else {
      setFilteredFoods(foodItems.filter((item) => item.category === category));
    }
  };

  const searchFoods = (query) => {
    setSearchQuery(query);
    const searchResults = foodItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFoods(searchResults);
  };

  useEffect(() => {
    filterFoods(selectedCategory);
  }, [selectedCategory, foodItems]);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-2">

      {/* Offer Banner */}
      {/* Offer Banner */}
      {/* Combined Banner + Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-[#0d0d0d] via-[#1A1A1A] to-[#0d0d0d] border border-[#2A2A2A] rounded-2xl shadow-xl p-6 mx-2 mt-4 md:mx-6"
      >
        {/* Offer Banner */}
        <div className="bg-gradient-to-r from-[#D4AF37] via-[#B22222] to-[#D4AF37] text-black py-4 px-6 shadow-md border-b border-[#D4AF37] rounded-xl">
          <p className="text-lg md:text-xl font-bold tracking-wide flex items-center justify-center gap-2 text-center">
            <span role="img" aria-label="party">🎉</span>
            <span className="bg-black px-3 py-1 rounded-full text-[#D4AF37] shadow-inner shadow-[#D4AF37]/50 border border-[#B22222]">
              Get 20% OFF
            </span>
            with coupon code <span className="font-bold text-[#0d0d0d] bg-[#D4AF37] px-2 py-1 rounded-md shadow-sm">FOOD20</span>!
            <span role="img" aria-label="party">🎉</span>
          </p>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#D4AF37] mt-8">Explore Delicious Meals</h2>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                filterFoods(category);
              }}
              className={`px-5 py-2 text-sm font-medium rounded-full transition border 
          ${selectedCategory === category
                  ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                  : "bg-transparent text-white border-[#2A2A2A] hover:border-[#D4AF37]"}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>


      {/* Food Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <motion.div
              key={item._id}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl shadow-lg overflow-hidden hover:shadow-[#D4AF37]/40 transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-t-2xl" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-[#D4AF37] truncate">{item.name}</h3>
                <p className="text-white mt-1 text-lg font-bold">${item.price}</p>
                <p className="text-sm text-gray-400">{item.category}</p>
                <button
                  className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B22222] text-black font-semibold hover:opacity-90 transition"
                  onClick={() => alert(`Added ${item.name} to cart`)}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
