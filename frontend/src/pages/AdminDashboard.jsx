import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  ClipboardList,
  Users,
  Utensils,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark text-center">
        <ShieldAlert size={52} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-500">
          Access Denied
        </h2>
        <p className="text-sm text-text-light/60 dark:text-text-dark/60 mt-2">
          Admin privileges required
        </p>
      </div>
    );
  }

  const showComingSoon = (isDark) => {
  Swal.fire({
  title: "Coming Soon",
  text: "This feature is under development.",
  icon: "info",
  showClass: {
    popup: "animate__animated animate__fadeInUp",
  },
  hideClass: {
    popup: "animate__animated animate__fadeOutDown",
  },
  confirmButtonText: "Got it",
  background: isDark ? "#1E1E1E" : "#FFFFFF",
  color: isDark ? "#FFFFFF" : "#121212",
  confirmButtonColor: "#FF5722",
});

};

  const cards = [
    {
      title: "Manage Food Items",
      description: "Create, edit and organize menu items.",
      icon: Utensils,
      action: () => navigate("/food-management"),
    },
    {
      title: "Manage Users",
      description: "View and control user accounts.",
      icon: Users,
      action: () => navigate("/users"),
    },
    {
      title: "All Orders",
      description: "Track, update and fulfill orders.",
      icon: ClipboardList,
      action: () => showComingSoon(
  document.documentElement.classList.contains("dark")
),
    },
  ];

  return (
    <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <motion.h1
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-primary"
      >
        <LayoutDashboard size={34} />
        Admin Dashboard
      </motion.h1>

      {/* ---------- CARDS ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              className="
                relative cursor-pointer rounded-3xl p-6
                bg-white/70 dark:bg-[#1E1E1E]/80
                backdrop-blur-xl
                border border-black/5 dark:border-white/10
                shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]
                group transition-all
              "
            >
              {/* Gradient Ring */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 pointer-events-none" />

              {/* Icon */}
              <div className="relative z-10 flex justify-center mb-5">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  <Icon size={36} />
                </div>
              </div>

              {/* Title */}
              <h2 className="relative z-10 text-lg font-semibold text-center mb-2 group-hover:text-primary transition">
                {card.title}
              </h2>

              {/* Description */}
              <p className="relative z-10 text-sm text-center text-text-light/70 dark:text-text-dark/70">
                {card.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
