import { useState } from "react";
import { useFood } from "../context/FoodContext"; // ✅ Import Food Context
import FoodItemCard from "../components/FoodItemCard"; // ✅ Import FoodItemCard Component

const categories = ["All", "Burgers", "Pizza", "Drinks", "Sides"];

export default function MenuPage() {
  const { foodItems } = useFood();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  // Filter food items based on category
  const filteredItems =
    selectedCategory === "All"
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🍽️ Our Menu</h1>

      {/* Category Filters */}
      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg border ${
              selectedCategory === category
                ? "bg-green-500 text-white"
                : "bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <FoodItemCard key={item._id} item={item} addToCart={addToCart} />
          ))
        ) : (
          <p className="text-gray-500">No food items available.</p>
        )}
      </div>
    </div>
  );
}
