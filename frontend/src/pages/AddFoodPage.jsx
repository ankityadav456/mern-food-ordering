import { useFood } from "../context/FoodContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import FoodModal from "../components/FoodModal";
import addBtnLight from "../assets/Images/lightModeAdd.png";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { Pencil, Trash2 } from "lucide-react";
import { Utensils } from "lucide-react";
import Loader from "../components/Loader";
export default function AdminFoodPage() {
  const { foodItems, loading, addFoodItem, updateFoodItem, deleteFoodItem } = useFood();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  // const [loading, setLoading] = useState(false);
  const categories = ["Pizza", "Burger", "Chinese", "Chicken", "Biryani"];



  const openModal = (foodItem = null) => {
    setSelectedFood(foodItem);
    setModalOpen(true);
  };

  const handleSubmit = async (foodData) => {
    // setLoading(true); // show loader
    try {
      if (selectedFood) {
        await updateFoodItem(selectedFood._id, foodData);
        Swal.fire({
          title: "Updated!",
          text: "Food item updated successfully!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        await addFoodItem(foodData);
        Swal.fire({
          title: "Success!",
          text: "New food item added!",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
      setModalOpen(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong, please try again.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    } finally {
      // setLoading(false); // hide loader
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this food item? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      // setLoading(true); // show loader
      try {
        await deleteFoodItem(item._id);
        Swal.fire("Deleted!", "Food item has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete food item.", "error");
      } finally {
        // setLoading(false); // hide loader
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white dark:bg-[#0d0d0d]">
        <Loader />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black">
        <h2 className="text-red-500 text-2xl font-bold">🚫 Access Denied: Admins Only</h2>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto text-gray-900 dark:text-white">
      {/* Header */}
      <h1 className="text-3xl font-extrabold text-center mb-8 text-black dark:text-gold flex items-center justify-center gap-3">
        <Utensils className="w-8 h-8 text-black dark:text-gold" />
        Manage Food Items
      </h1>

      {/* Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Add New Food Card */}
        <div
          onClick={() => openModal()}
          className="group border-2 border-dashed border-gray-400 rounded-xl p-6 shadow-lg bg-gray-100 dark:bg-[#1b1b1b] flex flex-col items-center justify-center cursor-pointer hover:border-gold transition duration-300"
        >
          <div
            className="bg-white dark:bg-white rounded-full shadow-md"
            style={{
              backgroundImage: `url(${addBtnLight})`,
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

        {/* Food Item Cards */}
        {foodItems.length > 0 ? (
          foodItems.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 rounded-xl shadow-md hover:shadow-xl transition duration-300 flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-44 object-cover rounded-t-xl border-b border-gray-200 dark:border-gray-700"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1">{item.name}</h2>
                  <p className="text-gray-700 dark:text-gray-400">₹{item.price}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-500 mt-1">
                    Category: {item.category}
                  </p>
                </div>

                <div className="flex justify-between mt-4 space-x-2">
                  <button
                    onClick={() => openModal(item)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition text-sm"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
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
