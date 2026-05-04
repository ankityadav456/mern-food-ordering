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
    category: "",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFoodData({
        name: initialData.name || "",
        price: initialData.price || "",
        rating: initialData.rating || "",
        category: initialData.category || "",
        image: null,
      });

      // existing cloudinary image
      setPreviewImage(initialData.image || "");
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
      rating: "",
      category: "",
      image: null,
    });
    setPreviewImage("");
  };

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFoodData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ================= IMAGE CHANGE ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFoodData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreviewImage(URL.createObjectURL(file));
  };

  /* ================= SUBMIT (MAIN FIX) ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", foodData.name);
    formData.append("price", foodData.price);
    formData.append("rating", foodData.rating);
    formData.append("category", foodData.category);

    // append image ONLY if new file selected
    if (foodData.image instanceof File) {
      formData.append("image", foodData.image);
    }

    onSubmit(formData);

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
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className={`text-lg font-semibold ${textColor}`}>
              {initialData ? "Edit Food Item" : "Add Food Item"}
            </h2>

            <button onClick={handleClose}>
              <X size={22} className={textColor} />
            </button>
          </div>

          {/* BODY */}
          <div className="px-6 py-4 overflow-y-auto flex-1 space-y-5">
            {previewImage && (
              <motion.img
                src={previewImage}
                alt="preview"
                className="w-full h-44 object-cover rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
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
                  className={`p-3 border rounded-lg ${inputBg} ${inputBorder} ${textColor}`}
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

              {/* IMAGE UPLOAD */}
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

          {/* FOOTER */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button
              onClick={handleClose}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-200"
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