import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import defualtUserLogo from "../assets/Images/profile.png";
import { useTheme } from "../context/ThemeContext";

const ProfilePage = () => {
  const { user, updateProfile, updateAvatar, handleDeleteAvatar } = useAuth();
  const { theme } = useTheme();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${backendUrl}${user.avatar}` : "/default-avatar.png"
  );

  const [formData, setFormData] = useState({
    userId: user?._id || "",
    name: user?.name || "",
    mobile: user?.address?.mobileNumber || "",
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
    try {
      await updateProfile(formData);
    } catch (err) {}
  };

  const isDefaultAvatar = (avatarUrl) =>
    avatarUrl.includes("default-avatar.png") || avatarUrl.includes("/uploads/avatars/default-avatar.png");

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 py-12 text-black dark:text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-center">
        Manage Your <span className="text-[#D4AF37]">Profile</span>
      </h2>

      {/* Avatar Section */}
      <motion.div
        className="flex items-center justify-center gap-6 mb-12 flex-col sm:flex-row"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <img
            src={avatarPreview}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37] shadow-md"
          />

          {!isDefaultAvatar(avatarPreview) && (
            <button
              onClick={handleDeleteAvatarBtn}
              title="Delete Avatar"
              className={`absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 shadow-md
                ${theme === "dark"
                  ? "bg-gradient-to-br from-red-700 to-red-800 hover:shadow-red-500"
                  : "bg-gradient-to-br from-red-400 to-red-600 hover:shadow-red-400"}
              `}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="white"
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div>
          <button
            onClick={() => fileInputRef.current.click()}
            className={`font-semibold px-5 py-2 rounded-full shadow-md transition duration-300
              ${theme === "dark"
                ? "bg-[#D4AF37] text-black hover:bg-[#8B0000] hover:text-white"
                : "bg-[#D4AF37] text-black hover:bg-[#8B0000] hover:text-white"}
            `}
          >
            Change Avatar
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
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 bg-gray-100 dark:bg-[#1a1a1a] p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-[#2A2A2A]"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {[
          { label: "Full Name", name: "name", value: formData.name, placeholder: "Enter your name" },
          { label: "Mobile", name: "mobileNumber", value: formData.address.mobileNumber, placeholder: "Enter your mobile" },
          { label: "Full Name (Address)", name: "fullName", value: formData.address.fullName, placeholder: "Enter full name for delivery" },
          { label: "Room / Flat No", name: "roomNumber", value: formData.address.roomNumber, placeholder: "Enter room number" },
          { label: "Street", name: "street", value: formData.address.street, placeholder: "Enter street name" },
          { label: "City", name: "city", value: formData.address.city, placeholder: "Enter city" },
          { label: "State", name: "state", value: formData.address.state, placeholder: "Enter state" },
          { label: "Pincode", name: "pincode", value: formData.address.pincode, placeholder: "Enter pincode" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-sm font-medium mb-1">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={field.value}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="w-full px-4 py-2 border border-gray-300 dark:border-[#2A2A2A] rounded-lg bg-white dark:bg-[#121212] text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition"
            />
          </div>
        ))}

        <div className="sm:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            type="button"
            className="w-full sm:w-auto flex items-center gap-2 bg-[#D4AF37] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#8B0000] hover:text-white transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full sm:w-auto bg-[#D4AF37] text-black font-bold text-lg px-6 py-3 rounded-xl hover:bg-[#B22222] hover:text-white transition-all"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default ProfilePage;
