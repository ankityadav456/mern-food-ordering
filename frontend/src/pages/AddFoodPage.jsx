import { useFood } from "../context/FoodContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import FoodModal from "../components/FoodModal";
import foodBg from "../assets/Images/AddFood.png";

export default function AdminFoodPage() {
  const { foodItems, addFoodItem, updateFoodItem, deleteFoodItem } = useFood();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const categories = ["Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black">
        <h2 className="text-red-500 text-2xl font-bold">🚫 Access Denied: Admins Only</h2>
      </div>
    );
  }

  const openModal = (foodItem = null) => {
    setSelectedFood(foodItem);
    setModalOpen(true);
  };

  const handleSubmit = async (foodData) => {
    if (selectedFood) {
      await updateFoodItem(selectedFood._id, foodData);
      alert("✏️ Food item updated successfully!");
    } else {
      await addFoodItem(foodData);
      alert("✅ New food item added!");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-900 dark:text-white">
      <h1 className="text-4xl font-bold mb-8 text-center dark:text-gold">🍽️ Manage Food Items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Add New Food */}
        <div
          onClick={() => openModal()}
          className="group border-2 border-dashed border-gray-400 rounded-xl p-4 shadow-lg bg-gray-100 dark:bg-[#1b1b1b] flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:shadow-gold transition duration-300 relative overflow-hidden w-60"
        >
          <div
            className="p-4 bg-white dark:bg-black rounded-full shadow-md"
            style={{
              backgroundImage: `url(${foodBg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: "100px",
              height: "100px",
            }}
          />
          <h2 className="text-lg font-semibold mt-4 text-center text-gray-700 dark:text-gray-300">
            Add New Food
          </h2>
        </div>

        {/* Food Items List */}
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-md hover:shadow-xl transition duration-300 w-64"
            >
              <img
                src={item.image}
                alt={item.name}
                className="p-3 w-full h-40 object-cover rounded-md mb-3 border border-gray-300 dark:border-gray-700"
              />
              <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
              <p className="text-gray-700 dark:text-gray-400 mb-1">${item.price}</p>
              <p className="text-sm text-gray-600 dark:text-gray-500">Category: {item.category}</p>

              <div className="flex justify-between mt-4 space-x-2">
                <button
                  onClick={() => openModal(item)}
                  className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this food item?")) {
                      await deleteFoodItem(item._id);
                      alert("🗑️ Food item deleted successfully!");
                    }
                  }}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 col-span-full text-center mt-6">
            No food items available.
          </p>
        )}
      </div>

      {/* Modal */}
      <FoodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedFood}
        categories={categories}
      />
    </div>
  );
}
