import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { motion } from "framer-motion";
import { Loader2, Sun, Moon } from "lucide-react";
import foodBg from "../assets/Images/food-frame-with-asian-dish.jpg"; // Example background image
const Login = () => {
  const { login } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Both fields are required!");
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setError(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} flex items-center justify-center min-h-screen p-4 transition-all bg-cover bg-center`} style={{ backgroundImage: `url(${foodBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className={`${darkMode ? "bg-gray-800" : "bg-white"} p-8 rounded-lg shadow-lg w-full max-w-md transition-all backdrop-blur-md bg-opacity-90`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-semibold text-center w-full">Login</h2>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full transition-all">
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
          </button>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center bg-red-100 p-2 rounded mb-3"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-transparent"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account? {" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;