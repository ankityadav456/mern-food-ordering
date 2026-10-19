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
  Sparkles,
  LockKeyhole,
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Frosted Dark Backdrop with subtle radial glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeAuthModal}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card - 2-Column Split: Left Image, Right Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-4xl rounded-[28px] overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] border my-auto grid grid-cols-1 md:grid-cols-2 md:h-[620px] transition-colors ${
              isDark
                ? "bg-[#141417] border-neutral-800 text-white shadow-black/80"
                : "bg-white border-neutral-100 text-gray-900"
            }`}
          >
            {/* Top Close Button (Elevated tactile pill button) */}
            <button
              type="button"
              onClick={closeAuthModal}
              className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all z-30 cursor-pointer ${
                isDark
                  ? "bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                  : "bg-gray-100/90 text-gray-500 hover:text-gray-900 hover:bg-gray-200 border border-gray-200/50"
              }`}
              aria-label="Close modal"
            >
              <X size={17} />
            </button>

            {/* ════════════ LEFT COLUMN: IMAGE BANNER ════════════ */}
            <div className="relative hidden md:flex flex-col justify-between w-full h-full bg-neutral-950 overflow-hidden select-none">
              <img
                src={authBanner}
                alt="Good Food Brings People Together - Yumigo"
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.98] contrast-[1.02]"
              />
              {/* Subtle inner edge vignette for seamless transition */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/25 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* ════════════ RIGHT COLUMN: FORM CONTENT ════════════ */}
            <div className="p-7 sm:p-9 md:p-10 flex flex-col justify-between h-full overflow-y-auto">
              <div>
                {/* Mobile Banner Header (when left image is hidden on small screens) */}
                <div className="flex md:hidden items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/30 p-1.5 border border-orange-200/60 dark:border-orange-500/20 shadow-xs flex items-center justify-center">
                    <img src={logo} alt="Yumigo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg leading-tight">Yumigo</h3>
                    <p className="text-[11px] text-gray-400">Good Food Brings People Together</p>
                  </div>
                </div>

                {/* Title & Badge with fixed min-height so text difference does not shift layout */}
                <div className="mb-5 min-h-[64px]">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {authModalTab === "login" ? "Welcome Back" : "Create Account"}
                  </h2>
                  <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${isDark ? "text-neutral-400" : "text-gray-500"}`}>
                    {authModalTab === "login"
                      ? "Enter your credentials to access your account."
                      : "Join Yumigo to discover and order delicious meals."}
                  </p>
                </div>

                {/* Segmented Switcher Tabs (iOS / Linear Style) */}
                <div
                  className={`relative flex items-center p-1 rounded-2xl mb-5 ${
                    isDark
                      ? "bg-neutral-900/90 border border-neutral-800"
                      : "bg-gray-100 border border-gray-200/60"
                  }`}
                >
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className={`relative flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors z-10 cursor-pointer ${
                    authModalTab === "login"
                      ? isDark
                        ? "text-white"
                        : "text-gray-900"
                      : isDark
                      ? "text-neutral-400 hover:text-neutral-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {authModalTab === "login" && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className={`absolute inset-0 rounded-xl shadow-sm ${
                        isDark ? "bg-neutral-800 border border-neutral-700/60" : "bg-white"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => switchTab("signup")}
                  className={`relative flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors z-10 cursor-pointer ${
                    authModalTab === "signup"
                      ? isDark
                        ? "text-white"
                        : "text-gray-900"
                      : isDark
                      ? "text-neutral-400 hover:text-neutral-200"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {authModalTab === "signup" && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className={`absolute inset-0 rounded-xl shadow-sm ${
                        isDark ? "bg-neutral-800 border border-neutral-700/60" : "bg-white"
                      }`}
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">Sign Up</span>
                </button>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div
                      className={`flex items-start gap-2.5 p-3 rounded-2xl text-xs font-medium ${
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name (Sign Up only) */}
                {authModalTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      Full Name
                    </label>
                    <div
                      className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                        isDark
                          ? "bg-neutral-900/90 border-neutral-700/80 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10"
                          : "bg-white border-gray-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 shadow-xs"
                      }`}
                    >
                      <div className="pl-3.5 pr-2 text-neutral-400">
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
                        className={`w-full py-2.5 pr-3.5 text-sm bg-transparent outline-none ${
                          isDark ? "text-white placeholder-neutral-500" : "text-gray-900 placeholder-gray-400"
                        }`}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                    Email Address
                  </label>
                  <div
                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                      isDark
                        ? "bg-neutral-900/90 border-neutral-700/80 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10"
                        : "bg-white border-gray-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 shadow-xs"
                    }`}
                  >
                    <div className="pl-3.5 pr-2 text-neutral-400">
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
                      className={`w-full py-2.5 pr-3.5 text-sm bg-transparent outline-none ${
                        isDark ? "text-white placeholder-neutral-500" : "text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`text-xs font-semibold ${isDark ? "text-neutral-300" : "text-gray-700"}`}>
                      Password
                    </label>
                  </div>
                  <div
                    className={`relative flex items-center rounded-xl border transition-all duration-200 ${
                      isDark
                        ? "bg-neutral-900/90 border-neutral-700/80 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10"
                        : "bg-white border-gray-200 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 shadow-xs"
                    }`}
                  >
                    <div className="pl-3.5 pr-2 text-neutral-400">
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
                      className={`w-full py-2.5 pr-10 text-sm bg-transparent outline-none ${
                        isDark ? "text-white placeholder-neutral-500" : "text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 transition cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                {authModalTab === "login" && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-md border transition-all flex items-center justify-center ${
                            rememberMe
                              ? "bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 text-white"
                              : isDark
                              ? "border-neutral-700 bg-neutral-800 group-hover:border-neutral-600"
                              : "border-gray-300 bg-white group-hover:border-gray-400"
                          }`}
                        >
                          {rememberMe && (
                            <svg className="w-2.5 h-2.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className={isDark ? "text-neutral-400 group-hover:text-neutral-300" : "text-gray-600 group-hover:text-gray-800"}>
                        Remember me
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      className="text-orange-500 hover:text-orange-600 hover:underline transition font-semibold"
                    >
                      Need help?
                    </button>
                  </div>
                )}

                {/* Submit Button (Vibrant Warm Amber/Orange with hover lift and glow) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-3 px-4 rounded-2xl font-bold text-white text-sm bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] transition-all duration-200 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
            </div>

            {/* Bottom Footer: Switcher & Security Badge */}
            <div className="pt-3">
              {/* Bottom Switcher */}
              <div className="text-center text-xs">
                {authModalTab === "login" ? (
                  <p className={isDark ? "text-neutral-400" : "text-gray-600"}>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition ml-1 cursor-pointer"
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
                      className="font-bold text-orange-500 hover:text-orange-600 hover:underline transition ml-1 cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>

              {/* Trust Badge / Security Info */}
              <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <LockKeyhole size={13} className="text-emerald-500 shrink-0" />
                <span>256-bit encrypted secure authentication</span>
              </div>
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
