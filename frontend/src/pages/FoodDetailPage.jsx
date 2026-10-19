import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Heart,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Flame,
  Check,
  Plus,
  Minus,
  Utensils,
  Share2,
  ChevronRight,
  ChevronLeft,
  Info,
  Sparkles,
} from "lucide-react";
import { useFood } from "../context/FoodContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

// Dish attributes map
const DISH_SPECS = {
  biryani: {
    prepTime: "25 mins",
    serves: "Serves 1–2",
    calories: "540 kcal",
    highlights: ["Aged Basmati Rice", "Pure Desi Ghee", "Slow Charcoal Dum", "Mint Raita Included"],
    description: "Fragrant long-grain aged basmati rice layered with rich marinated cuts, saffron milk, and pure desi ghee, slow-cooked in a sealed clay handi over charcoal embers.",
  },
  pizza: {
    prepTime: "18 mins",
    serves: "Medium 10\" (6 Slices)",
    calories: "680 kcal",
    highlights: ["Stone-Baked Crust", "Fresh Mozzarella", "Rich Makhani Sauce", "Charred Malai Paneer"],
    description: "Artisanal hand-stretched dough baked at 400°C over stone hearth, topped with spiced makhani reduction, creamy paneer, and 100% whole-milk stretchy mozzarella.",
  },
  burger: {
    prepTime: "15 mins",
    serves: "Single Large Burger",
    calories: "620 kcal",
    highlights: ["Flame-Seared Patty", "Butter-Toasted Brioche", "Tandoori Aioli", "Pickled Red Onions"],
    description: "Juicy flame-seared patty seasoned with secret tandoori herbs, topped with melted cheese, crisp lettuce, and signature house aioli on toasted brioche.",
  },
  chinese: {
    prepTime: "18 mins",
    serves: "Serves 1–2",
    calories: "490 kcal",
    highlights: ["High-Flame Wok Hei", "Hand-Pulled Noodles", "Crisp Garden Peppers", "Schezwan Chili Garlic"],
    description: "Classic wok-tossed noodles tossed over roaring iron flame with crisp garden greens, toasted garlic, and fiery Schezwan chili paste.",
  },
  chicken: {
    prepTime: "22 mins",
    serves: "Half / 4 Pieces",
    calories: "580 kcal",
    highlights: ["Double Mustard Marinade", "Clay-Oven Roasted", "Kasturi Methi & Curd", "Spiced Onion Relish"],
    description: "Tender chicken cuts double-marinated in pungent mustard oil, yellow chili, and hung yogurt, charred to perfection inside a flaming tandoor.",
  },
};

