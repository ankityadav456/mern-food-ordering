import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, Utensils } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark">
        <h2 className="text-red-500 text-2xl font-bold">
          🚫 Access Denied: Admins Only
        </h2>
      </div>
    );
  }

  const cards = [
    {
      title: "Manage Food Items",
      description: "Add, update or remove food from the menu.",
      icon: <Utensils className="w-12 h-12 text-primary-light dark:text-primary-dark" />,
      action: () => navigate("/food-management"),
    },
    {
      title: "Manage Users",
      description: "View and control all user accounts.",
      icon: <Users className="w-12 h-12 text-primary-light dark:text-primary-dark" />,
      action: () => navigate("/users"),
    },
    {
      title: "All Orders",
      description: "Track and manage all placed orders.",
      icon: <ClipboardList className="w-12 h-12 text-primary-light dark:text-primary-dark" />,
      action: () => alert("Coming soon!"),
    },
  ];

  return (
     <div className="min-h-screen py-6 max-w-7xl mx-auto text-gray-900 dark:text-white">
      {/* Title Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl font-bold mb-10 text-center"
      >
        📊 Admin Dashboard
      </motion.h1>

      {/* Cards with Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={card.action}
            className="bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 cursor-pointer group overflow-hidden relative"
          >
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary-light/10 to-secondary-light/10 dark:from-primary-dark/10 dark:to-secondary-dark/10 transition duration-500 rounded-2xl"></div>

            {/* Icon */}
            <div className="flex items-center justify-center mb-4 relative z-10">
              {card.icon}
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold text-center mb-2 relative z-10 group-hover:text-primary-light dark:group-hover:text-primary-dark transition">
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-text-light/70 dark:text-text-dark/70 text-center relative z-10">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
