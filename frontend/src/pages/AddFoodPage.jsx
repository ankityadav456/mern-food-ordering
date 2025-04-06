import { useFood } from "../context/FoodContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import FoodModal from "../components/FoodModal";
import foodBg from "../assets/Images/AddFood.png"; // Example background image

export default function AdminFoodPage() {
  const { foodItems, addFoodItem, updateFoodItem, deleteFoodItem } = useFood();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  // Define category options
  const categories = ["Fast Food", "Beverages", "Dessert", "Vegetarian", "Non-Vegetarian"];

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
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
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center mb-5">🍽️ Manage Food Items</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Add New Food Item Card */}
        <div
          onClick={() => openModal()}
          className="border-2 border-dashed border-gray-400 rounded-lg p-4 shadow-md bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 relative overflow-hidden animate-border-rotate"
        >
          <div
            className="p-4 transition-all relative"
            style={{ backgroundImage: `url(${foodBg})`, backgroundSize: "cover", backgroundPosition: "center", width: "100px", height: "100px" }}
          ></div>
          <h2 className="text-lg font-semibold text-gray-500 mt-3">Add New Food</h2>
          <div className="absolute inset-0 border-4 border-transparent rounded-lg animate-border-clockwise"></div>
        </div>

        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 shadow-md bg-white">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-2 shadow-sm border border-gray-200"
              />

              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price}</p>
              <p className="text-gray-500 text-sm">Category: {item.category}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => openModal(item)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
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
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No food items available.</p>
        )}
      </div>

      {/* Food Modal with Categories */}
      <FoodModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedFood}
        categories={categories} // Passing categories as a prop
      />
    </div>
  );
}