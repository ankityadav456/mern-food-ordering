import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import foodBg from "../assets/Images/food-frame-with-asian-dish.jpg";
import logo from "../assets/Images/AppLogo.png";

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const MailIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 dark:text-gray-300"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zm0 0l9 6 9-6"
    />
  </svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2"
    viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 15v2m-4 4h8a2 2 0 002-2v-5a2 2 0 00-2-2H8a2 2 0 00-2 2v5a2 2 0 002 2zm8-10V7a4 4 0 10-8 0v4" />
  </svg>
);

const Signup = () => {
  const { signup } = useAuth();
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const { fullName, email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[0-9!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;

    if (!fullName || fullName.length < 3) {
      return "Full name must be at least 3 characters.";
    }
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password || !passwordRegex.test(password)) {
      return "Password must be at least 6 characters and include a number or special character.";
    }
    return null;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await signup(formData.fullName, formData.email, formData.password);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen p-4 transition-all bg-cover bg-center relative ${darkMode ? "text-white" : "text-gray-900"}`}
      style={{ backgroundImage: `url(${foodBg})` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 px-6 py-8 sm:p-8 rounded-2xl shadow-xl w-full max-w-md transition-all ${
          darkMode ? "bg-[#1e1e1e]/90" : "bg-white/90"
        }`}
      >
        {/* Logo + Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-6">
          <motion.img
            src={logo}
            alt="Yumigo Logo"
            className="h-12 w-12 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">Yumigo</h2>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/30 p-2 rounded mb-4"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div className="relative group">
            <div className="absolute left-3 top-3"><UserIcon /></div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:outline-none text-sm md:text-base
              placeholder-gray-500 dark:border-gray-700 dark:placeholder-gray-400
              focus:ring-orange-500 group-hover:border-orange-500"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute left-3 top-3"><MailIcon /></div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border bg-transparent focus:ring-2 focus:outline-none text-sm md:text-base
              placeholder-gray-500 dark:border-gray-700 dark:placeholder-gray-400
              focus:ring-orange-500 group-hover:border-orange-500"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute left-3 top-3"><LockIcon /></div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 rounded-lg border bg-transparent focus:ring-2 focus:outline-none text-sm md:text-base
              placeholder-gray-500 dark:border-gray-700 dark:placeholder-gray-400
              focus:ring-orange-500 group-hover:border-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-4 text-gray-400 hover:text-orange-500 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Signup Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing up...
              </>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400 hover:underline hover:text-orange-500">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
