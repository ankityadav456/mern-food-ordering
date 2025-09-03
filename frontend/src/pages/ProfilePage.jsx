import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Upload, Trash2, ArrowLeft, Check } from "lucide-react";

const ProfilePage = () => {
  const { user, updateProfile, updateAvatar, handleDeleteAvatar } = useAuth();
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isSaving, setIsSaving] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${backendUrl}${user.avatar}` : "/default-avatar.png"
  );

  const [formData, setFormData] = useState({
    userId: user?._id || "",
    name: user?.name || "",
    address: {
      fullName: user?.address?.fullName || "",
      mobileNumber: user?.address?.mobileNumber || "",
      roomNumber: user?.address?.roomNumber || "",
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      pincode: user?.address?.pincode || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.address) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setAvatarPreview(previewURL);
    await updateAvatar(file);
  };

  const handleDeleteAvatarBtn = async () => {
    const response = await handleDeleteAvatar();
    const newAvatarUrl = `${backendUrl}${response}`;
    setAvatarPreview(newAvatarUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const isDefaultAvatar = (avatarUrl) =>
    avatarUrl.includes("default-avatar.png") ||
    avatarUrl.includes("/uploads/avatars/default-avatar.png");

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center">
        Your <span className="bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">Profile</span>
      </h2>

      {/* Avatar Section */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative group">
          <img
            src={avatarPreview}
            alt="avatar"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#FF5722] shadow-lg group-hover:scale-105 transition-transform duration-300"
          />

          {!isDefaultAvatar(avatarPreview) && (
            <button
              onClick={handleDeleteAvatarBtn}
              title="Delete Avatar"
              className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center 
              bg-gradient-to-br from-red-500 to-red-700 hover:shadow-lg transition"
            >
              <Trash2 size={18} className="text-white" />
            </button>
          )}
        </div>

        <div>
          <button
            onClick={() => fileInputRef.current.click()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm tracking-wide shadow-md 
            bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-white 
            hover:scale-105 hover:shadow-lg transition-all"
          >
            <Upload size={16} /> Change Avatar
          </button>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>
      </motion.div>

      {/* Profile Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#121212] p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-[#2A2A2A] grid grid-cols-1 sm:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Name", name: "name", value: formData.name, placeholder: "Enter your full name" },
          { label: "Mobile", name: "mobileNumber", value: formData.address.mobileNumber, placeholder: "Enter your mobile number" },
          { label: "Delivery Full Name", name: "fullName", value: formData.address.fullName, placeholder: "Recipient full name" },
          { label: "Room / Flat No", name: "roomNumber", value: formData.address.roomNumber, placeholder: "e.g. 101-A" },
          { label: "Street", name: "street", value: formData.address.street, placeholder: "Enter street name" },
          { label: "City", name: "city", value: formData.address.city, placeholder: "Enter city" },
          { label: "State", name: "state", value: formData.address.state, placeholder: "Enter state" },
          { label: "Pincode", name: "pincode", value: formData.address.pincode, placeholder: "Enter postal code" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={field.value}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-[#333] bg-white dark:bg-[#1a1a1a] 
              text-black dark:text-white focus:border-[#FF5722] focus:ring-1 focus:ring-[#FF5722] outline-none transition"
            />
          </div>
        ))}

        {/* Buttons */}
        <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base 
            bg-gray-200 dark:bg-[#2A2A2A] hover:bg-gray-300 dark:hover:bg-[#333] text-black dark:text-white transition-all"
          >
            <ArrowLeft size={18} /> Back
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSaving}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base 
            transition-all duration-300 
            ${isSaving
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-[#FF5722] to-[#FFD54F] text-white hover:shadow-lg"
              }`}
          >
            {isSaving ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8z"
                ></path>
              </svg>
            ) : (
              <>
                <Check size={18} /> Save Changes
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ProfilePage;
