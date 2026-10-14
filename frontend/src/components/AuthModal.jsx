// src/components/AuthModal.jsx
import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import authBanner from "../assets/Images/authBanner.jpg";
import logo from "../assets/Images/AppLogo.png";

const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuthModal, setAuthModalTab, login, signup } =
    useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Reset errors and password visibility when tab changes or modal opens
  useEffect(() => {
    if (authModalOpen) {
      setError("");
      setShowPassword(false);
    }
  }, [authModalOpen, authModalTab]);

  // Handle Escape key & lock scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    };
    if (authModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [authModalOpen, closeAuthModal]);

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 2) return { score: 2, label: "Fair", color: "bg-orange-500" };
    if (score <= 3) return { score: 3, label: "Good", color: "bg-amber-500" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
  }, [password]);

  const switchTab = (tab) => {
    setError("");
    setAuthModalTab(tab);
  };

  const validate = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return "Email address is required.";
    if (!emailPattern.test(email.trim())) return "Please enter a valid email address.";

    if (authModalTab === "signup") {
      if (!fullName.trim() || fullName.trim().length < 3) {
        return "Full name must be at least 3 characters.";
      }
      if (password.length < 6) {
        return "Password must be at least 6 characters.";
      }
    } else {
      if (!password) return "Password is required.";
      if (password.length < 6) {
        return "Password must be at least 6 characters.";
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      if (authModalTab === "login") {
        await login(email.trim(), password);
      } else {
        await signup(fullName.trim(), email.trim(), password);
      }
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Authentication failed. Please check your credentials.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {authModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card - 2-Column Split: Left Image, Right Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: "spring", duration: 0.38, bounce: 0.12 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-auto grid grid-cols-1 md:grid-cols-2 ${
              isDark
                ? "bg-[#141416] border-neutral-800 text-white"
                : "bg-white border-gray-100 text-gray-900"
            }`}
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={closeAuthModal}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all z-30 ${
                isDark
                  ? "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              }`}
              aria-label="Close modal"
            >
              <X size={19} />
            </button>

            {/* ════════════ LEFT COLUMN: IMAGE BANNER ════════════ */}
            <div className="relative hidden md:flex flex-col justify-between w-full h-full min-h-[560px] bg-neutral-950 overflow-hidden select-none">
              <img
                src={authBanner}
                alt="Good Food Brings People Together - Yumigo"
                className="absolute inset-0 w-full h-full object-cover object-top"
              />
              {/* Subtle inner edge shadow for seamless separation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* ════════════ RIGHT COLUMN: FORM CONTENT ════════════ */}
            <div className="p-6 sm:p-9 flex flex-col justify-center">
              {/* Mobile Banner Header (when left image is hidden on small screens) */}
              <div className="flex md:hidden items-center gap-3 mb-5">
                <img src={logo} alt="Yumigo" className="w-10 h-10 rounded-xl" />
                <div>
                  <h3 className="font-bold text-lg leading-tight">Yumigo</h3>
                  <p className="text-[11px] text-gray-400">Good Food Brings People Together</p>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {authModalTab === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className={`text-xs sm:text-sm mt-1 ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                  {authModalTab === "login"
                    ? "Enter your credentials to access your account."
                    : "Join Yumigo to discover and order delicious meals."}
                </p>
              </div>

              {/* Segmented Switcher Tabs */}
              <div
                className={`grid grid-cols-2 p-1 rounded-2xl mb-5 ${
                  isDark ? "bg-neutral-900 border border-neutral-800" : "bg-gray-100"
                }`}
              >
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                    authModalTab === "login"
                      ? isDark
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "bg-white text-gray-900 shadow-sm"
                      : isDark
                      ? "text-neutral-400 hover:text-neutral-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className={`py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                    authModalTab === "signup"
                      ? isDark
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "bg-white text-gray-900 shadow-sm"
                      : isDark
                      ? "text-neutral-400 hover:text-neutral-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div
                      className={`flex items-start gap-2.5 p-3 rounded-xl text-xs ${
                        isDark
                          ? "bg-red-500/15 border border-red-500/30 text-red-400"
                          : "bg-red-50 border border-red-200 text-red-600"
                      }`}
                    >
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name (Sign Up only) */}
                {authModalTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1"
                  >
                    <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <User size={17} />
                      </div>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (error) setError("");
                        }}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all border ${
                          isDark
                            ? "bg-neutral-900/80 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
                        }`}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Address */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail size={17} />
                    </div>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all border ${
                        isDark
                          ? "bg-neutral-900/80 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError("");
                      }}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all border ${
                        isDark
                          ? "bg-neutral-900/80 border-neutral-800 text-white placeholder-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/15"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>

                  {/* Password Strength Meter (Sign Up only) */}
                  {authModalTab === "signup" && password && (
                    <div className="pt-1 space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : isDark
                                ? "bg-neutral-800"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={isDark ? "text-neutral-400" : "text-gray-500"}>
                          Strength:
                        </span>
                        <span className="font-semibold text-amber-500">
                          {passwordStrength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me */}
                {authModalTab === "login" && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 w-3.5 h-3.5"
                      />
                      <span className={isDark ? "text-neutral-400" : "text-gray-600"}>
                        Remember me
                      </span>
                    </label>
                  </div>
                )}

                {/* Submit Button (Amber / Warm Yellow gradient matching the banner) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 active:scale-[0.99] transition-all duration-200 shadow-md shadow-orange-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{authModalTab === "login" ? "Signing In..." : "Creating Account..."}</span>
                    </>
                  ) : (
                    <>
                      {authModalTab === "login" ? (
                        <>
                          <span>Sign In</span>
                          <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>Create Account</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </form>

              {/* Bottom Switcher */}
              <div className="mt-5 text-center text-xs">
                {authModalTab === "login" ? (
                  <p className={isDark ? "text-neutral-400" : "text-gray-600"}>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      className="font-semibold text-amber-500 hover:text-amber-600 hover:underline transition ml-1 cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </p>
                ) : (
                  <p className={isDark ? "text-neutral-400" : "text-gray-600"}>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("login")}
                      className="font-semibold text-amber-500 hover:text-amber-600 hover:underline transition ml-1 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AuthModal;