export default function FoodDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { foodItems, loading } = useFood();
  const { cartItems, addToCart, updateItemQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isDark } = useTheme();

  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState("Regular");
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Find item by ID
  const foodItem = useMemo(() => {
    if (!foodItems || foodItems.length === 0) return null;
    return foodItems.find(
      (item) => String(item._id) === String(id) || String(item.id) === String(id)
    );
  }, [foodItems, id]);

  const categoryKey = foodItem?.category?.toLowerCase() || "biryani";
  const specs = DISH_SPECS[categoryKey] || DISH_SPECS.biryani;

  const isVeg = useMemo(() => {
    if (!foodItem) return true;
    const cat = foodItem.category?.toLowerCase() || "";
    const name = foodItem.name?.toLowerCase() || "";
    if (
      cat === "chicken" ||
      name.includes("chicken") ||
      name.includes("meat") ||
      name.includes("mutton") ||
      name.includes("fish")
    ) {
      return false;
    }
    return true;
  }, [foodItem]);

  const isFav = foodItem ? isInWishlist(foodItem._id) : false;

  const inCartQuantity = useMemo(() => {
    if (!foodItem || !Array.isArray(cartItems)) return 0;
    const match = cartItems.find(
      (ci) =>
        ci.foodId?._id === foodItem._id ||
        ci.foodId === foodItem._id ||
        ci._id === foodItem._id
    );
    return match ? match.quantity : 0;
  }, [cartItems, foodItem]);

  // Keep quantity synced if already in cart
  useEffect(() => {
    if (inCartQuantity > 0) {
      setQuantity(inCartQuantity);
    }
  }, [inCartQuantity]);

  // Related recommended items for slider
  const relatedItems = useMemo(() => {
    if (!foodItems || !foodItem) return [];
    return foodItems
      .filter((item) => String(item._id) !== String(foodItem._id))
      .slice(0, 10);
  }, [foodItems, foodItem]);

  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Dish link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    if (!foodItem) return;
    for (let i = 0; i < (inCartQuantity > 0 ? 1 : quantity); i++) {
      addToCart({
        _id: foodItem._id,
        name: foodItem.name,
        price: foodItem.price,
        image: foodItem.image,
        category: foodItem.category,
      });
    }
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  if (loading && !foodItem) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-[#fdfbf7] dark:bg-[#09090d]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-neutral-500">Loading dish details...</p>
        </div>
      </div>
    );
  }

  if (!loading && !foodItem) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-[#fdfbf7] dark:bg-[#09090d] text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
          <Utensils className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Dish Not Found</h1>
        <p className="mt-1.5 text-xs text-neutral-500 max-w-sm">
          The dish you are looking for might have been moved or removed from the menu.
        </p>
        <Link
          to="/menu"
          className="mt-5 px-5 py-2 rounded-xl font-bold text-xs text-white bg-primary-light dark:bg-primary-dark shadow-sm hover:opacity-95 transition-all"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  const originalPrice = Math.round(foodItem.price * 1.25);
  const discountPercent = Math.round(((originalPrice - foodItem.price) / originalPrice) * 100);

  return (
    <div className="min-h-screen bg-[#fdfbf7] dark:bg-[#09090d] text-neutral-900 dark:text-neutral-100 transition-colors duration-200 pt-20 sm:pt-24 pb-16">
      
      {/* Main Split-View E-Commerce Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Sleek Truly-Responsive Breadcrumb & Action Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-8">
          
          {/* Breadcrumb Path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#14141c] border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500 dark:hover:border-orange-500 shadow-2xs hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer shrink-0 mr-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {/* Desktop Only: Home */}
            <Link
              to="/"
              className="hidden md:inline hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              Home
            </Link>

            <ChevronRight className="hidden md:inline w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 shrink-0" />

            {/* Menu */}
            <Link
              to="/menu"
              className="hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              Menu
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 shrink-0" />

            {/* Category */}
            <Link
              to={`/menu?category=${foodItem.category}`}
              className="hover:text-neutral-900 dark:hover:text-white transition-colors shrink-0"
            >
              {foodItem.category}
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 shrink-0" />

            {/* Active Dish Name (Truncated cleanly) */}
            <span className="font-bold text-neutral-900 dark:text-white truncate max-w-[100px] sm:max-w-[160px] md:max-w-[220px]">
              {foodItem.name}
            </span>
          </nav>

          {/* Quick Actions (Share & Wishlist) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleShare}
              title="Share Link"
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-[#14141c] border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400 cursor-pointer transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => toggleWishlist(foodItem)}
              title={isFav ? "Remove from Wishlist" : "Add to Wishlist"}
              className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer transition-colors shadow-2xs ${
                isFav
                  ? "bg-red-500/10 border-red-500/30 text-red-500"
                  : "bg-white dark:bg-[#14141c] border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
            </button>
          </div>
        </div>
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================= LEFT COLUMN: CLEAN DISH PHOTOGRAPHY ================= */}
          <div className="lg:col-span-7">
            <div className="sticky top-20 space-y-4">
              
              {/* Main Image Frame */}
              {/* Main Image Frame - Compact on mobile, spacious on desktop */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-[#121218] border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-8 md:p-12 flex items-center justify-center h-[260px] xs:h-[300px] sm:h-[360px] md:h-[400px] shadow-sm">
                
                {/* Radial Backdrop Glow */}
                <div className="absolute w-[180px] sm:w-[320px] h-[180px] sm:h-[320px] rounded-full bg-orange-500/15 dark:bg-orange-500/10 blur-3xl pointer-events-none" />

                {/* Veg / Non-Veg Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                  <span
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 border flex items-center justify-center p-0.5 rounded-xs ${
                      isVeg ? "border-emerald-600" : "border-red-600"
                    }`}
                  >
                    <span
                      className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                        isVeg ? "bg-emerald-600" : "bg-red-600"
                      }`}
                    />
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {isVeg ? "Veg" : "Non-Veg"}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 text-[11px] sm:text-xs font-bold text-neutral-900 dark:text-white shadow-xs">
                  <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500" />
                  <span>{foodItem.rating || "4.5"}</span>
                </div>

                {/* Center Cutout Dish Image (Balanced size on mini devices) */}
                <motion.img
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={foodItem.image}
                  alt={foodItem.name}
                  className="relative z-10 w-auto h-full max-h-[190px] xs:max-h-[220px] sm:max-h-[300px] md:max-h-[340px] object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:scale-105 transition-transform duration-300 select-none"
                />

                {/* Bottom Photo Pill: Freshly Cooked */}
                <div className="absolute bottom-2.5 sm:bottom-4 inset-x-2.5 sm:inset-x-4 flex items-center justify-between text-xs pointer-events-none">
                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium border border-white/10">
                    <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                    <span>Cooked Fresh</span>
                  </span>

                  <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-medium border border-white/10">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-300" />
                    <span>{specs.prepTime}</span>
                  </span>
                </div>
              </div>

              {/* Quick Spec Strip */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white dark:bg-[#121218] border border-neutral-200/70 dark:border-neutral-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Preparation</div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{specs.prepTime}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#121218] border border-neutral-200/70 dark:border-neutral-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Serving</div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{specs.serves}</div>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-[#121218] border border-neutral-200/70 dark:border-neutral-800 text-center">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Energy</div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white mt-0.5">{specs.calories}</div>
                </div>
              </div>

              {/* About this Dish - Relocated to Left Column Below Image */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121218] border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  About this Dish
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {specs.description}
                </p>
              </div>

            </div>
          </div>


          {/* ================= RIGHT COLUMN: STICKY ORDER SIDEBAR ================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Title & Category Header */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  {foodItem.category}
                </span>
                <span className="text-neutral-400">•</span>
                <span className="text-[11px] text-neutral-500 font-medium">Authentic Recipe</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight leading-snug">
                {foodItem.name}
              </h1>

              {/* Pricing Row & Live Stock Indicator */}
              <div className="mt-3 flex items-center justify-between gap-2.5">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-neutral-950 dark:text-white">
                    ₹{foodItem.price}
                  </span>
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{originalPrice}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {discountPercent}% OFF
                  </span>
                </div>

                {/* Stock Badge */}
                <div
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    (foodItem.stock ?? 10) <= 0
                      ? "bg-red-500/10 text-red-500 border border-red-500/30"
                      : (foodItem.stock ?? 10) <= 5
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  }`}
                >
                  {(foodItem.stock ?? 10) <= 0
                    ? "Out of Stock"
                    : `${foodItem.stock ?? 10} Left in Stock`}
                </div>
              </div>
            </div>

            {/* Highlights List */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                Highlights & Ingredients
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {specs.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#121218] border border-neutral-200/70 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="truncate">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Portion Option Selection */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Portion Size
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {["Regular", "Family (+₹120)", "Party (+₹240)"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedPortion(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                      selectedPortion === size
                        ? "bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400"
                        : "bg-white dark:bg-[#121218] border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Order & Quantity Stepper */}
            <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800 space-y-3">
              
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center bg-white dark:bg-[#121218] border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-1 shadow-xs">
                  <button
                    onClick={() => {
                      if (inCartQuantity > 0) {
                        if (inCartQuantity <= 1) {
                          removeFromCart(foodItem._id);
                          setQuantity(1);
                        } else {
                          updateItemQuantity(foodItem._id, inCartQuantity - 1);
                        }
                      } else {
                        setQuantity((prev) => Math.max(1, prev - 1));
                      }
                    }}
                    className="w-9 h-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-8 text-center text-sm font-black text-neutral-900 dark:text-white select-none">
                    {inCartQuantity > 0 ? inCartQuantity : quantity}
                  </span>

                  <button
                    onClick={() => {
                      if (inCartQuantity > 0) {
                        updateItemQuantity(foodItem._id, inCartQuantity + 1);
                      } else {
                        setQuantity((prev) => prev + 1);
                      }
                    }}
                    className="w-9 h-9 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-5 rounded-2xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95 ${
                    addedAnimation
                      ? "bg-emerald-600 shadow-emerald-500/25"
                      : "bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-orange-500/30 hover:brightness-105"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce" />
                      <span>Added to Order!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {inCartQuantity > 0 ? "Add More to Order" : `Add to Order • ₹${foodItem.price * quantity}`}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* View Cart Shortcut */}
              <Link
                to="/cart"
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-center block text-neutral-600 dark:text-neutral-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                View Cart & Checkout →
              </Link>
            </div>

            {/* Hygiene & Delivery Note */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/15 text-[11px] text-neutral-600 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                100% kitchen sanitized & temperature inspected. Delivered fresh in eco-friendly thermal boxes.
              </span>
            </div>

          </div>

        </div>

        {/* ================= RELATED RECOMMENDED DISHES SLIDER ================= */}
        {relatedItems.length > 0 && (
          <div className="mt-14 sm:mt-20 pt-8 sm:pt-10 border-t border-neutral-200/80 dark:border-neutral-800">
            
            {/* Header with Navigation Controls */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
                  You May Also Like
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Popular handcrafted specialties from our kitchen
                </p>
              </div>

              {/* Slider Controls + Full Menu Link */}
              <div className="flex items-center gap-2">
                <Link
                  to="/menu"
                  className="hidden sm:inline-flex text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline items-center gap-1 mr-2"
                >
                  <span>Full Menu</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => scrollSlider("left")}
                  aria-label="Scroll left"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-[#121218] border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500 dark:hover:border-orange-500 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => scrollSlider("right")}
                  aria-label="Scroll right"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white dark:bg-[#121218] border border-neutral-200/80 dark:border-neutral-800 hover:border-orange-500 dark:hover:border-orange-500 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Smooth Responsive Horizontal Slider */}
            <div
              ref={sliderRef}
              className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth scrollbar-none snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {relatedItems.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/food/${item._id}`)}
                  className="w-[200px] sm:w-[230px] md:w-[250px] shrink-0 snap-start rounded-2xl overflow-hidden bg-white dark:bg-[#121218] border border-neutral-200/80 dark:border-neutral-800 p-3 hover:shadow-md hover:border-orange-500/40 dark:hover:border-orange-500/40 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Photo Container */}
                  <div className="relative w-full aspect-square bg-neutral-100/70 dark:bg-neutral-900/60 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-2.5">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
                    />

                    {/* Quick Rating on Photo */}
                    <div className="absolute top-2 right-2 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold border border-white/10">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      <span>{item.rating || "4.5"}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate mt-0.5" title={item.name}>
                      {item.name}
                    </h4>

                    <div className="mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white">
                        ₹{item.price}
                      </span>

                      <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                        Order →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile View All Menu link */}
            <div className="mt-3 text-center sm:hidden">
              <Link
                to="/menu"
                className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Menu</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
