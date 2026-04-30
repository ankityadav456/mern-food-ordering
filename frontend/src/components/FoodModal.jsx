import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, XCircle, CheckCircle } from "lucide-react";

const FoodModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
  theme = "light",
}) => {
  const [foodData, setFoodData] = useState({
    name: "",
    price: "",
    rating: 0,
    image: "",
    category: "",
  });

  // ⭐ preview state (important)
  const [previewImage, setPreviewImage] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFoodData(initialData);

      // show saved backend image
      setPreviewImage(
        `${import.meta.env.VITE_BACKEND_URL}${initialData.image}`
      );
    } else {
      resetForm();
    }
  }, [isOpen, initialData]);

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      if (previewImage?.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  /* ================= RESET ================= */
  const resetForm = () => {
    setFoodData({
      name: "",
      price: "",
      rating: 0,
      image: "",
      category: "",
    });
    setPreviewImage("");
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE CHANGE (MAIN FIX) ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoodData({
      ...foodData,
      image: file,
    });

    // instant preview
    setPreviewImage(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(foodData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  /* ================= THEME ================= */
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-gray-900" : "bg-white";
  const textColor = isDark ? "text-gray-100" : "text-gray-900";
  const inputBg = isDark ? "bg-gray-800" : "bg-white";
  const inputBorder = isDark ? "border-gray-700" : "border-gray-300";
  const inputFocusRing = isDark
    ? "focus:ring-yellow-400"
    : "focus:ring-blue-400";
  const borderDashed = isDark ? "border-gray-600" : "border-gray-300";
  const uploadText = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className={`${bgColor} rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]`}
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ===== HEADER ===== */}
          <div
            className={`flex justify-between items-center px-6 py-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"
              }`}
          >
            <h2 className={`text-lg font-semibold ${textColor}`}>
              {initialData ? "Edit Food Item" : "Add Food Item"}
            </h2>

            <button onClick={handleClose}>
              <X size={22} className={textColor} />
            </button>
          </div>

          {/* ===== BODY ===== */}
          <div className="px-6 py-4 overflow-y-auto flex-1 space-y-5">
            {/* IMAGE PREVIEW */}
            {previewImage && (
              <motion.img
                src={previewImage}
                alt="Food Preview"
                className="w-full h-44 object-cover rounded-lg shadow"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={foodData.name}
                  onChange={handleChange}
                  placeholder="Food Name"
                  required
                  className={`p-3 border rounded-lg ${inputBg} ${inputBorder} ${textColor} focus:ring-2 ${inputFocusRing}`}
                />

                <input
                  name="rating"
                  value={foodData.rating}
                  onChange={handleChange}
                  placeholder="Rating"
                  className={`p-3 border rounded-lg ${inputBg} ${inputBorder} ${textColor}`}
                />

                <input
                  type="number"
                  name="price"
                  value={foodData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  required
                  className={`p-3 border rounded-lg ${inputBg} ${inputBorder} ${textColor}`}
                />
              </div>

              {/* UPLOAD */}
              <label className={`block text-sm ${textColor}`}>
                Upload Image
              </label>

              <div
                className={`relative border-2 border-dashed ${borderDashed} rounded-lg p-6 text-center cursor-pointer`}
              >
                <Upload size={28} className={`mx-auto ${uploadText}`} />
                <p className={`text-sm mt-2 ${uploadText}`}>
                  Click to upload
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* CATEGORY */}
              <select
                name="category"
                value={foodData.category}
                onChange={handleChange}
                required
                className={`w-full p-3 border rounded-lg ${inputBg} ${inputBorder} ${textColor}`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </form>
          </div>

          {/* ===== FOOTER ===== */}
          <div
            className={`flex justify-end gap-3 px-6 py-4 border-t ${isDark ? "border-gray-800" : "border-gray-200"
              }`}
          >
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              <XCircle size={18} /> Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#FF5722] to-[#FFC107] text-white"
            >
              <CheckCircle size={18} />
              {initialData ? "Update" : "Add"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FoodModal;