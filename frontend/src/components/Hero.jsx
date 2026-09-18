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
  const [addedAnimation, setAddedAnimation] = useState(false);

  const auraRef = useRef(null);

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

  // Auto-play (paused on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4800);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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

          {/* CENTER: Massive Active Dish Showcase (No mouse parallax/drag) */}
          <div className="relative z-20 flex flex-col items-center justify-center max-w-[340px] sm:max-w-[440px] lg:max-w-[480px] w-full px-4">
            
            {/* Ambient Radial Dish Pedestal Glow */}
            <div
              style={{
                background: `radial-gradient(circle, ${currentDish.glowColor} 0%, transparent 70%)`,
              }}
              className="absolute w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-2xl pointer-events-none transition-all duration-700"
            />

            {/* Floating Quick Badges on Active Dish */}
           

            <div className="absolute top-2 right-4 sm:right-6 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-800 shadow-md pointer-events-none select-none">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-white">{currentDish.rating}</span>
              <span className="text-[10px] text-neutral-500">({currentDish.reviewCount})</span>
            </div>

            {/* Stable Center Dish Plate (No tilt, no grab, no mouse-follow) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDish.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -15 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative z-10 w-full aspect-square flex items-center justify-center p-2 pointer-events-none select-none"
              >
                <img
                  src={currentDish.image}
                  alt={currentDish.name}
                  className="w-full h-full object-contain filter drop-shadow-[0_24px_40px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_30px_50px_rgba(0,0,0,0.75)]"
                />
              </motion.div>
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

        {/* ================= 3. DISH DETAIL & ORDER CAPSULE (CENTERED) ================= */}
        <div className="w-full max-w-4xl flex flex-col items-center text-center mt-2">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDish.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full bg-white/80 dark:bg-[#111118]/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl shadow-neutral-900/5 dark:shadow-black/50 flex flex-col items-center"
            >
              {/* Category Pill & Tagline */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{ backgroundColor: `${currentDish.themeColor}20`, color: currentDish.themeColor }}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {currentDish.category}
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {currentDish.badgeText}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white tracking-tight">
                {currentDish.name}
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-lg leading-relaxed">
                {currentDish.description}
              </p>

              {/* Dish Highlights */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                {currentDish.highlights.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-750 text-[11px] font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    <Utensils className="w-3 h-3 text-orange-500" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>

              {/* Price & Action Row */}
              <div className="mt-5 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Price Display */}
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-black text-neutral-950 dark:text-white">
                    ₹{currentDish.price}
                  </span>
                  <span className="text-sm text-neutral-400 line-through">
                    ₹{currentDish.originalPrice}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {Math.round(((currentDish.originalPrice - currentDish.price) / currentDish.originalPrice) * 100)}% OFF
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:inline">
                    • {currentDish.prepTime} prep
                  </span>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleAddToCart()}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                        : 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02]'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check className="w-4 h-4 animate-bounce" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add To Cart • ₹{currentDish.price}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate('/menu')}
                    className="px-4 py-3 rounded-2xl font-bold text-sm bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-750 text-neutral-800 dark:text-neutral-200 transition-all cursor-pointer border border-neutral-200 dark:border-neutral-750 flex items-center gap-1.5"
                  >
                    <span>Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
