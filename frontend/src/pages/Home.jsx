import { useState, useRef, useMemo, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useFood } from '../context/FoodContext';
import SkeletonCard from '../components/SkeletonCard';
import toast from 'react-hot-toast';
import Hero from '../components/Hero';
import {
  Star,
  Clock,
  ArrowRight,
  ShoppingBag,
  Heart,
  Sparkles,
  Users,
  Award,
  ChevronRight,
  Utensils,
  Check,
  Calendar,
  Flame,
  ShieldCheck,
  MapPin,
  Mail,
  Zap,
  Copy,
  ChefHat,
  Plus,
  Minus,
} from 'lucide-react';

// Exact category image assets
import allImg from '../assets/Images/allimage.jpg';
import pizzaImg from '../assets/Images/pizza1.png';
import burgerImg from '../assets/Images/burger1.png';
import chineseImg from '../assets/Images/Chinese-Food-Download-Free-PNG.png';
import biryaniImg from '../assets/Images/biryani.png';
import chickenImg from '../assets/Images/chicken.png';

const RESTAURANT_CATEGORIES = [
  {
    id: 'biryani',
    label: 'Biryani',
    title: 'Shahi Dum Biryani',
    image: biryaniImg,
    count: '12 Dishes',
    desc: 'Slow-cooked in clay handis with aged basmati, saffron, and pure desi ghee.',
    chefPick: 'Hyderabadi Chicken Dum',
  },
  {
    id: 'pizza',
    label: 'Pizza',
    title: 'Desi Wood-Fired Pizza',
    image: pizzaImg,
    count: '16 Dishes',
    desc: 'Crispy stone-baked crust topped with rich makhani sauce, malai paneer, and cheese.',
    chefPick: 'Paneer Tikka Makhani',
  },
  {
    id: 'burger',
    label: 'Burger',
    title: 'Desi Gourmet Burgers',
    image: burgerImg,
    count: '14 Dishes',
    desc: 'Juicy tandoori chicken tikkas, masala paneer slabs, and Delhi aloo tikki on butter buns.',
    chefPick: 'Tandoori Tikka Burger',
  },
  {
    id: 'chinese',
    label: 'Chinese',
    title: 'Indo-Chinese Wok',
    image: chineseImg,
    count: '18 Dishes',
    desc: 'Tossed hot on high flame — spicy Hakka noodles, chili paneer, and Schezwan fried rice.',
    chefPick: 'Chili Garlic Noodles',
  },
  {
    id: 'chicken',
    label: 'Chicken',
    title: 'Tandoori & Mughlai',
    image: chickenImg,
    count: '15 Dishes',
    desc: 'Charcoal roasted tikkas, rich butter chicken handis, and spicy highway dhaba curries.',
    chefPick: 'Amritsari Bhatti Murgh',
  },
];

export const SUB_MENUS = {
  All: ['All Dishes', 'Royal Biryani', 'Desi Pizzas', 'Indian Burgers', 'Indo-Chinese', 'Tandoor & Curries'],
  Biryani: ['All', 'Dum Biryani', 'Handi Biryani', 'Veg & Paneer Biryani'],
  Pizza: ['All', 'Paneer Specials', 'Tandoori Chicken', 'Spicy Desi Crust'],
  Burger: ['All', 'Desi Paneer Burgers', 'Tandoori Chicken Burgers', 'Crispy Aloo & Street'],
  Chinese: ['All', 'Hakka & Chili Noodles', 'Chilli Gravy & Dry', 'Fried Rice & Schezwan'],
  Chicken: ['All', 'Tandoori Tikkas', 'Mughlai Handi Curries', 'Dhaba Charcoal Specials'],
};

