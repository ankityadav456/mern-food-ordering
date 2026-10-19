// pages/ManageUser.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  UserCheck,
  UserX,
  Edit,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Search,
  Users,
  Radio,
  Clock,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const formatDateTime = (dateStr) => {
  if (!dateStr) return { date: "Never", time: "" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { date: "N/A", time: "" };

  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
};

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return null;
};

const ManageUser = () => {
  const {
    allUsers,
    fetchAllUsers,
    deleteUser,
    toggleUserStatus,
    updateUser,
    user,
    loading,
    loadingUsers,
  } = useAuth();

  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [onlineFilter, setOnlineFilter] = useState("all"); // "all", "active_now", "offline"
  const [roleFilter, setRoleFilter] = useState("all"); // "all", "admin", "user"
  const [accountStatusFilter, setAccountStatusFilter] = useState("all"); // "all", "Active", "Blocked"
  const [activityTimeFilter, setActivityTimeFilter] = useState("all"); // "all", "today", "week", "never"

  // DataTable Sorting & Pagination State
  const [sortColumn, setSortColumn] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc"); // "asc" | "desc"
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Initial fetch and auto-refresh every 30 seconds
  useEffect(() => {
    if (user?.isAdmin) {
      fetchAllUsers();
      const interval = setInterval(() => {
        fetchAllUsers(false); // silent update
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAllUsers(false);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Reset to first page when any search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, onlineFilter, roleFilter, accountStatusFilter, activityTimeFilter, pageSize]);

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm !== "" ||
    onlineFilter !== "all" ||
    roleFilter !== "all" ||
    accountStatusFilter !== "all" ||
    activityTimeFilter !== "all";

  const clearAllFilters = () => {
    setSearchTerm("");
    setOnlineFilter("all");
    setRoleFilter("all");
    setAccountStatusFilter("all");
    setActivityTimeFilter("all");
  };

  // Summary counts across all users
  const stats = useMemo(() => {
    const list = allUsers || [];
    const total = list.length;
    const activeNow = list.filter((u) => u.isCurrentlyActive).length;
    const admins = list.filter((u) => u.isAdmin).length;
    const blocked = list.filter((u) => u.status === "Blocked").length;
    return { total, activeNow, admins, blocked };
  }, [allUsers]);

  // Filtered and Sorted Users
  const filteredUsers = useMemo(() => {
    if (!allUsers) return [];

    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const oneWeekMs = 7 * oneDayMs;

    return allUsers
      .filter((u) => {
        // Search filter (Name or Email)
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matches =
            u.name?.toLowerCase().includes(term) ||
            u.email?.toLowerCase().includes(term);
          if (!matches) return false;
        }

        // Online filter
        if (onlineFilter === "active_now" && !u.isCurrentlyActive) return false;
        if (onlineFilter === "offline" && u.isCurrentlyActive) return false;

        // Role filter
        if (roleFilter === "admin" && !u.isAdmin) return false;
        if (roleFilter === "user" && u.isAdmin) return false;

        // Account status filter
        if (accountStatusFilter !== "all" && (u.status || "Active") !== accountStatusFilter) {
          return false;
        }

        // Activity / Login Time Filter
        if (activityTimeFilter === "today") {
          if (!u.lastLogin || now - new Date(u.lastLogin).getTime() > oneDayMs) return false;
        } else if (activityTimeFilter === "week") {
          if (!u.lastLogin || now - new Date(u.lastLogin).getTime() > oneWeekMs) return false;
        } else if (activityTimeFilter === "never") {
          if (u.lastLogin) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA, valB;

        switch (sortColumn) {
          case "name":
            valA = (a.name || "").toLowerCase();
            valB = (b.name || "").toLowerCase();
            return sortDirection === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);

          case "email":
            valA = (a.email || "").toLowerCase();
            valB = (b.email || "").toLowerCase();
            return sortDirection === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);

          case "role":
            valA = a.isAdmin ? 1 : 0;
            valB = b.isAdmin ? 1 : 0;
            break;

          case "isCurrentlyActive":
            valA = a.isCurrentlyActive ? 1 : 0;
            valB = b.isCurrentlyActive ? 1 : 0;
            break;

          case "lastLogin":
            valA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
            valB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
            break;

          case "createdAt":
            valA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            valB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            break;

          case "status":
            valA = a.status || "Active";
            valB = b.status || "Active";
            return sortDirection === "asc"
              ? valA.localeCompare(valB)
              : valB.localeCompare(valA);

          default:
            return 0;
        }

        if (sortDirection === "asc") {
          return valA > valB ? 1 : valA < valB ? -1 : 0;
        } else {
          return valA < valB ? 1 : valA > valB ? -1 : 0;
        }
      });
  }, [
    allUsers,
    searchTerm,
    onlineFilter,
    roleFilter,
    accountStatusFilter,
    activityTimeFilter,
    sortColumn,
    sortDirection,
  ]);

  // Pagination Calculations
  const totalEntries = filteredUsers.length;
  const totalPages = Math.ceil(totalEntries / pageSize) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalEntries);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // Sorting Handler
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Render Sort Icon
  const renderSortIcon = (columnKey) => {
    if (sortColumn !== columnKey) {
      return <ArrowUpDown size={13} className="text-gray-400 group-hover:text-primary-light" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp size={13} className="text-primary-light" />
    ) : (
      <ArrowDown size={13} className="text-primary-light" />
    );
  };

  // Export to CSV Function
  const exportToCSV = () => {
    if (!filteredUsers?.length) return;

    const headers = [
      "ID",
      "Name",
      "Email",
      "Role",
      "Online Status",
      "Last Login",
      "First Joined",
      "Account Status",
    ];

    const rows = filteredUsers.map((u) => [
      `"${u._id}"`,
      `"${(u.name || "").replace(/"/g, '""')}"`,
      `"${(u.email || "").replace(/"/g, '""')}"`,
      u.isAdmin ? "Admin" : "User",
      u.isCurrentlyActive ? "Active Now" : "Offline",
      u.lastLogin ? `"${new Date(u.lastLogin).toLocaleString()}"` : '"Never"',
      u.createdAt ? `"${new Date(u.createdAt).toLocaleString()}"` : '"N/A"',
      u.status || "Active",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `yumigo_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user?.isAdmin) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500 text-lg font-semibold">
        🚫 You are not authorized to view this page.
      </div>
    );
  }

  if (loading && !allUsers?.length) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-text-light dark:text-text-dark text-lg font-medium">
        <Loader2 size={28} className="animate-spin mr-2" /> Loading users...
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background-light dark:bg-background-dark px-4 sm:px-6 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-light dark:text-text-dark tracking-tight">
              Manage Users
            </h1>
            <p className="text-sm text-text-subtleLight dark:text-text-subtleDark mt-1">
              Interactive DataTable with sorting, filters, login history, and real-time active status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Export CSV Button */}
            <button
              onClick={exportToCSV}
              disabled={!filteredUsers?.length}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800/60 shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer text-sm font-medium"
              title="Export current table to CSV"
            >
              <Download size={15} />
              <span>Export CSV</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || loadingUsers}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800/60 shadow-sm transition-all duration-200 cursor-pointer text-sm font-medium"
              title="Refresh users live"
            >
              <RefreshCw
                size={15}
                className={`${isRefreshing || loadingUsers ? "animate-spin text-primary-light" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Quick Stat Cards (Clickable Quick Filters) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div
            onClick={clearAllFilters}
            className={`p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              !hasActiveFilters
                ? "border-primary-light ring-2 ring-primary-light/20"
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-subtleLight dark:text-text-subtleDark">
                Total Users
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Users size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text-light dark:text-text-dark mt-2">
              {stats.total}
            </div>
            <div className="text-[11px] text-text-subtleLight dark:text-text-subtleDark mt-1">
              Click to view all
            </div>
          </div>

          {/* Active Now */}
          <div
            onClick={() => {
              clearAllFilters();
              setOnlineFilter("active_now");
            }}
            className={`p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              onlineFilter === "active_now"
                ? "border-emerald-500 ring-2 ring-emerald-500/20"
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-subtleLight dark:text-text-subtleDark">
                Active Now
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Radio size={16} />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.activeNow}
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Online
              </span>
            </div>
            <div className="text-[11px] text-text-subtleLight dark:text-text-subtleDark mt-1">
              Click to filter online
            </div>
          </div>

          {/* Admins */}
          <div
            onClick={() => {
              clearAllFilters();
              setRoleFilter("admin");
            }}
            className={`p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              roleFilter === "admin"
                ? "border-purple-500 ring-2 ring-purple-500/20"
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-subtleLight dark:text-text-subtleDark">
                Admins
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text-light dark:text-text-dark mt-2">
              {stats.admins}
            </div>
            <div className="text-[11px] text-text-subtleLight dark:text-text-subtleDark mt-1">
              Click to filter admins
            </div>
          </div>

          {/* Blocked Users */}
          <div
            onClick={() => {
              clearAllFilters();
              setAccountStatusFilter("Blocked");
            }}
            className={`p-4 rounded-2xl bg-surface-light dark:bg-surface-dark border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
              accountStatusFilter === "Blocked"
                ? "border-red-500 ring-2 ring-red-500/20"
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-subtleLight dark:text-text-subtleDark">
                Blocked
              </span>
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400">
                <UserX size={16} />
              </div>
            </div>
            <div className="text-2xl font-bold text-text-light dark:text-text-dark mt-2">
              {stats.blocked}
            </div>
            <div className="text-[11px] text-text-subtleLight dark:text-text-subtleDark mt-1">
              Click to filter blocked
            </div>
          </div>
        </div>

        {/* DataTable Filters Panel */}
        <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Search Input with Clear Button */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by user name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/40 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Online Status Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-text-subtleLight dark:text-text-subtleDark hidden sm:inline">
                  Presence:
                </span>
                <select
                  value={onlineFilter}
                  onChange={(e) => setOnlineFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/30 cursor-pointer"
                >
                  <option value="all">All Presence</option>
                  <option value="active_now">🟢 Active Now</option>
                  <option value="offline">⚪ Offline</option>
                </select>
              </div>

              {/* Role Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-text-subtleLight dark:text-text-subtleDark hidden sm:inline">
                  Role:
                </span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/30 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Account Status Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-text-subtleLight dark:text-text-subtleDark hidden sm:inline">
                  Status:
                </span>
                <select
                  value={accountStatusFilter}
                  onChange={(e) => setAccountStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/30 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              {/* Login Time Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-text-subtleLight dark:text-text-subtleDark hidden sm:inline">
                  Login Time:
                </span>
                <select
                  value={activityTimeFilter}
                  onChange={(e) => setActivityTimeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light/30 cursor-pointer"
                >
                  <option value="all">Any Login Time</option>
                  <option value="today">Logged in Today</option>
                  <option value="week">Active in Past 7 Days</option>
                  <option value="never">Never Logged In</option>
                </select>
              </div>

              {/* Reset Filters Button */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 transition-all cursor-pointer"
                >
                  <X size={14} />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DataTable Container */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead className="bg-secondary-light/20 dark:bg-secondary-dark/10 select-none">
                <tr>
                  {/* User Column */}
                  <th
                    onClick={() => handleSort("name")}
                    className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>User</span>
                      {renderSortIcon("name")}
                    </div>
                  </th>

                  {/* Role Column */}
                  <th
                    onClick={() => handleSort("role")}
                    className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Role</span>
                      {renderSortIcon("role")}
                    </div>
                  </th>

                  {/* Active Now Column */}
                  <th
                    onClick={() => handleSort("isCurrentlyActive")}
                    className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Active Now</span>
                      {renderSortIcon("isCurrentlyActive")}
                    </div>
                  </th>

                  {/* Last Login Column */}
                  <th
                    onClick={() => handleSort("lastLogin")}
                    className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Last Login</span>
                      {renderSortIcon("lastLogin")}
                    </div>
                  </th>

                  {/* First Joined Column */}
                  <th
                    onClick={() => handleSort("createdAt")}
                    className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>First Joined</span>
                      {renderSortIcon("createdAt")}
                    </div>
                  </th>

                  {/* Account Status Column */}
                  <th
                    onClick={() => handleSort("status")}
                    className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Account Status</span>
                      {renderSortIcon("status")}
                    </div>
                  </th>

                  {/* Actions Column */}
                  <th className="p-4 text-text-light dark:text-text-dark font-semibold text-xs uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {!paginatedUsers?.length ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center p-12 text-text-subtleLight dark:text-text-subtleDark text-sm"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={32} className="text-gray-300 dark:text-gray-600 mb-1" />
                          <div className="font-semibold text-base text-text-light dark:text-text-dark">
                            No users found
                          </div>
                          <div className="text-xs text-text-subtleLight dark:text-text-subtleDark">
                            {hasActiveFilters
                              ? "Try adjusting your filters or search keywords."
                              : "No registered users currently available."}
                          </div>
                          {hasActiveFilters && (
                            <button
                              onClick={clearAllFilters}
                              className="mt-3 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-light text-white hover:bg-primary-dark transition-all cursor-pointer"
                            >
                              Clear all filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((u) => {
                      const lastLoginFmt = formatDateTime(u.lastLogin);
                      const lastLoginAgo = formatTimeAgo(u.lastLogin);
                      const createdAtFmt = formatDateTime(u.createdAt);
                      const createdAtAgo = formatTimeAgo(u.createdAt);

                      return (
                        <motion.tr
                          key={u._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="border-b border-gray-200 dark:border-gray-700/60 hover:bg-secondary-light/10 dark:hover:bg-secondary-dark/5 transition-all duration-150"
                        >
                          {/* User (Name + Email + Avatar) */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-primary-light flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden flex-shrink-0">
                                  {u.avatar && !u.avatar.includes("default-avatar") ? (
                                    <img
                                      src={u.avatar}
                                      alt={u.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = "none";
                                      }}
                                    />
                                  ) : (
                                    u.name?.charAt(0).toUpperCase() || "U"
                                  )}
                                </div>
                                {/* Status dot on avatar */}
                                <span
                                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                                    u.isCurrentlyActive ? "bg-emerald-500" : "bg-gray-400"
                                  }`}
                                  title={u.isCurrentlyActive ? "Active now" : "Offline"}
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="text-text-light dark:text-text-dark font-medium text-sm flex items-center gap-2 truncate">
                                  <span>{u.name}</span>
                                  {u.isAdmin && (
                                    <span className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-md bg-primary-light text-white font-semibold">
                                      <ShieldCheck size={11} className="mr-0.5" />
                                      Admin
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-text-subtleLight dark:text-text-subtleDark truncate">
                                  {u.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="p-4">
                            {u.isAdmin ? (
                              <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                Admin
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                User
                              </span>
                            )}
                          </td>

                          {/* Active Now */}
                          <td className="p-4">
                            {u.isCurrentlyActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 shadow-xs">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Active Now
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                <span className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"></span>
                                Offline
                              </span>
                            )}
                          </td>

                          {/* Last Login */}
                          <td className="p-4">
                            {u.lastLogin ? (
                              <div className="text-xs">
                                <div className="flex items-center gap-1 text-text-light dark:text-text-dark font-medium">
                                  <Clock size={12} className="text-gray-400" />
                                  <span>{lastLoginFmt.date}</span>
                                </div>
                                <div className="text-[11px] text-text-subtleLight dark:text-text-subtleDark pl-4">
                                  {lastLoginFmt.time}
                                  {lastLoginAgo && (
                                    <span className="ml-1 text-gray-400">({lastLoginAgo})</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-text-subtleLight dark:text-text-subtleDark italic">
                                Never logged in
                              </span>
                            )}
                          </td>

                          {/* First Joined (First Time) */}
                          <td className="p-4">
                            {u.createdAt ? (
                              <div className="text-xs">
                                <div className="flex items-center gap-1 text-text-light dark:text-text-dark font-medium">
                                  <Calendar size={12} className="text-gray-400" />
                                  <span>{createdAtFmt.date}</span>
                                </div>
                                <div className="text-[11px] text-text-subtleLight dark:text-text-subtleDark pl-4">
                                  {createdAtFmt.time}
                                  {createdAtAgo && (
                                    <span className="ml-1 text-gray-400">({createdAtAgo})</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-text-subtleLight dark:text-text-subtleDark">
                                N/A
                              </span>
                            )}
                          </td>

                          {/* Account Status */}
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                                u.status === "Blocked"
                                  ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                                  : "bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                              }`}
                            >
                              {u.status || "Active"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              {/* Toggle Status */}
                              <button
                                disabled={actionLoading[u._id]?.status}
                                className={`flex items-center justify-center w-8 h-8 rounded-lg text-white transition-all shadow-sm hover:scale-105 cursor-pointer disabled:opacity-50 ${
                                  u.status === "Blocked"
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "bg-amber-500 hover:bg-amber-600"
                                }`}
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
                                title={u.status === "Blocked" ? "Unblock User" : "Block User"}
                              >
                                {actionLoading[u._id]?.status ? (
                                  <Loader2 size={15} className="animate-spin" />
                                ) : u.status === "Blocked" ? (
                                  <UserCheck size={15} />
                                ) : (
                                  <UserX size={15} />
                                )}
                              </button>

                              {/* Edit User */}
                              <button
                                disabled={actionLoading[u._id]?.edit}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-light hover:bg-primary-dark text-white transition-all shadow-sm hover:scale-105 cursor-pointer disabled:opacity-50"
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
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <Edit size={15} />
                                )}
                              </button>

                              {/* Delete User */}
                              <button
                                disabled={actionLoading[u._id]?.delete}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm hover:scale-105 cursor-pointer disabled:opacity-50"
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
                                  <Loader2 size={15} className="animate-spin" />
                                ) : (
                                  <Trash2 size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* DataTable Pagination Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtleLight dark:text-text-subtleDark">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 text-text-light dark:text-text-dark font-medium focus:outline-none focus:ring-1 focus:ring-primary-light"
              >
                {[5, 10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>entries</span>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <span>
                {totalEntries === 0
                  ? "Showing 0 of 0 users"
                  : `Showing ${startIndex + 1} to ${endIndex} of ${totalEntries} users`}
              </span>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5 select-none">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light dark:text-text-dark disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="First Page"
                >
                  <ChevronsLeft size={15} />
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={safeCurrentPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light dark:text-text-dark disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft size={15} />
                </button>

                {/* Page Number Buttons */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show current page, edges, and neighbors
                    return (
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(p - safeCurrentPage) <= 1
                    );
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                      <React.Fragment key={p}>
                        {showEllipsis && (
                          <span className="px-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`min-w-[28px] h-7 px-2 rounded-lg font-medium text-xs transition-all cursor-pointer ${
                            safeCurrentPage === p
                              ? "bg-primary-light text-white shadow-xs"
                              : "border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light dark:text-text-dark"
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}

                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light dark:text-text-dark disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight size={15} />
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={safeCurrentPage === totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-text-light dark:text-text-dark disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                  title="Last Page"
                >
                  <ChevronsRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
