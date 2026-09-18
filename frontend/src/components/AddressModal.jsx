// src/components/AddressModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { MapPin, X, Check, Loader2 } from "lucide-react";
import { showToast } from "../utils/showToast.jsx";

const AddressModal = ({ onClose, onAddressAdded, initialAddress = null }) => {
  const { saveAddress } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [saving, setSaving] = useState(false);
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
      setFormData({
        fullName: initialAddress.fullName || "",
        mobileNumber: initialAddress.mobileNumber || "",
        roomNumber: initialAddress.roomNumber || "",
        street: initialAddress.street || "",
        city: initialAddress.city || "",
        state: initialAddress.state || "",
        pincode: initialAddress.pincode || "",
      });
    }
  }, [initialAddress]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await saveAddress(formData);
      showToast("Address saved successfully", "success");
      onAddressAdded(saved || formData);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      showToast("Failed to save address", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 my-8 ${
            isDark
              ? "bg-[#18181b] border-neutral-800 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                <MapPin size={18} />
              </div>
              <div>
                <h3 className="font-bold text-base">
                  {initialAddress ? "Edit Delivery Address" : "Add Delivery Address"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Where should we bring your food?
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Recipient Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Ankit Yadav"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>

              {/* Mobile Number */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>

              {/* Room / Flat No */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  Flat / House / Room No.
                </label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  placeholder="e.g. Flat 402, Tower B"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 110001"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>

              {/* Street Address */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  Street / Area / Landmark
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="e.g. MG Road, Near City Mall"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>

              {/* State */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                    isDark
                      ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                      : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                  }`}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  isDark
                    ? "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700"
                    : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
                <span>{initialAddress ? "Save Changes" : "Save Address"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddressModal;
