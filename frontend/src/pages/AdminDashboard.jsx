import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, Utensils } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-black">
        <h2 className="text-red-500 text-2xl font-bold">🚫 Access Denied: Admins Only</h2>
      </div>
    );
  }

  const cards = [
    {
      title: "Manage Food Items",
      description: "Add, update or remove food from the menu.",
      icon: <Utensils className="w-10 h-10 text-gold" />,
      action: () => navigate("/food-management"),
    },
    {
      title: "Manage Users",
      description: "View and control all user accounts.",
      icon: <Users className="w-10 h-10 text-gold" />,
      action: () => alert("Coming soon!"),
    },
    {
      title: "All Orders",
      description: "Track and manage all placed orders.",
      icon: <ClipboardList className="w-10 h-10 text-gold" />,
      action: () => alert("Coming soon!"),
    },
  ];

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            className="bg-gray-100 dark:bg-[#1f1f1f] border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition duration-300"
          >
            <div className="flex items-center justify-center mb-4">{card.icon}</div>
            <h2 className="text-xl font-semibold text-center mb-2">{card.title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