const SIGNATURE_MENU = [
  // --- BIRYANI ---
  {
    id: 'sig-biryani-1',
    name: 'Shahi Hyderabadi Chicken Dum Biryani',
    category: 'Biryani',
    subMenu: 'Dum Biryani',
    isVeg: false,
    price: 319,
    originalPrice: 399,
    rating: 4.9,
    reviews: 412,
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
    tag: "Chef's Signature",
    description: 'Aged long-grain daawat basmati cooked on slow charcoal dum with succulent chicken, saffron, fried onions, and desi ghee.',
  },
  {
    id: 'sig-biryani-2',
    name: 'Awadhi Gosht Handi Biryani',
    category: 'Biryani',
    subMenu: 'Handi Biryani',
    isVeg: false,
    price: 449,
    originalPrice: 549,
    rating: 4.9,
    reviews: 328,
    prepTime: '30 min',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=700&q=80',
    tag: 'Royal Handi',
    description: 'Lucknowi slow-simmered tender meat layered with kewra water, rose petals, royal spices and cardamom scented saffron basmati.',
  },
  {
    id: 'sig-biryani-3',
    name: 'Paneer Makhani Shahi Dum Biryani',
    category: 'Biryani',
    subMenu: 'Veg & Paneer Biryani',
    isVeg: true,
    price: 269,
    originalPrice: 329,
    rating: 4.8,
    reviews: 245,
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
    tag: 'Pure Veg Royal',
    description: 'Fresh malai paneer cubes tossed in rich makhani gravy, layered with spiced mint basmati rice and roasted cashew nuts.',
  },

  // --- PIZZA ---
  {
    id: 'sig-pizza-1',
    name: 'Tandoori Paneer Tikka Pizza',
    category: 'Pizza',
    subMenu: 'Paneer Specials',
    isVeg: true,
    price: 329,
    originalPrice: 419,
    rating: 4.9,
    reviews: 382,
    prepTime: '18 min',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80',
    tag: 'Wood Fired',
    description: 'Clay-oven roasted malai paneer, crunchy capsicum, red onions, makhani sauce base, and bubbling mozzarella on sourdough crust.',
  },
  {
    id: 'sig-pizza-2',
    name: 'Butter Chicken Makhani Pizza',
    category: 'Pizza',
    subMenu: 'Tandoori Chicken',
    isVeg: false,
    price: 379,
    originalPrice: 469,
    rating: 4.9,
    reviews: 356,
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
    tag: 'Bestseller',
    description: 'Shredded tandoori chicken tikka over aromatic butter gravy sauce, fresh green chillies, coriander and smoked mozzarella.',
  },
  {
    id: 'sig-pizza-3',
    name: 'Achari Masala Vegetable Burst Pizza',
    category: 'Pizza',
    subMenu: 'Spicy Desi Crust',
    isVeg: true,
    price: 299,
    originalPrice: 379,
    rating: 4.7,
    reviews: 198,
    prepTime: '18 min',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80',
    tag: 'Zesty & Spicy',
    description: 'Tangy Rajasthani pickling spices, charred sweet corn, bell peppers, jalapeños, and gooey cheddar-mozzarella blend.',
  },

  // --- BURGER ---
  {
    id: 'sig-burger-1',
    name: 'Charcoal Tandoori Chicken Tikka Burger',
    category: 'Burger',
    subMenu: 'Tandoori Chicken Burgers',
    isVeg: false,
    price: 219,
    originalPrice: 289,
    rating: 4.8,
    reviews: 290,
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
    tag: 'Tandoor Charred',
    description: 'Thick boneless tandoori chicken breast marinated in hung curd and spices, topped with laccha onions and mint chutney mayo.',
  },
  {
    id: 'sig-burger-2',
    name: 'Crispy Masala Paneer Makhani Burger',
    category: 'Burger',
    subMenu: 'Desi Paneer Burgers',
    isVeg: true,
    price: 189,
    originalPrice: 249,
    rating: 4.8,
    reviews: 234,
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=80',
    tag: 'Crunchy & Rich',
    description: 'Crispy spiced paneer slab dipped in house butter makhani sauce, topped with crisp iceberg lettuce and butter-toasted brioche.',
  },
  {
    id: 'sig-burger-3',
    name: 'Old Delhi Double Aloo Tikki Burger',
    category: 'Burger',
    subMenu: 'Crispy Aloo & Street',
    isVeg: true,
    price: 149,
    originalPrice: 199,
    rating: 4.7,
    reviews: 310,
    prepTime: '12 min',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=700&q=80',
    tag: 'Street Nostalgia',
    description: 'Golden spiced potato patties infused with roasted cumin and crushed peas, sweet saunth chutney, and spicy green teekhi chutney.',
  },

  // --- CHINESE ---
  {
    id: 'sig-chinese-1',
    name: 'Desi Chili Garlic Hakka Noodles',
    category: 'Chinese',
    subMenu: 'Hakka & Chili Noodles',
    isVeg: true,
    price: 219,
    originalPrice: 279,
    rating: 4.7,
    reviews: 214,
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80',
    tag: 'Fiery Wok',
    description: 'Hand-tossed noodles in flaming wok with crushed garlic, roasted red chilies, shredded cabbage, carrots, and desi dark soy sauce.',
  },
  {
    id: 'sig-chinese-2',
    name: 'Tangra Style Chilli Paneer Dry',
    category: 'Chinese',
    subMenu: 'Chilli Gravy & Dry',
    isVeg: true,
    price: 249,
    originalPrice: 319,
    rating: 4.8,
    reviews: 278,
    prepTime: '16 min',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80',
    tag: 'Indo-Chinese Icon',
    description: 'Wok-fried crispy cottage cheese cubes tossed with slit green chillies, spring onions, ginger, and aromatic Calcutta Tangra glaze.',
  },
  {
    id: 'sig-chinese-3',
    name: 'Schezwan Chicken Fried Rice',
    category: 'Chinese',
    subMenu: 'Fried Rice & Schezwan',
    isVeg: false,
    price: 259,
    originalPrice: 329,
    rating: 4.8,
    reviews: 195,
    prepTime: '15 min',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80',
    tag: 'Smoky & Bold',
    description: 'Fragrant long-grain rice tossed on high flame with spiced chicken morsels, egg ribbons, scallions and fiery house Schezwan chili paste.',
  },

  // --- CHICKEN ---
  {
    id: 'sig-chicken-1',
    name: 'Amritsari Bhatti Tandoori Murgh',
    category: 'Chicken',
    subMenu: 'Tandoori Tikkas',
    isVeg: false,
    price: 389,
    originalPrice: 489,
    rating: 4.9,
    reviews: 367,
    prepTime: '25 min',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=700&q=80',
    tag: 'Charcoal Heritage',
    description: 'Whole tender chicken marinated twice in mustard oil, roasted gram flour, Kashmiri red chili and charred over glowing charcoal.',
  },
  {
    id: 'sig-chicken-2',
    name: 'Purani Dilli Butter Chicken Handi',
    category: 'Chicken',
    subMenu: 'Mughlai Handi Curries',
    isVeg: false,
    price: 349,
    originalPrice: 439,
    rating: 4.9,
    reviews: 420,
    prepTime: '20 min',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80',
    tag: 'Royal Classic',
    description: 'Tandoor-charred chicken pieces simmered in silky satin tomato gravy finished with churned butter, kasuri methi, and fresh cream.',
  },
  {
    id: 'sig-chicken-3',
    name: 'Highway Dhaba Chicken Curry',
    category: 'Chicken',
    subMenu: 'Dhaba Charcoal Specials',
    isVeg: false,
    price: 319,
    originalPrice: 399,
    rating: 4.7,
    reviews: 189,
    prepTime: '22 min',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80',
    tag: 'Spicy & Rustic',
    description: 'Rustic slow-cooked chicken with whole crushed spices, rough-cut onions, and fresh green coriander—just like the Grand Trunk Road dhabas.',
  },
];

