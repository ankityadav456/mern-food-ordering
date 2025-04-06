import React, { useState, useEffect } from "react";
import { useFood } from "../context/FoodContext"; // Assuming this provides the food items
import { motion } from "framer-motion"; // Added for motion animations

const UserDashboard = () => {
  const { foodItems } = useFood(); // Get food items from context
  const [filteredFoods, setFilteredFoods] = useState(foodItems); // Foods after filter
  const [selectedCategory, setSelectedCategory] = useState("All"); // For category filter
  const [searchQuery, setSearchQuery] = useState(""); // For search bar query

  // Define category options
  const categories = ["All", "Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

  // Filter function based on category
  const filterFoods = (category) => {
    if (category === "All") {
      setFilteredFoods(foodItems);
    } else {
      setFilteredFoods(foodItems.filter((item) => item.category === category));
    }
  };

  // Search function based on search query
  const searchFoods = (query) => {
    setSearchQuery(query);
    const searchResults = foodItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredFoods(searchResults);
  };

  useEffect(() => {
    filterFoods(selectedCategory); // Filter foods whenever category changes
  }, [selectedCategory, foodItems]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Offer and Coupon Banner */}
      <div className="bg-yellow-500 text-white text-center py-3 font-semibold">
        <p>🎉 Special Offer: Get 20% off with coupon code <span className="font-bold">FOOD20</span>! 🎉</p>
      </div>

      {/* Filter Section */}
      <div className="p-6 bg-white shadow-md mb-6">
        <h2 className="text-2xl font-bold text-center text-blue-600">Available Food</h2>

        {/* Search Bar */}
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => searchFoods(e.target.value)}
            className="w-full md:w-1/2 p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex justify-center space-x-6 mt-6">
          {categories.map((category) => (
            <motion.button
              key={category}
              className={`px-4 py-2 text-white rounded-lg ${
                selectedCategory === category ? "bg-blue-500" : "bg-gray-500"
              } hover:bg-blue-600 transition`}
              onClick={() => {
                setSelectedCategory(category);
                filterFoods(category);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((item) => (
            <motion.div
              key={item._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600 text-lg mt-2">${item.price}</p>
                <p className="text-gray-500 text-sm mt-1">Category: {item.category}</p>
                <button
                  className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
                  onClick={() => alert(`Added ${item.name} to cart`)}
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500">No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
