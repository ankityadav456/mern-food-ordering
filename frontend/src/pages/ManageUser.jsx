import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, UserX, UserCheck, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axiosInstance";
import toast from "react-hot-toast";

export default function ManageUsers() {
  const { allUsers, fetchAllUsers, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingAction, setLoadingAction] = useState(null); // userId of ongoing action

  // Fetch all users on mount
  useEffect(() => {
    if (user?.isAdmin) fetchAllUsers();
  }, [user]);

  // Filter users based on search
  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle user status
  const handleToggleStatus = async (userId, currentStatus) => {
    setLoadingAction(userId);
    try {
      await axios.put(`/admin/users/${userId}/status`, {
        status: currentStatus === "Active" ? "Blocked" : "Active",
      });
      toast.success("User status updated");
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    } finally {
      setLoadingAction(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setLoadingAction(userId);
    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchAllUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setLoadingAction(null);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-light dark:text-text-dark">
        Access Denied
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full md:w-1/2 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-lg">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full bg-transparent outline-none text-text-light dark:text-text-dark"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg shadow hover:opacity-90 w-full md:w-auto">
          + Add User
        </button>
      </div>

      {/* Table for md+ screens */}
      <div className="hidden md:block bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg">
        <table className="w-full table-fixed text-left border-collapse">
  <thead>
    <tr>
      <th className="px-4 py-3 w-1/5 truncate">Name</th>
      <th className="px-4 py-3 w-1/4 truncate">Email</th>
      <th className="px-4 py-3 w-1/6">Role</th>
      <th className="px-4 py-3 w-1/6">Status</th>
      <th className="px-4 py-3 w-1/6 text-right">Actions</th>
    </tr>
  </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <motion.tr
                key={u._id}
                whileHover={{
                  scale: 1.01,
                  backgroundColor: "rgba(255, 87, 34, 0.05)",
                }}
                className="border-b border-gray-100 dark:border-gray-700 transition"
              >
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.isAdmin ? "Admin" : "User"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      u.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-green-100 text-green-600" 
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-end gap-2">
                  <button
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                    disabled={loadingAction === u._id}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${
                      u.status === "Active"
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                    onClick={() => handleToggleStatus(u._id, u.status)}
                    disabled={loadingAction === u._id}
                  >
                    {u.status === "Active" ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDeleteUser(u._id)}
                    disabled={loadingAction === u._id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </motion.tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile */}
      <div className="md:hidden space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((u) => (
            <motion.div
              key={u._id}
              whileHover={{ scale: 1.01 }}
              className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-md p-4 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{u.name}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    u.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {u.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {u.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Role: {u.role || "User"}
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  disabled={loadingAction === u._id}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className={`p-2 rounded-lg ${
                    u.status === "Active"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white`}
                  onClick={() => handleToggleStatus(u._id, u.status)}
                  disabled={loadingAction === u._id}
                >
                  {u.status === "Active" ? (
                    <UserX className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </button>
                <button
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteUser(u._id)}
                  disabled={loadingAction === u._id}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}
