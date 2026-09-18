import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../utils/showToast.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Upload,
  Trash2,
  ArrowLeft,
  Check,
  User,
  Phone,
  MapPin,
  Home,
  Shield,
  Camera,
  Loader2,
  Pencil,
  Plus,
  X,
  Mail,
  Lock,
} from "lucide-react";

const ProfilePage = () => {
  const {
    user,
    updateProfile,
    updateAvatar,
    deleteAvatar,
    saveAddress,
    deleteAddress,
  } = useAuth();

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? `${backendUrl}${user.avatar}` : ""
  );

  const [formData, setFormData] = useState({
    userId: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
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

  // Sync state whenever user in context updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userId: user._id || "",
        name: user.name || "",
        email: user.email || "",
        address: {
          fullName: user.address?.fullName || "",
          mobileNumber: user.address?.mobileNumber || "",
          roomNumber: user.address?.roomNumber || "",
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
        },
      }));
      if (user.avatar) {
        setAvatarPreview(`${backendUrl}${user.avatar}`);
      }
    }
  }, [user, backendUrl]);

  const currentAddress = user?.address || formData.address;
  const hasSavedAddress = Boolean(
    currentAddress &&
      (Boolean(currentAddress.street && currentAddress.street.trim()) ||
        Boolean(currentAddress.city && currentAddress.city.trim()) ||
        Boolean(currentAddress.roomNumber && currentAddress.roomNumber.trim()) ||
        Boolean(currentAddress.pincode && currentAddress.pincode.trim()))
  );

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

    try {
      setIsUploadingAvatar(true);
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
      await updateAvatar(file);
      showToast("Avatar updated successfully", "success");
    } catch (error) {
      showToast("Failed to update avatar", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleDeleteAvatarBtn = async () => {
    try {
      setIsUploadingAvatar(true);
      const response = await deleteAvatar();
      const newAvatarUrl = `${backendUrl}${response}`;
      setAvatarPreview(newAvatarUrl);
      showToast("Avatar removed", "info");
    } catch (error) {
      showToast("Failed to remove avatar", "error");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      showToast("Failed to update profile.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenAddressModal = () => {
    if (user?.address) {
      setFormData((prev) => ({
        ...prev,
        address: {
          fullName: user.address.fullName || "",
          mobileNumber: user.address.mobileNumber || "",
          roomNumber: user.address.roomNumber || "",
          street: user.address.street || "",
          city: user.address.city || "",
          state: user.address.state || "",
          pincode: user.address.pincode || "",
        },
      }));
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await saveAddress(formData.address);
      if (saved) {
        setFormData((prev) => ({ ...prev, address: saved }));
      }
      setIsAddressModalOpen(false);
      showToast("Delivery address saved successfully", "success");
    } catch (error) {
      showToast("Failed to save address", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!window.confirm("Are you sure you want to remove your saved address?")) return;
    setIsSaving(true);
    try {
      await deleteAddress();
      const emptyAddress = {
        fullName: "",
        mobileNumber: "",
        roomNumber: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      };
      setFormData((prev) => ({ ...prev, address: emptyAddress }));
      showToast("Address removed", "info");
    } catch (error) {
      showToast("Failed to remove address", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const hasCustomAvatar = Boolean(
    avatarPreview &&
      !avatarPreview.includes("default-avatar.png") &&
      !avatarPreview.includes("/uploads/avatars/default-avatar.png")
  );

  return (
    <div
      className={`min-h-screen pb-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? "bg-[#0f0f11] text-white" : "bg-[#f8f9fa] text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto pt-6 space-y-6">
        {/* ================= HEADER BAR ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-neutral-400 mb-1">
              <Link to="/dashboard" className="hover:text-primary-light transition">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-gray-800 dark:text-neutral-200">Profile Settings</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Profile & Account
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
              Manage your personal info and default delivery address.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            type="button"
            className={`self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              isDark
                ? "bg-[#161619] border-neutral-800 text-neutral-200 hover:bg-neutral-800"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================= LEFT COLUMN: AVATAR & ACCOUNT SUMMARY ================= */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div
              className={`rounded-2xl border p-6 flex flex-col items-center text-center transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="relative group mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.name || "Avatar"}
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-primary-light/30 dark:ring-primary-dark/30 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center font-bold text-4xl ring-4 ring-primary-light/20">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}

                {/* Camera upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload avatar photo"
                  aria-label="Upload photo"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-primary-light dark:bg-primary-dark text-white shadow-lg hover:opacity-90 transition cursor-pointer"
                >
                  <Camera size={16} />
                </button>

                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleAvatarChange}
              />

              <h2 className="text-lg font-bold truncate max-w-full">
                {user?.name || "User"}
              </h2>

              {user?.email && (
                <p className="text-xs text-gray-500 dark:text-neutral-400 truncate max-w-full mt-1 flex items-center justify-center gap-1.5">
                  <Mail size={13} className="shrink-0 text-gray-400 dark:text-neutral-500" />
                  <span>{user.email}</span>
                </p>
              )}

              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                {user?.isAdmin ? (
                  <>
                    <Shield size={13} />
                    <span>Administrator</span>
                  </>
                ) : (
                  <span>Verified Customer</span>
                )}
              </div>

              {/* Avatar Action Buttons */}
              <div className="mt-5 w-full flex items-center gap-2">
                <button
                  type="button"
                  disabled={isUploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    isDark
                      ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                      : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  <Upload size={13} />
                  <span>Upload Photo</span>
                </button>

                {hasCustomAvatar && (
                  <button
                    type="button"
                    disabled={isUploadingAvatar}
                    onClick={handleDeleteAvatarBtn}
                    title="Remove Photo"
                    className="p-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Delivery Note */}
            <div
              className={`rounded-2xl border p-5 space-y-2 ${
                isDark
                  ? "bg-[#161619] border-neutral-800 text-neutral-300"
                  : "bg-white border-gray-200 text-gray-700 shadow-sm"
              }`}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                Delivery Note
              </h3>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-neutral-400">
                Your saved delivery address is automatically used during food checkout for prompt and accurate doorstep delivery.
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: DETAILS & ADDRESS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card 1: Personal Information */}
            <form
              onSubmit={handleSaveProfile}
              className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Personal Information</h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Your identity and contact details
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  <span>Save Info</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                    }`}
                  />
                </div>

                {/* Registered Email (Account ID / Read-only) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block">
                      Registered Email
                    </label>
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-neutral-500 flex items-center gap-1">
                      <Lock size={10} />
                      Read-only
                    </span>
                  </div>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
                    />
                    <input
                      type="email"
                      value={user?.email || formData.email || ""}
                      disabled
                      readOnly
                      title="Registered email address cannot be changed"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm cursor-not-allowed opacity-80 ${
                        isDark
                          ? "bg-neutral-900/60 border-neutral-800 text-neutral-300"
                          : "bg-gray-100/80 border-gray-200 text-gray-600"
                      }`}
                    />
                  </div>
                </div>

                {/* Contact Mobile */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.address.mobileNumber}
                      onChange={handleChange}
                      placeholder="e.g. 9876543210"
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                        isDark
                          ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                          : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Card 2: Saved Delivery Address */}
            <div
              className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
                isDark
                  ? "bg-[#161619] border-neutral-800"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Delivery Address</h3>
                    <p className="text-xs text-gray-500 dark:text-neutral-400">
                      Where should we deliver your food?
                    </p>
                  </div>
                </div>

                {hasSavedAddress && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleOpenAddressModal}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isDark
                          ? "bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Pencil size={13} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeleteAddress}
                      title="Delete Address"
                      className="p-1.5 rounded-xl border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Display Saved Address Card */}
              {hasSavedAddress ? (
                <div className="pt-1">
                  <div
                    className={`p-5 rounded-2xl border ${
                      isDark
                        ? "bg-neutral-900/70 border-neutral-800"
                        : "bg-gray-50/80 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark">
                          <Home size={15} />
                        </span>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                          {currentAddress.fullName || user?.name || "Default Address"}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Saved
                        </span>
                      </div>

                      {currentAddress.mobileNumber && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400 font-medium">
                          <Phone size={12} />
                          <span>{currentAddress.mobileNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm text-gray-600 dark:text-neutral-300 space-y-1 pl-1">
                      <p>
                        {currentAddress.roomNumber && (
                          <span className="font-semibold">
                            {currentAddress.roomNumber},{" "}
                          </span>
                        )}
                        {currentAddress.street}
                      </p>
                      <p className="text-gray-500 dark:text-neutral-400">
                        {[currentAddress.city, currentAddress.state]
                          .filter(Boolean)
                          .join(", ")}
                        {currentAddress.pincode ? ` - ${currentAddress.pincode}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Address Saved -> Callout with Add Address Button */
                <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/30">
                  <div className="w-12 h-12 mx-auto rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/15 dark:text-primary-dark flex items-center justify-center mb-3">
                    <MapPin size={22} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                    No Saved Address Found
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                    You haven't added a delivery address yet. Add your default address for seamless checkout.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenAddressModal}
                    className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Add Delivery Address</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADDRESS MODAL ================= */}
      {isAddressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setIsAddressModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl my-8 ${
              isDark
                ? "bg-[#18181b] border-neutral-800 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-base">
                    {hasSavedAddress ? "Edit Delivery Address" : "Add Delivery Address"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Enter the destination for your food orders
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddressModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="py-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient Full Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.address.fullName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                    }`}
                  />
                </div>

                {/* Delivery Phone Number */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                    Delivery Phone Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.address.mobileNumber}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
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
                    Flat / House / Room No
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.address.roomNumber}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Sunshine"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                    }`}
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                    Street / Area / Landmark
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="e.g. MG Road, Near Metro"
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
                    value={formData.address.city}
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
                    value={formData.address.state}
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

                {/* Pincode */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-neutral-300 block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    placeholder="e.g. 400001"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition ${
                      isDark
                        ? "bg-neutral-900 border-neutral-800 text-white focus:border-primary-dark focus:ring-primary-dark/20"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-primary-light focus:ring-primary-light/20"
                    }`}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
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
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save Address</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
