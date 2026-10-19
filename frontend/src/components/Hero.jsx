import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useFood } from '../context/FoodContext';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  ShoppingBag,
  Star,
  ShieldCheck,
  Check,
  ChefHat,
  Zap,
  ChevronLeft,
  ChevronRight,
  Utensils,
  TrendingUp,
} from 'lucide-react';

// Transparent cutout dish assets
import biryaniImg from '../assets/Images/biryani.png';
import pizzaImg from '../assets/Images/pizza.png';
import burgerImg from '../assets/Images/burger.png';
import chineseImg from '../assets/Images/Chinese-Food-Download-Free-PNG.png';
import chickenImg from '../assets/Images/chicken.png';
import allImg from '../assets/Images/allimage.jpg';

export const APP_CATEGORIES = [
  { id: 'all', name: 'All', image: allImg },
  { id: 'biryani', name: 'Biryani', image: biryaniImg },
  { id: 'pizza', name: 'Pizza', image: pizzaImg },
  { id: 'burger', name: 'Burger', image: burgerImg },
  { id: 'chinese', name: 'Chinese', image: chineseImg },
  { id: 'chicken', name: 'Chicken', image: chickenImg },
];

const SIGNATURE_DISHES = [
  {
    id: 'biryani',
    name: 'Shahi Hyderabadi Dum Biryani',
    shortName: 'Dum Biryani',
    category: 'Biryani',
    tagline: 'Slow Charcoal Handi Dum',
    watermark: 'BIRYANI',
    isVeg: false,
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: '18.4k',
    ordersToday: '480+ ordered today',
    prepTime: '25 min',
    portion: 'Serves 1–2',
    calories: '540 kcal',
    image: biryaniImg,
    imageClass: 'scale-100',
    badgeTop: 'top-3 right-5 sm:right-7',
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    badgeText: 'Chef’s Signature Handi',
    description: 'Aged basmati rice infused with royal saffron & pure desi ghee, slow-cooked with tender spiced cuts over charcoal embers.',
    highlights: ['Aged Long Basmati', 'Pure Desi Ghee', 'Slow Charcoal Dum', 'Fresh Mint Raita'],
    spiceLevel: 3,
  },
  {
    id: 'pizza',
    name: 'Paneer Tikka Makhani Pizza',
    shortName: 'Tikka Pizza',
    category: 'Pizza',
    tagline: 'Stone-Baked Artisanal Crust',
    watermark: 'PIZZA',
    isVeg: true,
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: '14.2k',
    ordersToday: '390+ ordered today',
    prepTime: '20 min',
    portion: 'Medium 10"',
    calories: '680 kcal',
    image: pizzaImg,
    imageClass: 'scale-105',
    badgeTop: 'top-4 right-5 sm:right-7',
    themeColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.35)',
    badgeText: 'Wood-Fired Special',
    description: 'Charcoal-grilled malai paneer cubes, rich buttery makhani sauce, and stretchy fresh mozzarella on a fermented crust.',
    highlights: ['Charred Malai Paneer', 'Rich Makhani Sauce', 'Fresh Mozzarella', 'Hand-Stretched Crust'],
    spiceLevel: 2,
  },
  {
    id: 'burger',
    name: 'Tandoori Tikka Smash Burger',
    shortName: 'Smash Burger',
    category: 'Burger',
    tagline: 'Flame-Seared Brioche Special',
    watermark: 'BURGER',
    isVeg: false,
    price: 199,
    originalPrice: 259,
    rating: 4.8,
    reviewCount: '11.8k',
    ordersToday: '310+ ordered today',
    prepTime: '15 min',
    portion: 'Double Patty',
    calories: '620 kcal',
    image: burgerImg,
    imageClass: 'scale-105',
    badgeTop: 'top-6 right-6 sm:right-8',
    themeColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.35)',
    badgeText: 'Dhaba Grill Masterpiece',
    description: 'Flame-seared spiced patty glazed in secret tandoori butter, with laccha pickled onions and mint emulsion on toasted brioche.',
    highlights: ['Flame-Seared Patty', 'Pickled Onions', 'Mint Emulsion', 'Butter-Toasted Brioche'],
    spiceLevel: 3,
  },
  {
    id: 'chinese',
    name: 'Wok-Tossed Schezwan Hakka Sizzle',
    shortName: 'Schezwan Wok',
    category: 'Chinese',
    tagline: 'Iron-Wok Blistered Noodles',
    watermark: 'CHINESE',
    isVeg: true,
    price: 249,
    originalPrice: 319,
    rating: 4.8,
    reviewCount: '9.6k',
    ordersToday: '260+ ordered today',
    prepTime: '18 min',
    portion: 'Serves 1–2',
    calories: '490 kcal',
    image: chineseImg,
    imageClass: 'scale-115 sm:scale-120',
    badgeTop: 'top-8 sm:top-10 right-6 sm:right-10',
    themeColor: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.35)',
    badgeText: 'Smoky Wok Hei Heat',
    description: 'Hand-pulled noodles tossed over roaring iron flame with crisp garden peppers, toasted garlic, and house Schezwan chili paste.',
    highlights: ['Blistering Wok Hei', 'Toasted Garlic Crisp', 'Schezwan Paste', 'Crunchy Peppers'],
    spiceLevel: 4,
  },
  {
    id: 'chicken',
    name: 'Royal Bhatti Murgh Tandoori',
    shortName: 'Bhatti Murgh',
    category: 'Chicken',
    tagline: 'Clay-Oven Charred Heritage',
    watermark: 'TANDOOR',
    isVeg: false,
    price: 369,
    originalPrice: 479,
    rating: 4.9,
    reviewCount: '16.1k',
    ordersToday: '420+ ordered today',
    prepTime: '22 min',
    portion: 'Half / 4 Pieces',
    calories: '580 kcal',
    image: chickenImg,
    imageClass: 'scale-100',
    badgeTop: 'top-3 right-5 sm:right-7',
    themeColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.35)',
    badgeText: 'Clay-Oven Charred',
    description: 'Tender chicken cuts double-marinated in mustard oil, crushed yellow chili, and hung yogurt, roasted in a scorching clay oven.',
    highlights: ['Double Marinade', 'Mustard Oil & Kasturi Methi', 'Charcoal Clay Oven', 'Mint Chutney'],
    spiceLevel: 3,
  },
];

