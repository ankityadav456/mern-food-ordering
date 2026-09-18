import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  Search,
  ArrowRight,
  ShoppingBag,
  Clock,
  Star,
  ShieldCheck,
  Check,
  Sparkles,
  Flame,
  Zap,
  Tag,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Copy,
} from 'lucide-react';

// Exact transparent cutout dish assets from the project
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
    tagline: 'Slow Charcoal Clay Handi Dum',
    watermark: 'BIRYANI',
    isVeg: false,
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: '18.4k',
    ordersToday: '480+ ordered today',
    prepTime: '25 min',
    image: biryaniImg,
    themeColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.22)',
    badgeText: 'Clay Handi Special',
    description: 'Aged basmati layered with succulent spiced chicken, Kashmiri saffron, fried onions & pure desi ghee.',
    highlights: ['Aged Basmati', 'Pure Desi Ghee', 'Slow Charcoal Dum'],
    spiceLevel: 3,
  },
  {
    id: 'pizza',
    name: 'Paneer Tikka Makhani Pizza',
    shortName: 'Tikka Pizza',
    category: 'Pizza',
    tagline: 'Artisanal Stone-Baked Crust',
    watermark: 'PIZZA',
    isVeg: true,
    price: 349,
    originalPrice: 449,
    rating: 4.9,
    reviewCount: '14.2k',
    ordersToday: '390+ ordered today',
    prepTime: '20 min',
    image: pizzaImg,
    themeColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.22)',
    badgeText: 'Wood-Fired Crust',
    description: 'Charcoal-grilled malai paneer cubes, rich buttery makhani sauce, stretchy mozzarella & fresh kasuri methi.',
    highlights: ['Malai Paneer', 'Makhani Sauce', 'Fresh Mozzarella'],
    spiceLevel: 2,
  },
  {
    id: 'burger',
    name: 'Tandoori Tikka Smash Burger',
    shortName: 'Desi Burger',
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
    image: burgerImg,
    themeColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.22)',
    badgeText: 'Dhaba Grill Special',
    description: 'Crispy tandoori fillet glazed in secret spiced butter, mint-coriander yogurt sauce & laccha onions on brioche.',
    highlights: ['Smoky Chicken Tikka', 'Mint Mayo', 'Toasted Brioche'],
    spiceLevel: 3,
  },
  {
    id: 'chinese',
    name: 'Fiery Wok Hakka Noodles',
    shortName: 'Wok Noodles',
    category: 'Chinese',
    tagline: 'High-Flame Indo-Chinese Sizzler',
    watermark: 'NOODLES',
    isVeg: true,
    price: 229,
    originalPrice: 299,
    rating: 4.7,
    reviewCount: '9.6k',
    ordersToday: '240+ ordered today',
    prepTime: '15 min',
    image: chineseImg,
    themeColor: '#dc2626',
    glowColor: 'rgba(220, 38, 38, 0.22)',
    badgeText: 'Wok Master Special',
    description: 'High-flame tossed noodles with smoky garlic chili paste, julienned bell peppers, spring greens & crunchy roasted garlic.',
    highlights: ['Handmade Noodles', 'Fiery Garlic Paste', 'Crisp Wok Veggies'],
    spiceLevel: 4,
  },
  {
    id: 'chicken',
    name: 'Amritsari Tandoori Murgh',
    shortName: 'Tandoori Murgh',
    category: 'Chicken',
    tagline: 'Authentic Charcoal Clay Tandoor',
    watermark: 'TANDOOR',
    isVeg: false,
    price: 319,
    originalPrice: 399,
    rating: 4.9,
    reviewCount: '16.7k',
    ordersToday: '420+ ordered today',
    prepTime: '25 min',
    image: chickenImg,
    themeColor: '#ea580c',
    glowColor: 'rgba(234, 88, 12, 0.22)',
    badgeText: 'Clay Tandoor Roast',
    description: 'Farm-fresh chicken drumsticks marinated overnight in spiced hung curd, mustard oil & roasted over smoky coal embers.',
    highlights: ['Charcoal Roasted', 'Mustard Oil Rub', 'Hung Curd Marinade'],
    spiceLevel: 3,
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { addToCart } = useCart();

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const heroContainerRef = useRef(null);
  const auraRef = useRef(null);

  const currentDish = SIGNATURE_DISHES[activeIndex];

  // Slider Navigation
  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SIGNATURE_DISHES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SIGNATURE_DISHES.length) % SIGNATURE_DISHES.length);
  }, []);

  const goToSlide = (idx) => {
    setDirection(idx > activeIndex ? 1 : -1);
    setActiveIndex(idx);
  };

  // Auto-play slider every 4 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovered, nextSlide]);

  // 3D Parallax Mouse Tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 100 };
  const dishRotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), springConfig);
  const dishRotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    if (!heroContainerRef.current) return;
    const rect = heroContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // GSAP Ambient Breathing Animation
  useEffect(() => {
    if (auraRef.current) {
      gsap.to(auraRef.current, {
        scale: 1.2,
        opacity: 0.9,
        duration: 4.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  const handleAddCurrentDish = (dishToOrder = currentDish) => {
    if (addToCart) {
      addToCart({
        _id: `signature-${dishToOrder.id}`,
        name: dishToOrder.name,
        price: dishToOrder.price,
        image: dishToOrder.image,
        category: dishToOrder.category,
      });
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 1400);
      toast.success(`${dishToOrder.name} added to cart!`, {
        duration: 2200,
        style: {
          borderRadius: '16px',
          background: isDark ? '#1a1a24' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f172a',
          border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
          fontWeight: 600,
          fontSize: '14px',
        },
      });
    } else {
      navigate('/menu');
    }
  };

  // Slider animation variants
  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 26 },
        opacity: { duration: 0.35 },
        scale: { duration: 0.35 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.92,
      transition: {
        x: { type: 'spring', stiffness: 260, damping: 26 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    }),
  };

  return (
    <section
      id="home"
      ref={heroContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-[#fdfbf7] dark:bg-[#09090d] text-neutral-900 dark:text-neutral-100 transition-colors duration-500 pt-20 pb-10 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20 border-b border-neutral-200/80 dark:border-neutral-850"
    >
      {/* ================= DYNAMIC BACKGROUND AURA & WATERMARK ================= */}
      <div
        ref={auraRef}
        style={{
          background: `radial-gradient(circle, ${currentDish.glowColor} 0%, transparent 70%)`,
        }}
        className="absolute top-1/4 right-1/4 w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 ease-out"
      />
      <div className="absolute top-10 left-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-orange-500/[0.06] blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* ================= MAIN CINEMATIC HERO STAGE ================= */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-10 items-center w-full">
          
          {/* ================= LEFT: LUXURY EDITORIAL POWERHOUSE ================= */}
          <div className="lg:col-span-6 flex flex-col justify-center w-full min-w-0 z-10">
            
            {/* Michelin / Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/5 border border-orange-500/25 dark:border-orange-400/20 text-orange-600 dark:text-orange-400 w-fit mb-4 text-[11px] font-bold uppercase tracking-[0.2em] shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>The Art of Authentic Desi Flavors</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12] break-words">
              Where Every Bite Is A{' '}
              <span className="italic font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 relative inline-block">
                Masterpiece.
                <svg
                  className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3 text-orange-500/40 dark:text-orange-400/50"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C50 3 150 2 247 9"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed font-normal">
              Slow-cooked handi biryanis infused with saffron & pure desi ghee, stone-baked pizzas, and smoky clay-oven tandoor roasts — freshly fired to order and delivered sizzling hot to your door.
            </p>

            {/* Chef Highlights Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {currentDish.highlights.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 shadow-sm"
                >
                  ✓ {item}
                </span>
              ))}
            </div>

            {/* Call to Actions & Direct Order */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:shadow-xl hover:shadow-orange-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Explore Full Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleAddCurrentDish()}
                className={`px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  addedAnimation
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/25'
                    : 'bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-750 hover:border-orange-500 dark:hover:border-orange-500 shadow-sm'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" />
                    <span>Added To Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span>Order {currentDish.shortName} • ₹{currentDish.price}</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust & Guarantee Counters */}
            <div className="mt-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 grid grid-cols-3 gap-3">
              <div>
                <p className="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">18,500+</p>
                <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Happy Foodies</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">4.9 ★</p>
                <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Chef Rating</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-neutral-950 dark:text-white">100%</p>
                <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium">Fresh</p>
              </div>
            </div>

          </div>

          {/* ================= RIGHT: DYNAMIC CATEGORIES SLIDER ================= */}
          <div
            className="lg:col-span-6 flex flex-col items-center justify-center relative min-h-[440px] sm:min-h-[500px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            {/* Slider Container with Parallax Tilt */}
            <motion.div
              style={{
                rotateX: dishRotateX,
                rotateY: dishRotateY,
                transformStyle: 'preserve-3d',
              }}
              className="relative w-full max-w-md sm:max-w-lg flex flex-col items-center justify-center"
            >
              
              {/* Slider Top Category Header & Controls */}
              <div className="w-full flex items-center justify-between mb-2 px-2 z-20">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/20 shadow-sm flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{currentDish.category}</span>
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {activeIndex + 1} of {SIGNATURE_DISHES.length}
                  </span>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous Category"
                    className="p-2 rounded-full bg-white/90 dark:bg-neutral-850/90 border border-neutral-200 dark:border-neutral-750 text-neutral-700 dark:text-neutral-200 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next Category"
                    className="p-2 rounded-full bg-white/90 dark:bg-neutral-850/90 border border-neutral-200 dark:border-neutral-750 text-neutral-700 dark:text-neutral-200 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 shadow-sm backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ground Depth Shadow underneath the plate */}
              <motion.div
                animate={{
                  scale: [1, 0.88, 1],
                  opacity: [0.35, 0.22, 0.35],
                }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="absolute bottom-20 sm:bottom-24 w-[240px] sm:w-[320px] h-[35px] rounded-[100%] bg-black/60 dark:bg-black/90 blur-xl pointer-events-none -z-10"
              />

              {/* Central Glowing Food Disc Backdrop */}
              <div
                style={{
                  background: `radial-gradient(circle, ${currentDish.glowColor} 0%, transparent 70%)`,
                }}
                className="absolute inset-0 rounded-full blur-2xl pointer-events-none -z-10 transition-colors duration-700"
              />

              {/* Slider Slide Frame */}
              <div className="relative z-10 w-full overflow-hidden flex flex-col items-center">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                  <motion.div
                    key={currentDish.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      if (offset.x < -40 || velocity.x < -0.3) {
                        nextSlide();
                      } else if (offset.x > 40 || velocity.x > 0.3) {
                        prevSlide();
                      }
                    }}
                    className="w-full flex flex-col items-center cursor-grab active:cursor-grabbing"
                  >
                    
                    {/* The Master Floating Plate */}
                    <div className="relative w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center select-none">
                      {/* Watermark directly behind right-side food image in bottom */}
                      <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 select-none pointer-events-none z-0 text-center w-full">
                        <span className="block text-4xl sm:text-6xl lg:text-7xl font-black tracking-widest leading-none text-neutral-900/10 dark:text-white/[0.12] uppercase font-sans whitespace-nowrap">
                          {currentDish.watermark}
                        </span>
                      </div>

                      <motion.img
                        src={currentDish.image}
                        alt={currentDish.name}
                        animate={{ y: [-8, 8, -8] }}
                        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                        className="w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)] pointer-events-none relative z-10"
                      />
                    </div>

                    {/* Grounded Action & Details Card */}
                    <div className="mt-2 p-3 sm:p-3.5 rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl flex items-center justify-between gap-4 w-full max-w-sm">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 ${
                              currentDish.isVeg ? 'border-emerald-500' : 'border-red-500'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                currentDish.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                          </span>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {currentDish.name}
                          </p>
                        </div>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span className="text-sm font-black text-neutral-950 dark:text-white">
                            ₹{currentDish.price}
                          </span>
                          <span className="text-[11px] text-neutral-400 line-through">
                            ₹{currentDish.originalPrice}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            Save ₹{currentDish.originalPrice - currentDish.price}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddCurrentDish(currentDish);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5 shadow-md cursor-pointer transition-all shrink-0 ${
                          addedAnimation
                            ? 'bg-emerald-600'
                            : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95'
                        }`}
                      >
                        {addedAnimation ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                        <span>{addedAnimation ? 'Added' : 'Add'}</span>
                      </motion.button>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Pagination Indicators */}
              <div className="flex items-center gap-2 mt-3 z-20">
                {SIGNATURE_DISHES.map((dish, idx) => {
                  const isCurrent = activeIndex === idx;
                  return (
                    <button
                      key={dish.id}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to ${dish.category} slide`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isCurrent
                          ? 'w-7 bg-orange-500 shadow-sm shadow-orange-500/50'
                          : 'w-2 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600'
                      }`}
                    />
                  );
                })}
              </div>

            </motion.div>

          </div>

        </div>

        {/* ================= BOTTOM: INTERACTIVE CULINARY FLOATING DOCK ================= */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-neutral-200/80 dark:border-neutral-800/80 flex flex-col items-center">
          
          <div className="flex items-center justify-between w-full mb-3 px-1">
            <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Select Signature Creation:
            </span>
            <button
              onClick={() => navigate('/menu')}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All Menus</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Floating Dock Synced with Slider */}
          <div className="w-full overflow-x-auto pb-2 pt-2 px-1 scrollbar-none flex items-center justify-start sm:justify-center gap-2.5 sm:gap-4">
            {SIGNATURE_DISHES.map((dish, idx) => {
              const isSelected = activeIndex === idx;
              return (
                <button
                  key={dish.id}
                  onClick={() => goToSlide(idx)}
                  className={`flex items-center gap-2.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl transition-all duration-300 shrink-0 cursor-pointer border ${
                    isSelected
                      ? 'bg-white dark:bg-neutral-850 border-orange-500 shadow-lg shadow-orange-500/15 scale-105 -translate-y-1'
                      : 'bg-white/60 dark:bg-neutral-900/60 border-neutral-200/90 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:-translate-y-0.5'
                  }`}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm shrink-0"
                  />
                  <div className="text-left min-w-0">
                    <p
                      className={`text-xs sm:text-sm font-black truncate transition-colors ${
                        isSelected
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {dish.category}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate">
                      ₹{dish.price} • {dish.prepTime}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