const RESTAURANT_PILLARS = [
  {
    icon: Utensils,
    title: 'Cooked Fresh When Ordered',
    desc: 'No cold reheated food. Every dish is cooked fresh from the tandoor and pans as soon as you order.',
    badge: '100% Fresh',
  },
  {
    icon: Sparkles,
    title: 'Real Spices & Pure Desi Ghee',
    desc: 'We roast and grind whole Indian spices ourselves. Zero chemical food colors, zero preservatives.',
    badge: 'Pure Taste',
  },
  {
    icon: Flame,
    title: 'Clay Handi & Real Coal Tandoor',
    desc: 'Authentic clay handis and live charcoal fire give our biryanis and tikkas that signature smoky aroma.',
    badge: 'Real Flame',
  },
  {
    icon: ShieldCheck,
    title: 'Clean Stainless Steel Kitchen',
    desc: 'Sanitized kitchen workstations, filtered RO water, and safe food handling you can trust for your family.',
    badge: 'Clean & Safe',
  },
];

const DINER_REVIEWS = [
  {
    name: 'Vikram Sharma',
    role: 'Regular Diner • 28 orders',
    rating: 5,
    dish: 'Shahi Hyderabadi Dum Biryani',
    comment:
      'The chicken biryani here has that real dum aroma. Fragrant aged rice, melt-in-mouth tender chicken, and the spices do not feel heavy at all. Best in town by far!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Ananya Gupta',
    role: 'Family Diner • 19 orders',
    rating: 5,
    dish: 'Tandoori Paneer Tikka Pizza',
    comment:
      'Loved the paneer tikka pizza! Crispy sourdough crust, generous cheese, and the tandoori paneer was fresh and spicy. The kids finished every single slice.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  },
  {
    name: 'Rohan Verma',
    role: 'Weekend Foodie • 34 orders',
    rating: 5,
    dish: 'Tandoori Chicken Tikka Burger',
    comment:
      'The tandoori chicken burger with mint chutney mayo is super juicy and spicy. Way better than regular fast-food burgers. Great packaging and fast delivery!',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
  },
];

// 1. Cuisines & Categories Showcase
function CategoryShowcase() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { foodItems } = useFood();

  // Dynamically compute real dish counts for each category
  const dynamicCategories = useMemo(() => {
    return RESTAURANT_CATEGORIES.map((cat) => {
      const liveCount = foodItems
        ? foodItems.filter(
            (f) => f.category?.toLowerCase() === cat.label.toLowerCase()
          ).length
        : 0;
      return {
        ...cat,
        count: `${liveCount} Dishes`,
      };
    });
  }, [foodItems]);

  return (
    <section ref={ref} className="py-10 sm:py-20 bg-white dark:bg-[#0c0c0e] transition-colors duration-300 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-12 gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="h-px w-6 bg-orange-600 dark:bg-orange-500"></span>
              <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-500">
                Menu Categories
              </span>
            </div>
            <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
              What Are You Craving Today?
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors group cursor-pointer w-fit"
          >
            <span>See Full Restaurant Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 5 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 w-full">
          {dynamicCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.25, delay: i * 0.05 }}
              onClick={() => navigate(`/menu?category=${cat.label}`)}
              className="group cursor-pointer rounded-2xl p-3 sm:p-5 bg-neutral-50 dark:bg-[#15151c] border border-neutral-200/90 dark:border-neutral-800 hover:border-orange-500/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between min-w-0"
            >
              <div>
                {/* Image Container with circular styling and explicit size */}
                <div
                  className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-2.5 sm:mb-3.5 p-1 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300 shadow-sm shrink-0"
                  style={{ width: '64px', height: '64px' }}
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="text-center">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400">
                    {cat.count}
                  </span>
                  <h3 className="text-xs sm:text-base font-bold text-neutral-900 dark:text-white mt-1.5 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                    {cat.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/70 dark:border-neutral-800 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-orange-600 dark:text-orange-400">
                <span className="truncate">Explore {cat.label}</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

// 2. Chef's Signature Menu with Category Tabs & Cart Integration
function FeaturedSignatureMenu() {
  const { cartItems, addToCart, updateItemQuantity, removeFromCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { foodItems, loading } = useFood();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('All');

  const categories = ['All', 'Biryani', 'Pizza', 'Burger', 'Chinese', 'Chicken'];

  // Purely dynamic dishes from database
  const allDishes = useMemo(() => {
    if (foodItems && foodItems.length > 0) {
      return foodItems.map((item, idx) => ({
        _id: item._id,
        id: item._id,
        name: item.name,
        category: item.category,
        isVeg:
          ['Pizza', 'Chinese', 'Burger'].includes(item.category) &&
          !item.name?.toLowerCase().includes('chicken') &&
          !item.name?.toLowerCase().includes('meat') &&
          !item.name?.toLowerCase().includes('mutton') &&
          !item.name?.toLowerCase().includes('fish'),
        price: item.price,
        originalPrice: Math.round(item.price * 1.25),
        rating: Number(item.rating) > 0 ? Number(item.rating).toFixed(1) : '4.5',
        reviews: 140 + ((idx * 29) % 200),
        prepTime:
          item.category === 'Burger'
            ? '15 min'
            : item.category === 'Pizza'
            ? '18 min'
            : '22 min',
        image: item.image,
        tag:
          idx === 0
            ? "Chef's Signature"
            : Number(item.rating) >= 4.6
            ? 'Top Rated'
            : 'Bestseller',
        description:
          item.description ||
          `Handcrafted ${item.name} prepared fresh with authentic seasonings and slow fire.`,
      }));
    }
    return [];
  }, [foodItems]);

  const filteredDishes = useMemo(() => {
    if (activeTab === 'All') return allDishes;
    return allDishes.filter(
      (dish) => dish.category?.toLowerCase() === activeTab.toLowerCase()
    );
  }, [allDishes, activeTab]);

  const getItemQuantity = (id) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find(
      (ci) => ci.foodId?._id === id || ci.foodId === id || ci._id === id
    );
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (dish) => {
    if (addToCart) {
      addToCart({
        _id: dish._id || dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        category: dish.category,
      });
    } else {
      navigate('/menu');
    }
  };

  const handleIncrease = (dish) => {
    const id = dish._id || dish.id;
    const qty = getItemQuantity(id);
    if (qty === 0) {
      handleAddToCart(dish);
    } else {
      updateItemQuantity(id, qty + 1);
    }
  };

  const handleDecrease = (dish) => {
    const id = dish._id || dish.id;
    const qty = getItemQuantity(id);
    if (qty <= 1) {
      removeFromCart(id);
    } else {
      updateItemQuantity(id, qty - 1);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-neutral-50 dark:bg-[#111116] border-y border-neutral-200/80 dark:border-neutral-850 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-px w-6 bg-orange-600 dark:bg-orange-500"></span>
            <span className="text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-500">
              Hot & Fresh
            </span>
            <span className="h-px w-6 bg-orange-600 dark:bg-orange-500"></span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Best Hot Picks
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Cooked fresh when you order. Authentic recipes served piping hot with signature flavours.
          </p>
        </div>

        {/* Cuisine Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 sm:mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeTab === cat
                  ? 'bg-primary-light dark:bg-primary-dark text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'bg-white dark:bg-[#181820] text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 hover:border-orange-400'
              }`}
            >
              {cat === 'All' ? 'All Specials' : cat}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (!foodItems || foodItems.length === 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} theme={theme} />
            ))}
          </div>
        ) : filteredDishes.length === 0 ? (
          /* Empty State for Category with 0 Items in Database */
          <div className="py-16 px-4 text-center flex flex-col items-center justify-center bg-white dark:bg-[#15151c] rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-3">
              <Utensils className="w-8 h-8 opacity-70" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              No {activeTab} dishes available right now
            </h3>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm">
              Our chefs haven't added any {activeTab.toLowerCase()} items to the menu yet. Please explore our other categories!
            </p>
            <button
              onClick={() => setActiveTab('All')}
              className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-light dark:bg-primary-dark hover:opacity-95 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              View All Specials
            </button>
          </div>
        ) : (
          /* Compact Dish Cards Grid (4 columns on desktop, smaller height & balanced typography) */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {filteredDishes.map((dish) => {
                const id = dish._id || dish.id;
                const quantity = getItemQuantity(id);
                const isFav = isInWishlist(id);
                const discountPercent = Math.round(
                  ((dish.originalPrice - dish.price) / dish.originalPrice) * 100
                );

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => navigate(`/food/${id}`)}
                    className="rounded-2xl overflow-hidden bg-white dark:bg-[#15151c] border border-neutral-200/90 dark:border-neutral-800 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                  >
                    {/* Card Header & Photo - Frosted ambient dish stage */}
                    <div className="relative w-full h-36 sm:h-40 overflow-hidden rounded-t-2xl bg-gradient-to-b from-neutral-100/80 to-neutral-100/40 dark:from-[#161622] dark:to-[#111118] flex items-center justify-center p-2.5 sm:p-3 border-b border-neutral-100 dark:border-neutral-800/80">
                      
                      {/* Ambient dish soft glow */}
                      <div className="absolute w-24 h-24 rounded-full bg-orange-500/10 dark:bg-orange-500/15 blur-2xl pointer-events-none" />

                      <img
                        src={dish.image}
                        alt={dish.name}
                        loading="lazy"
                        className="relative z-10 max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300 pointer-events-none select-none"
                      />

                      {/* Like button (Top Right) with blurry transparent glass */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(dish);
                        }}
                        aria-label={isFav ? "Remove from wishlist" : "Add to favorites"}
                        title={isFav ? "Remove from wishlist" : "Add to wishlist"}
                        className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-white/75 dark:bg-black/50 backdrop-blur-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-xs cursor-pointer border border-white/60 dark:border-white/10"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-colors ${
                            isFav
                              ? 'fill-red-500 text-red-500'
                              : 'text-neutral-600 dark:text-neutral-300'
                          }`}
                        />
                      </button>

                      {/* Clean Modern Blurry Transparent Bottom Overlay Info */}
                      <div className="absolute bottom-2 left-2.5 right-2.5 z-20 flex items-center justify-between text-xs pointer-events-none">
                        <div className="flex items-center gap-1 bg-white/75 dark:bg-black/55 backdrop-blur-md px-2 py-0.5 rounded-full text-neutral-700 dark:text-neutral-200 text-[10px] font-medium border border-white/60 dark:border-white/10 shadow-xs">
                          <Clock className="w-2.5 h-2.5 text-neutral-400 dark:text-neutral-400" />
                          <span>{dish.prepTime}</span>
                        </div>

                        <div className="flex items-center gap-1 bg-white/75 dark:bg-black/55 backdrop-blur-md px-2 py-0.5 rounded-full text-amber-500 dark:text-amber-400 text-[10px] font-bold border border-white/60 dark:border-white/10 shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{dish.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Content - Sleeker padding & fonts */}
                    <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category & Veg/Non-Veg Badge */}
                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            {dish.category}
                          </span>

                          {/* Indian Veg / Non-Veg Icon */}
                          <div
                            className="flex items-center gap-1 flex-shrink-0"
                            title={dish.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                          >
                            <span
                              className={`w-3 h-3 border flex items-center justify-center p-0.5 rounded-xs ${
                                dish.isVeg ? 'border-emerald-600' : 'border-red-600'
                              }`}
                            >
                              <span
                                className={`w-1 h-1 rounded-full ${
                                  dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                                }`}
                              />
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              {dish.isVeg ? 'Veg' : 'Non-Veg'}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white leading-snug truncate" title={dish.name}>
                          {dish.name}
                        </h3>
                      </div>

                      {/* Pricing & Add to Cart */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">
                              ₹{dish.price}
                            </span>
                            <span className="text-[11px] text-neutral-400 line-through">
                              ₹{dish.originalPrice}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 block">
                            {discountPercent}% OFF
                          </span>
                        </div>

                        {/* Dynamic Cart Quantity or Add Button */}
                        {quantity > 0 ? (
                          <div className="flex items-center bg-orange-600 dark:bg-orange-500 text-white rounded-xl shadow-xs p-0.5">
                            <button
                              onClick={() => handleDecrease(dish)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/20 transition-colors cursor-pointer active:scale-95"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-black select-none">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleIncrease(dish)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-black/20 transition-colors cursor-pointer active:scale-95"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(dish)}
                            className="px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-primary-light dark:bg-primary-dark hover:opacity-95 transition-all flex items-center gap-1 shadow-xs active:scale-95 cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add To Order</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}

// 3. The Restaurant Kitchen Craft & Heritage Story
function KitchenStory() {
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0c0c0e] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Imagery Composition */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-4">
            <div className="space-y-3.5 sm:space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-md h-48 sm:h-64 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80"
                  alt="Restaurant Dining Atmosphere"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-orange-500/10 dark:bg-orange-950/40 border border-orange-500/20 text-center">
                <div className="text-xl sm:text-2xl font-black text-orange-600 dark:text-orange-400">
                  Daily Fresh
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
                  Fresh dough & ground spices
                </p>
              </div>
            </div>

            <div className="space-y-3.5 sm:space-y-4 pt-4 sm:pt-6">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 text-center">
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                  100%
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
                  Clay tandoor & handi dum
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-md h-48 sm:h-64 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80"
                  alt="Kitchen Chef Cooking"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Right: Human Narrative */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="h-px w-6 bg-orange-600 dark:bg-orange-500"></span>
              <span className="text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-500">
                Our Kitchen Story
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
              Good Food Takes Time & Honest Ingredients
            </h2>

            <p className="mt-3.5 text-xs sm:text-sm lg:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
              We started Yumigo with one simple promise: no frozen gravies, no artificial colors, and no shortcuts. Our royal biryanis are sealed in clay handis over slow charcoal embers to lock in every drop of flavor. Our desi pizzas are baked in a piping hot stone oven, and our tandoori tikkas are charred over live coal.
            </p>

            <div className="mt-5 space-y-2.5 sm:space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                  <strong>100% Real Spices:</strong> Freshly roasted whole spices. No chemical colors or readymade powders.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                  <strong>Daily Fresh Dough & Buns:</strong> Kneaded fresh every single morning, never stale or frozen.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                  <strong>Live Open Kitchen:</strong> You can watch our cooks make your food fresh from the dining floor.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center gap-4">
              <button
                onClick={() => navigate('/menu')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-primary-light dark:bg-primary-dark hover:opacity-95 shadow-sm transition-all cursor-pointer"
              >
                See Full Menu
              </button>
              <div className="text-left flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 dark:text-white">Chef Ankit & Team</p>
                  <p className="text-[11px] text-neutral-500">Fresh Food Everyday</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 4. Table Reservation & Dine-in Booking Bar
function ReservationBanner() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState('2 Guests');
  const [timeSlot, setTimeSlot] = useState('07:30 PM');
  const [date, setDate] = useState('Today');
  const [booked, setBooked] = useState(false);

  const handleBookTable = (e) => {
    e.preventDefault();
    setBooked(true);
    toast.success(`Table reserved for ${guests} at ${timeSlot}!`, {
      icon: '🍽️',
      duration: 3000,
    });
    setTimeout(() => {
      setBooked(false);
      navigate('/book-table', {
        state: { guests, timeSlot, date },
      });
    }, 900);
  };

  return (
    <section className="py-12 sm:py-16 bg-[#0f0f12] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17171c] border border-neutral-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            
            {/* Left: Heading & Description */}
            <div className="max-w-xl">
              <span className="text-[11px] font-bold tracking-widest uppercase text-orange-500 block mb-1">
                Family & Friends Dining
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Book A Table For Dine-In
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Coming with family or friends? Book your table in advance so your seats are ready when you arrive. Zero booking charges.
              </p>
            </div>

            {/* Right: Clean, spacious horizontal reservation bar */}
            <form
              onSubmit={handleBookTable}
              className="bg-[#1f1f26] border border-neutral-750/70 p-3 sm:p-3.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-3 shrink-0"
            >
              {/* Date */}
              <div className="min-w-[110px]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-0.5">
                  Date
                </label>
                <div className="relative">
                  <select
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#272732] hover:bg-[#2d2d3a] text-xs font-semibold rounded-xl px-3 py-2.5 border border-neutral-700/80 text-white focus:outline-none focus:border-orange-500 cursor-pointer transition appearance-none pr-7"
                  >
                    <option className="bg-[#1f1f26] text-white" value="Today">Today</option>
                    <option className="bg-[#1f1f26] text-white" value="Tomorrow">Tomorrow</option>
                    <option className="bg-[#1f1f26] text-white" value="This Weekend">This Weekend</option>
                  </select>
                  <ChevronRight size={13} className="absolute right-2.5 top-3 text-neutral-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Party Size */}
              <div className="min-w-[115px]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-0.5">
                  Party Size
                </label>
                <div className="relative">
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-[#272732] hover:bg-[#2d2d3a] text-xs font-semibold rounded-xl px-3 py-2.5 border border-neutral-700/80 text-white focus:outline-none focus:border-orange-500 cursor-pointer transition appearance-none pr-7"
                  >
                    <option className="bg-[#1f1f26] text-white" value="1 Guest">1 Guest</option>
                    <option className="bg-[#1f1f26] text-white" value="2 Guests">2 Guests</option>
                    <option className="bg-[#1f1f26] text-white" value="4 Guests">4 Guests</option>
                    <option className="bg-[#1f1f26] text-white" value="6 Guests">6 Guests</option>
                    <option className="bg-[#1f1f26] text-white" value="8+ Guests">8+ Guests</option>
                  </select>
                  <ChevronRight size={13} className="absolute right-2.5 top-3 text-neutral-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Time */}
              <div className="min-w-[110px]">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 px-0.5">
                  Time
                </label>
                <div className="relative">
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#272732] hover:bg-[#2d2d3a] text-xs font-semibold rounded-xl px-3 py-2.5 border border-neutral-700/80 text-white focus:outline-none focus:border-orange-500 cursor-pointer transition appearance-none pr-7"
                  >
                    <option className="bg-[#1f1f26] text-white" value="01:00 PM">01:00 PM</option>
                    <option className="bg-[#1f1f26] text-white" value="02:30 PM">02:30 PM</option>
                    <option className="bg-[#1f1f26] text-white" value="07:00 PM">07:00 PM</option>
                    <option className="bg-[#1f1f26] text-white" value="07:30 PM">07:30 PM</option>
                    <option className="bg-[#1f1f26] text-white" value="08:00 PM">08:00 PM</option>
                    <option className="bg-[#1f1f26] text-white" value="08:30 PM">08:30 PM</option>
                    <option className="bg-[#1f1f26] text-white" value="09:00 PM">09:00 PM</option>
                  </select>
                  <ChevronRight size={13} className="absolute right-2.5 top-3 text-neutral-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* Book Table Button */}
              <button
                type="submit"
                className={`h-[38px] px-5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm ${
                  booked
                    ? 'bg-emerald-600'
                    : 'bg-orange-600 hover:bg-orange-500 active:scale-95'
                }`}
              >
                {booked ? <Check className="w-4 h-4 shrink-0" /> : <Calendar className="w-4 h-4 shrink-0" />}
                <span className="whitespace-nowrap">{booked ? 'Reserved' : 'Book Table'}</span>
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
}

// 5. Kitchen Standards & Restaurant Pillars
function KitchenPillars() {
  return (
    <section className="py-14 sm:py-20 bg-neutral-50 dark:bg-[#111116] border-b border-neutral-200/80 dark:border-neutral-850 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-500">
            What We Stand For
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
            Simple Promise: Clean, Fresh & Tasty
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Good food made with honest cooking, pure spices, and real kitchen care.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {RESTAURANT_PILLARS.map((pillar, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#15151c] border border-neutral-200/90 dark:border-neutral-800 hover:border-orange-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 px-2.5 py-0.5 rounded-full bg-orange-500/10">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mb-1.5">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// 6. Guest Reviews & Local Praise
function GuestReviews() {
  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-[#0c0c0e] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold tracking-widest uppercase text-orange-600 dark:text-orange-500">
            Customer Reviews
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight mt-1">
            What Our Regular Diners Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {DINER_REVIEWS.map((review, i) => (
            <div
              key={i}
              className="p-5 sm:p-6 rounded-3xl bg-neutral-50 dark:bg-[#15151c] border border-neutral-200/90 dark:border-neutral-800 flex flex-col justify-between hover:shadow-xl transition-all"
            >
              <div>
                {/* Stars & Tag */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full">
                    {review.dish}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Reviewer Profile */}
              <div className="mt-5 pt-4 border-t border-neutral-200/70 dark:border-neutral-800 flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// 7. VIP Dining Club / Promotional Strip
function DiningClub() {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('YUMIGO150');
    setCopied(true);
    toast.success('Coupon YUMIGO150 copied! Use at checkout for ₹150 OFF.', {
      icon: '🎉',
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Coupon sent to ' + email + '! Enjoy your meal.', {
      icon: '🎁',
    });
    setEmail('');
  };

  return (
    <></>
  );
}

// Full Main Homepage Component
export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* 1. Grounded Restaurant Hero Section */}
      <Hero />

      {/* 2. Best Hot Picks Handcrafted Menu */}
      <FeaturedSignatureMenu />

      {/* 4. The Kitchen Craft & Heritage Story */}
      <KitchenStory />

      {/* 5. Table Reservation & Dine-In Bar */}
      <ReservationBanner />

      {/* 6. Kitchen Hygiene & Restaurant Standards */}
      <KitchenPillars />

      {/* 7. Verified Guest Testimonials */}
      <GuestReviews />

      {/* 8. VIP Dining Club Coupon Strip */}
      <DiningClub />
    </div>
  );
}

