import { useFood } from "../context/FoodContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useMemo } from "react";
import FoodModal from "../components/FoodModal";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import {
  Utensils,
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Layers,
  AlertTriangle,
  LayoutGrid,
  List,
  X,
  Boxes,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import Loader from "../components/Loader";

const CATEGORIES = ["Pizza", "Burger", "Chinese", "Chicken", "Biryani"];

export default function AdminFoodPage() {
  const { foodItems, loading, addFoodItem, updateFoodItem, deleteFoodItem } = useFood();
  const { user } = useAuth();
  const { theme } = useTheme();

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("all"); // "all" | "in_stock" | "low_stock" | "out_of_stock"
  const [sortBy, setSortBy] = useState("default"); // "default" | "price_asc" | "price_desc" | "stock_asc" | "stock_desc" | "rating_desc" | "name_asc"
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"

  const openModal = (foodItem = null) => {
    setSelectedFood(foodItem);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedFood(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedFood) {
        await updateFoodItem(selectedFood._id, formData);
        Swal.fire({
          title: "Dish Updated!",
          text: "Food item specs and inventory have been saved.",
          icon: "success",
          confirmButtonColor: "#f97316",
        });
      } else {
        await addFoodItem(formData);
        Swal.fire({
          title: "Dish Added!",
          text: "New culinary item is now live in your menu.",
          icon: "success",
          confirmButtonColor: "#f97316",
        });
      }
      closeModal();
    } catch (error) {
      Swal.fire({
        title: "Operation Failed",
        text: error.message || "Something went wrong.",
        icon: "error",
      });
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: `Delete "${item.name}"?`,
      text: "This item will be permanently removed from the live kitchen menu.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete dish",
      cancelButtonText: "Keep item",
    });

    if (result.isConfirmed) {
      try {
        await deleteFoodItem(item._id);
        Swal.fire({
          title: "Deleted!",
          text: "Food item has been removed.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Error!", "Failed to delete food item.", "error");
      }
    }
  };

  // Top KPI Metrics
  const stats = useMemo(() => {
    const items = foodItems || [];
    const totalDishes = items.length;
    const totalUnits = items.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
    const lowStockCount = items.filter((item) => (item.stock ?? 10) > 0 && (item.stock ?? 10) <= 5).length;
    const outOfStockCount = items.filter((item) => (item.stock ?? 10) <= 0).length;
    const activeCategories = new Set(items.map((item) => item.category)).size;

    return { totalDishes, totalUnits, lowStockCount, outOfStockCount, activeCategories };
  }, [foodItems]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: foodItems?.length || 0 };
    CATEGORIES.forEach((cat) => {
      counts[cat] = (foodItems || []).filter((item) => item.category === cat).length;
    });
    return counts;
  }, [foodItems]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    if (!foodItems) return [];
    return foodItems
      .filter((item) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = item.name?.toLowerCase().includes(q);
          const matchCategory = item.category?.toLowerCase().includes(q);
          if (!matchName && !matchCategory) return false;
        }

        // Category
        if (selectedCategory !== "All" && item.category !== selectedCategory) {
          return false;
        }

        // Stock
        const stock = item.stock ?? 10;
        if (stockFilter === "in_stock" && stock <= 5) return false;
        if (stockFilter === "low_stock" && (stock <= 0 || stock > 5)) return false;
        if (stockFilter === "out_of_stock" && stock > 0) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price_desc") return (b.price || 0) - (a.price || 0);
        if (sortBy === "stock_asc") return (a.stock ?? 10) - (b.stock ?? 10);
        if (sortBy === "stock_desc") return (b.stock ?? 10) - (a.stock ?? 10);
        if (sortBy === "rating_desc") return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
        if (sortBy === "name_asc") return (a.name || "").localeCompare(b.name || "");
        return 0;
      });
  }, [foodItems, searchQuery, selectedCategory, stockFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    stockFilter !== "all" ||
    sortBy !== "default";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setStockFilter("all");
    setSortBy("default");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-neutral-50 dark:bg-[#0c0c12]">
        <Loader />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 dark:text-white">Access Denied</h2>
        <p className="text-neutral-500 text-sm mt-1 max-w-sm">
          You need verified administrator credentials to access food inventory controls.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 dark:bg-[#0c0c12] text-neutral-900 dark:text-neutral-100 transition-colors py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= 1. HEADER SECTION ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
              <span>Admin Management</span>
              <span>&bull;</span>
              <span>Kitchen & Menu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-3">
              <Utensils className="w-7 h-7 text-orange-500" />
              Menu & Inventory Management
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Maintain culinary catalog, adjust live kitchen stock, categories, and dish pricing.
            </p>
          </div>

          <button
            onClick={() => openModal()}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>

        {/* ================= 2. DASHBOARD KPI CARDS ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: Total Dishes */}
          <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider truncate">
                Total Dishes
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-0.5">
                {stats.totalDishes}
              </h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                Active in customer menu
              </p>
            </div>
          </div>

          {/* Card 2: Total Units */}
          <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Boxes className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider truncate">
                Units in Stock
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-0.5">
                {stats.totalUnits}
              </h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                Total kitchen inventory
              </p>
            </div>
          </div>

          {/* Card 3: Low & Out of Stock Alerts */}
          <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              stats.outOfStockCount > 0 || stats.lowStockCount > 0
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider truncate">
                Stock Alerts
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <span>{stats.lowStockCount + stats.outOfStockCount}</span>
                {stats.outOfStockCount > 0 && (
                  <span className="text-[11px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-md">
                    {stats.outOfStockCount} Out
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                {stats.lowStockCount > 0 ? `${stats.lowStockCount} dishes running low` : "All items well stocked"}
              </p>
            </div>
          </div>

          {/* Card 4: Categories */}
          <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-4 sm:p-5 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider truncate">
                Cuisines
              </p>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mt-0.5">
                {stats.activeCategories}
              </h3>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                Active food categories
              </p>
            </div>
          </div>
        </div>

        {/* ================= 3. CONTROLS & FILTER TOOLBAR ================= */}
        <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-4 space-y-3.5 shadow-xs">
          
          {/* Top Row: Search + Quick Dropdowns + View Mode */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Live Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish by name, cuisine, or category..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-neutral-50 dark:bg-[#1a1a27] border border-neutral-200 dark:border-neutral-750 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white p-0.5 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {/* Stock Filter Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-50 dark:bg-[#1a1a27] border border-neutral-200 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="in_stock">In Stock (&gt; 5)</option>
                  <option value="low_stock">Low Stock (1–5)</option>
                  <option value="out_of_stock">Out of Stock (0)</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-50 dark:bg-[#1a1a27] border border-neutral-200 dark:border-neutral-750 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="default">Sort: Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="stock_asc">Stock: Low to High</option>
                  <option value="stock_desc">Stock: High to Low</option>
                  <option value="rating_desc">Highest Rated</option>
                  <option value="name_asc">Name: A &rarr; Z</option>
                </select>
              </div>

              {/* View Switcher (Grid vs Table) */}
              <div className="flex items-center bg-neutral-100 dark:bg-[#1a1a27] p-1 rounded-xl border border-neutral-200 dark:border-neutral-750 shrink-0">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-neutral-800 text-orange-500 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white dark:bg-neutral-800 text-orange-500 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Clear Filters (if active) */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors shrink-0 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
            {["All", ...CATEGORIES].map((category) => {
              const count = categoryCounts[category] || 0;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-orange-500 text-white shadow-xs shadow-orange-500/25"
                      : "bg-neutral-100 hover:bg-neutral-200/80 dark:bg-[#1a1a27] dark:hover:bg-[#222233] text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= 4. MAIN CONTENT AREA ================= */}

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              No Dishes Match Your Filter
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
              We couldn't find any dishes matching "{searchQuery || selectedCategory || stockFilter}".
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 transition-colors cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          /* ================= GRID VIEW ================= */
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            
            {/* Add New Dish Quick Card */}
            <div
              onClick={() => openModal()}
              className="group border-2 border-dashed border-orange-500/30 hover:border-orange-500 dark:border-orange-500/25 dark:hover:border-orange-500 rounded-2xl p-6 bg-orange-500/5 hover:bg-orange-500/10 dark:bg-orange-500/[0.03] dark:hover:bg-orange-500/[0.08] flex flex-col items-center justify-center min-h-[340px] cursor-pointer transition-all duration-300 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <Plus className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-4">
                Add New Dish
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-[180px]">
                Create new culinary item with specs & stock
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500/10 text-xs font-bold text-orange-600 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <span>+ Add Food Item</span>
              </span>
            </div>

            {/* Food Cards */}
            {filteredItems.map((item) => {
              const stock = item.stock ?? 10;
              const isOutOfStock = stock <= 0;
              const isLowStock = stock > 0 && stock <= 5;

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-xs hover:shadow-xl hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all duration-300 flex flex-col group overflow-hidden"
                >
                  {/* Photo Presentation Container */}
                  <div className="relative h-44 bg-neutral-100/70 dark:bg-[#0f0f18] flex items-center justify-center p-3 overflow-hidden border-b border-neutral-100 dark:border-neutral-850">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Floating Category Tag */}
                    <div className="absolute top-2.5 left-2.5 backdrop-blur-md bg-white/85 dark:bg-black/70 border border-neutral-200/60 dark:border-neutral-700/60 px-2 py-0.5 rounded-lg text-[10px] font-bold text-neutral-800 dark:text-neutral-200 shadow-xs">
                      {item.category}
                    </div>

                    {/* Floating Rating Tag */}
                    <div className="absolute top-2.5 right-2.5 backdrop-blur-md bg-black/65 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating || "4.5"}</span>
                    </div>

                    {/* Stock Alert Ribbon if low or out */}
                    {isOutOfStock ? (
                      <div className="absolute bottom-2 left-2 right-2 bg-red-600/90 text-white text-[11px] font-bold text-center py-1 rounded-lg backdrop-blur-xs">
                        Out of Stock
                      </div>
                    ) : isLowStock ? (
                      <div className="absolute bottom-2 left-2 right-2 bg-amber-500/90 text-white text-[11px] font-bold text-center py-1 rounded-lg backdrop-blur-xs">
                        Only {stock} Left in Stock
                      </div>
                    ) : null}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      {/* Name & Stock Status */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3
                          className="text-base font-bold text-neutral-900 dark:text-white truncate"
                          title={item.name}
                        >
                          {item.name}
                        </h3>
                      </div>

                      {/* Price & Stock Counter */}
                      <div className="flex items-baseline justify-between mt-2">
                        <div className="text-lg font-black text-neutral-900 dark:text-white">
                          ₹{item.price}
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isOutOfStock
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : isLowStock
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {isOutOfStock
                            ? "0 Left"
                            : `${stock} in stock`}
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openModal(item)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200/90 dark:bg-neutral-800 dark:hover:bg-neutral-700/80 transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5 text-orange-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(item)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= TABLE VIEW ================= */
          <div className="bg-white dark:bg-[#14141e] border border-neutral-200/90 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 dark:bg-[#101018] border-b border-neutral-200/80 dark:border-neutral-800 text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  <tr>
                    <th className="py-3.5 px-4">Dish</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock Level</th>
                    <th className="py-3.5 px-4">Rating</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
                  {filteredItems.map((item) => {
                    const stock = item.stock ?? 10;
                    const isOutOfStock = stock <= 0;
                    const isLowStock = stock > 0 && stock <= 5;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-neutral-50/60 dark:hover:bg-neutral-850/40 transition-colors"
                      >
                        {/* Dish with photo */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-black/40 border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-center shrink-0 p-1 overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-neutral-900 dark:text-white truncate max-w-xs">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-neutral-400">ID: {item._id?.slice(-6)}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {item.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-black text-neutral-900 dark:text-white">
                          ₹{item.price}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isOutOfStock
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : isLowStock
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {isOutOfStock
                              ? "Out of Stock"
                              : `${stock} in stock`}
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{item.rating || "4.5"}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openModal(item)}
                              title="Edit Dish"
                              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-orange-600 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              title="Delete Dish"
                              className="p-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal - Instant clean mount without any blink or ghost artifact */}
      {modalOpen && (
        <FoodModal
          key={selectedFood?._id || "new-food"}
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={selectedFood}
          categories={CATEGORIES}
          theme={theme}
        />
      )}
    </div>
  );
}
