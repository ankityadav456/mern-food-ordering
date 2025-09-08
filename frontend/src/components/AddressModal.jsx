// src/components/AddressModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Save, XCircle } from "lucide-react"; // ✅ Added icons

const AddressModal = ({ onClose, onAddressAdded, initialAddress = null }) => {
  const { saveAddress } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    roomNumber: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (initialAddress) {
      setFormData(initialAddress);
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveAddress(formData);
      onAddressAdded(formData);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-lg rounded-2xl border shadow-xl p-6 
                     bg-surface-light dark:bg-surface-dark 
                     border-gray-200 dark:border-gray-700 
                     max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-primary-light dark:text-primary-dark mb-6">
            {initialAddress ? "Edit Address" : "Add Delivery Address"}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: "fullName", label: "Full Name" },
              { name: "mobileNumber", label: "Mobile Number" },
              { name: "roomNumber", label: "Room / Flat No." },
              { name: "street", label: "Street" },
              { name: "city", label: "City" },
              { name: "state", label: "State" },
              { name: "pincode", label: "Pincode" },
            ].map(({ name, label }) => (
              <div className="relative" key={name}>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="peer w-full rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-transparent px-3 pt-5 pb-2 
                             text-text-light dark:text-text-dark 
                             focus:border-primary-light dark:focus:border-primary-dark 
                             focus:ring-2 focus:ring-primary-light/30 dark:focus:ring-primary-dark/30 
                             outline-none transition"
                  placeholder=" "
                />
                <label
                  htmlFor={name}
                  className="absolute left-3 top-2 text-sm text-text-subtleLight dark:text-text-subtleDark 
                             transition-all duration-200 
                             peer-placeholder-shown:top-4 
                             peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                             peer-focus:top-2 peer-focus:text-sm 
                             peer-focus:text-primary-light dark:peer-focus:text-primary-dark"
                >
                  {label}
                </label>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                className="w-1/2 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                           text-white dark:text-black 
                           bg-primary-light dark:bg-primary-dark 
                           hover:opacity-90 transition"
              >
                <Save className="w-5 h-5" />
                Save
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                           bg-gray-200 dark:bg-gray-700 
                           text-gray-700 dark:text-gray-200 
                           hover:opacity-90 transition"
              >
                <XCircle className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressModal;