export default function Hero() {
  const { isDark } = useTheme();
  const { addToCart } = useCart();
  const { foodItems } = useFood();
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const auraRef = useRef(null);
  const hoverTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 300);
  };

  const currentDish = SIGNATURE_DISHES[activeIndex];
  const prevIndex = (activeIndex - 1 + SIGNATURE_DISHES.length) % SIGNATURE_DISHES.length;
  const nextIndex = (activeIndex + 1) % SIGNATURE_DISHES.length;

  const prevDish = SIGNATURE_DISHES[prevIndex];
  const nextDish = SIGNATURE_DISHES[nextIndex];

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SIGNATURE_DISHES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + SIGNATURE_DISHES.length) % SIGNATURE_DISHES.length);
  }, []);

  const goToSlide = (idx) => {
    setActiveIndex(idx);
  };

  // Auto-play (paused whenever user hovers slider or active dish)
  useEffect(() => {
    if (isHovered || isSliderHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, isSliderHovered, nextSlide]);

  // Ambient Breathing Aura
  useEffect(() => {
    if (auraRef.current) {
      gsap.to(auraRef.current, {
        scale: 1.18,
        opacity: 0.85,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  const handleAddToCart = (dish = currentDish) => {
    if (addToCart) {
      // Find matching food item from database
      const dbMatch = foodItems?.find(
        (f) => f.category?.toLowerCase() === dish.category?.toLowerCase()
      );

      const itemPayload = dbMatch
        ? {
            _id: dbMatch._id,
            name: dbMatch.name || dish.name,
            price: dbMatch.price || dish.price,
            image: dbMatch.image || dish.image,
            category: dbMatch.category || dish.category,
          }
        : {
            _id: `signature-${dish.id}`,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            category: dish.category,
          };

      addToCart(itemPayload);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1400);
    }
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-[#fdfbf7] dark:bg-[#09090d] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20 border-b border-neutral-200/80 dark:border-neutral-850"
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        ref={auraRef}
        style={{
          background: `radial-gradient(circle, ${currentDish.glowColor} 0%, transparent 65%)`,
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[950px] h-[550px] sm:h-[800px] rounded-full blur-[130px] pointer-events-none transition-all duration-700 ease-out"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center">
        
        {/* ================= 1. CENTERED EDITORIAL HEADLINE ================= */}
        <div className="w-full text-center flex flex-col items-center mb-6 sm:mb-8">
          
          {/* Heritage Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/5 border border-orange-500/25 dark:border-orange-400/20 text-orange-600 dark:text-orange-400 mb-4 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm">
            <ChefHat className="w-3.5 h-3.5 text-amber-500" />
            <span>FROM OUR KITCHEN • TO YOUR PLATE</span>
          </div>

          {/* Luxury High-Impact Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.14] max-w-3xl">
            Where Every Dish Is An{' '}
            <span className="italic font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 relative inline-block">
              Artform.
              <svg
                className="absolute -bottom-1 sm:-bottom-1.5 left-0 w-full h-2.5 text-orange-500/40 dark:text-orange-400/50"
                viewBox="0 0 250 12"
                fill="none"
              >
                <path d="M3 9C50 3 150 2 247 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed font-normal">
            Handcrafted slow-cooked dum biryanis, stone-baked artisanal pizzas, and flaming clay-oven tandoor roasts — fired freshly to order.
          </p>
        </div>

        {/* ================= 2. APPLE-STYLE 3D COVERFLOW STAGE ================= */}
        <div
          onMouseEnter={() => setIsSliderHovered(true)}
          onMouseLeave={() => setIsSliderHovered(false)}
          className="relative w-full flex items-center justify-center my-4 sm:my-6 min-h-[340px] sm:min-h-[440px] lg:min-h-[480px]"
        >
          {/* Watermark Centered Directly Behind Active Dish */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.045] dark:opacity-[0.07] font-black text-7xl sm:text-9xl lg:text-[14rem] tracking-tighter leading-none text-neutral-950 dark:text-white z-0 whitespace-nowrap transition-all duration-500">
            {currentDish.watermark}
          </div>

          {/* LEFT DISH: Peeking Previous Dish (Click to slide) */}
          <div
            onClick={prevSlide}
            className="absolute left-0 sm:left-4 lg:left-12 top-1/2 -translate-y-1/2 z-10 opacity-40 hover:opacity-75 transition-opacity duration-300 cursor-pointer hidden sm:flex flex-col items-center"
            title={`View ${prevDish.name}`}
          >
            <div className="w-36 sm:w-48 lg:w-60 aspect-square transform scale-90 -rotate-5 filter drop-shadow-xl blur-[0.5px]">
              <img
                src={prevDish.image}
                alt={prevDish.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <span className="mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-orange-500 transition-colors">
              ← {prevDish.shortName}
            </span>
          </div>

          {/* CENTER: Massive Active Dish Showcase with Speech Bubble Popover */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsHovered((prev) => !prev)}
            className="relative z-30 flex flex-col items-center justify-center max-w-[340px] sm:max-w-[440px] lg:max-w-[480px] w-full px-4 group cursor-pointer"
          >
            {/* Ambient Radial Dish Pedestal Glow */}
            <div
              style={{
                background: `radial-gradient(circle, ${currentDish.glowColor} 0%, transparent 70%)`,
              }}
              className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-2xl pointer-events-none transition-all duration-700"
            />

            {/* Stable Center Dish Plate Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDish.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative z-10 w-full aspect-square flex items-center justify-center p-2 select-none group-hover:scale-105 transition-transform duration-300"
              >
                {/* Quick Rating Badge - Snuggled tight against dish rim */}
                <div
                  className={`absolute ${currentDish.badgeTop || 'top-4 right-6'} z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/85 dark:bg-neutral-900/85 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-lg pointer-events-none select-none transition-all duration-200 ${
                    isHovered ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-neutral-900 dark:text-white">{currentDish.rating}</span>
                  <span className="text-[10px] text-neutral-500">({currentDish.reviewCount})</span>
                </div>

                <img
                  src={currentDish.image}
                  alt={currentDish.name}
                  className={`w-full h-full object-contain filter drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_30px_50px_rgba(0,0,0,0.75)] transition-transform duration-300 ${currentDish.imageClass || 'scale-100'}`}
                />
              </motion.div>
            </AnimatePresence>

            {/* ================= SPEECH BUBBLE POPOVER (PERFECTLY POSITIONED BESIDE DISH) ================= */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.94, x: 10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-50 top-[80%] sm:top-4 md:top-6 lg:top-8 left-1/2 sm:left-[72%] md:left-[75%] lg:left-[78%] -translate-x-1/2 sm:translate-x-0 w-[90vw] sm:w-[265px] max-w-[275px] bg-white/70 dark:bg-[#121218]/70 backdrop-blur-xl sm:backdrop-blur-2xl rounded-2xl p-3.5 sm:p-4 border border-white/60 dark:border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.65)] ring-1 ring-black/[0.04] dark:ring-white/[0.05] text-left cursor-default select-text before:absolute before:-left-12 before:top-0 before:bottom-0 before:w-12"
                >
                  {/* Subtle Top Specular Sheen */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent rounded-t-2xl pointer-events-none" />

                  {/* Speech Bubble Pointer Arrow on LEFT (Desktop: points to dish) */}
                  <div className="hidden sm:block absolute -left-2 top-[62%] -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[8px] border-r-white/80 dark:border-r-[#15151e]/90 z-20" />
                  <div className="hidden sm:block absolute -left-[9px] top-[62%] -translate-y-1/2 w-0 h-0 border-y-[9px] border-y-transparent border-r-[9px] border-r-white/60 dark:border-r-white/[0.15] z-10" />

                  {/* Speech Bubble Pointer Arrow on TOP (Mobile: points up to dish) */}
                  <div className="sm:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[8px] border-x-transparent border-b-[8px] border-b-white/80 dark:border-b-[#15151e]/90 z-20" />
                  <div className="sm:hidden absolute -top-[9px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-[9px] border-x-transparent border-b-[9px] border-b-white/60 dark:border-b-white/[0.15] z-10" />

                  {/* Top Row: Dish Name & Rating */}
                  <div className="flex items-start justify-between gap-2 relative">
                    <h3
                      onClick={() => {
                        const dbMatch = foodItems?.find(
                          (f) => f.category?.toLowerCase() === currentDish.category?.toLowerCase()
                        );
                        if (dbMatch) {
                          navigate(`/food/${dbMatch._id}`);
                        } else {
                          navigate('/menu');
                        }
                      }}
                      className="text-sm sm:text-base font-extrabold text-neutral-950 dark:text-white tracking-tight leading-snug drop-shadow-sm hover:text-orange-500 cursor-pointer transition-colors"
                      title="View Dish Details"
                    >
                      {currentDish.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0 mt-0.5 bg-amber-500/10 dark:bg-amber-400/10 px-1.5 py-0.5 rounded-md border border-amber-500/20">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{currentDish.rating}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-1.5 text-[11px] sm:text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed line-clamp-2 font-normal">
                    {currentDish.description}
                  </p>

                  {/* Bottom Row: Price & Add to Cart */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-300/40 dark:border-white/[0.08] flex items-center justify-between gap-2 relative">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg sm:text-xl font-black text-neutral-950 dark:text-white">
                        ₹{currentDish.price}
                      </span>
                      <span className="text-[11px] text-neutral-400/80 line-through">
                        ₹{currentDish.originalPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart()}
                      className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95 ${
                        addedAnimation
                          ? "bg-emerald-600 text-white"
                          : "bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:shadow-orange-500/30 hover:brightness-105"
                      }`}
                    >
                      {addedAnimation ? (
                        <>
                          <Check className="w-3.5 h-3.5 animate-bounce" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT DISH: Peeking Next Dish (Click to slide) */}
          <div
            onClick={nextSlide}
            className="absolute right-0 sm:right-4 lg:right-12 top-1/2 -translate-y-1/2 z-10 opacity-40 hover:opacity-75 transition-opacity duration-300 cursor-pointer hidden sm:flex flex-col items-center"
            title={`View ${nextDish.name}`}
          >
            <div className="w-36 sm:w-48 lg:w-60 aspect-square transform scale-90 rotate-5 filter drop-shadow-xl blur-[0.5px]">
              <img
                src={nextDish.image}
                alt={nextDish.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
            <span className="mt-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-orange-500 transition-colors">
              {nextDish.shortName} →
            </span>
          </div>

          {/* Left & Right Circular Arrow Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500/50 transition-colors cursor-pointer shadow-lg active:scale-95"
            aria-label="Previous dish"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-800 backdrop-blur-md flex items-center justify-center text-neutral-700 dark:text-neutral-300 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500/50 transition-colors cursor-pointer shadow-lg active:scale-95"
            aria-label="Next dish"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* Slide Pagination Indicator Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 z-20">
          {SIGNATURE_DISHES.map((dish, idx) => (
            <button
              key={dish.id}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? "w-8 bg-orange-500 shadow-sm shadow-orange-500/40"
                  : "w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
              }`}
              aria-label={`Go to ${dish.name}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
