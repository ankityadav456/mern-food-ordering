// pages/ManageUser.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, UserCheck, UserX, Edit, Loader2, ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";

const ManageUser = () => {
  const {
    allUsers,
    fetchAllUsers,
    deleteUser,
    toggleUserStatus,
    updateUser,
    user,
    loadingUsers,
    loading,
  } = useAuth();

  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    if (user?.isAdmin) fetchAllUsers();
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg font-semibold">
        🚫 You are not authorized to view this page.
      </div>
    );
  }

  if (loading || loadingUsers) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-text-light dark:text-text-dark text-lg font-medium">
        <Loader2 size={28} className="animate-spin mr-2" /> Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background-light dark:bg-background-dark px-6 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">Manage Users</h1>
          <div className="text-sm text-text-subtleLight dark:text-text-subtleDark">
            Total Users: <span className="font-semibold">{allUsers.length}</span>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-secondary-light/20 dark:bg-secondary-dark/10">
                <tr>
                  <th className="p-4 text-text-light dark:text-text-dark font-semibold">Name</th>
                  <th className="p-4 text-text-light dark:text-text-dark font-semibold">Email</th>
                  <th className="p-4 text-text-light dark:text-text-dark font-semibold">Role</th>
                  <th className="p-4 text-text-light dark:text-text-dark font-semibold">Status</th>
                  <th className="p-4 text-text-light dark:text-text-dark font-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {allUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center p-6 text-text-subtleLight dark:text-text-subtleDark"
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    allUsers.map((u) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/5 transition-all duration-200"
                      >
                        {/* Name */}
                        <td className="p-4 text-text-light dark:text-text-dark font-medium flex items-center gap-2">
                          {u.name}
                          {u.isAdmin && (
                            <span className="flex items-center text-xs px-2 py-0.5 rounded-md bg-primary-light text-white">
                              <ShieldCheck size={14} className="mr-1" />
                              Admin
                            </span>
                          )}
                        </td>

                        {/* Email */}
                        <td className="p-4 text-text-subtleLight dark:text-text-subtleDark">
                          {u.email}
                        </td>

                        {/* Role */}
                        <td className="p-4">
                          {u.isAdmin ? (
                            <span className="px-2 py-1 text-xs rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                              Admin
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                              User
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-md ${
                              u.status === "Blocked"
                                ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                                : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            }`}
                          >
                            {u.status || "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-4 flex items-center justify-center gap-3">
                          {/* Toggle Status */}
                          <button
                            disabled={actionLoading[u._id]?.status}
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white transition-all shadow-md hover:scale-105"
                            onClick={async () => {
                              setActionLoading((prev) => ({
                                ...prev,
                                [u._id]: { ...prev[u._id], status: true },
                              }));
                              await toggleUserStatus(u._id, u.status || "Active");
                              setActionLoading((prev) => ({
                                ...prev,
                                [u._id]: { ...prev[u._id], status: false },
                              }));
                            }}
                            title="Toggle Status"
                          >
                            {actionLoading[u._id]?.status ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : u.status === "Blocked" ? (
                              <UserX size={16} />
                            ) : (
                              <UserCheck size={16} />
                            )}
                          </button>

                          {/* Edit */}
                          <button
                            disabled={actionLoading[u._id]?.edit}
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-light hover:bg-primary-dark disabled:opacity-50 text-white transition-all shadow-md hover:scale-105"
                            title="Edit User"
                            onClick={async () => {
                              const { value: formValues } = await Swal.fire({
                                title: "Edit User",
                                background: document.documentElement.classList.contains("dark")
                                  ? "#1E1E1E"
                                  : "#FFFFFF",
                                color: document.documentElement.classList.contains("dark")
                                  ? "#FFFFFF"
                                  : "#000000",
                                html: `
                                  <input id="swal-name" class="swal2-input" placeholder="Name" value="${u.name}" />
                                  <input id="swal-email" type="email" class="swal2-input" placeholder="Email" value="${u.email}" />
                                  <div style="margin-top:15px; display:flex; align-items:center; justify-content:center; gap:10px;">
                                    <label for="swal-admin" style="font-size:16px; font-weight:500;">Make Admin</label>
                                    <label class="switch">
                                      <input type="checkbox" id="swal-admin" ${u.isAdmin ? "checked" : ""}>
                                      <span class="slider round"></span>
                                    </label>
                                  </div>
                                  <style>
                                    .switch {
                                      position: relative;
                                      display: inline-block;
                                      width: 48px;
                                      height: 24px;
                                    }
                                    .switch input {
                                      opacity: 0;
                                      width: 0;
                                      height: 0;
                                    }
                                    .slider {
                                      position: absolute;
                                      cursor: pointer;
                                      top: 0; left: 0; right: 0; bottom: 0;
                                      background-color: #ccc;
                                      transition: .3s;
                                      border-radius: 24px;
                                    }
                                    .slider:before {
                                      position: absolute;
                                      content: "";
                                      height: 18px;
                                      width: 18px;
                                      left: 3px;
                                      bottom: 3px;
                                      background-color: white;
                                      transition: .3s;
                                      border-radius: 50%;
                                    }
                                    input:checked + .slider {
                                      background-color: #FF5722;
                                    }
                                    input:checked + .slider:before {
                                      transform: translateX(24px);
                                    }
                                  </style>
                                `,
                                focusConfirm: false,
                                showCancelButton: true,
                                confirmButtonText: "Update",
                                confirmButtonColor: "#FF5722",
                                preConfirm: () => {
                                  const name = document.getElementById("swal-name").value;
                                  const email = document.getElementById("swal-email").value;
                                  const isAdmin = document.getElementById("swal-admin").checked;
                                  if (!name || !email) {
                                    Swal.showValidationMessage("Name and Email are required");
                                    return null;
                                  }
                                  return { name, email, isAdmin };
                                },
                              });

                              if (formValues) {
                                setActionLoading((prev) => ({
                                  ...prev,
                                  [u._id]: { ...prev[u._id], edit: true },
                                }));
                                await updateUser(u._id, formValues);
                                setActionLoading((prev) => ({
                                  ...prev,
                                  [u._id]: { ...prev[u._id], edit: false },
                                }));
                              }
                            }}
                          >
                            {actionLoading[u._id]?.edit ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Edit size={16} />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            disabled={actionLoading[u._id]?.delete}
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white transition-all shadow-md hover:scale-105"
                            title="Delete User"
                            onClick={() => {
                              Swal.fire({
                                title: "Are you sure?",
                                text: "This action cannot be undone.",
                                icon: "warning",
                                background: document.documentElement.classList.contains("dark")
                                  ? "#1E1E1E"
                                  : "#FFFFFF",
                                color: document.documentElement.classList.contains("dark")
                                  ? "#FFFFFF"
                                  : "#000000",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Yes, delete it!",
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  setActionLoading((prev) => ({
                                    ...prev,
                                    [u._id]: { ...prev[u._id], delete: true },
                                  }));
                                  await deleteUser(u._id);
                                  setActionLoading((prev) => ({
                                    ...prev,
                                    [u._id]: { ...prev[u._id], delete: false },
                                  }));
                                }
                              });
                            }}
                          >
                            {actionLoading[u._id]?.delete ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
