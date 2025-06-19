// src/components/AddressModal.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ Correct import

const AddressModal = ({ onClose, onAddressAdded, initialAddress = null }) => {
  const { saveAddress } = useAuth(); // ✅ Access from context
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    roomNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (initialAddress) {
      setFormData(initialAddress);
    }
  }, [initialAddress])


  useEffect(() => {
    const observer = new MutationObserver(() => {
      const darkModeActive = document.documentElement.classList.contains("dark");
      setIsDark(darkModeActive);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveAddress(formData); // Update backend
      onAddressAdded(formData);    // Update frontend immediately
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-2xl w-full max-w-md border shadow-2xl ${isDark
            ? "bg-[#0d0d0d] text-white border-[#FFD700]/30"
            : "bg-white text-black border-gray-300"
          }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-[#B22222] dark:text-[#FFD700]">
          Add Delivery Address
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["fullName", "mobileNumber", "roomNumber", "street", "city", "state", "pincode"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={formData[field]}
              onChange={handleChange}
              className={`w-full border p-3 rounded-xl outline-none focus:ring-2 ${isDark
                  ? "bg-[#1c1c1c] border-[#333] text-white focus:ring-[#FFD700]"
                  : "bg-white border-gray-300 text-black focus:ring-[#B22222]"
                }`}
              required
            />
          ))}

          <div className="flex justify-between pt-2">
            <button
              type="submit"
              className="w-[48%] bg-[#B22222] hover:bg-[#a00000] dark:bg-[#FFD700] dark:hover:bg-[#e6c200] text-white dark:text-black font-bold py-2 rounded-xl"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`w-[48%] font-bold py-2 rounded-xl ${isDark
                  ? "bg-[#333] hover:bg-[#444] text-white"
                  : "bg-gray-300 hover:bg-gray-400 text-black"
                }`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
