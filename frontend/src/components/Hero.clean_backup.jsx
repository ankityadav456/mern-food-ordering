import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Flame,
  ChevronRight,
  Check,
} from 'lucide-react';

// Real project assets
import heroDarkImg from '../assets/Images/heroImage.png';
import heroLightImg from '../assets/Images/heroImglight.png';
import allImg from '../assets/Images/allimage.jpg';
import pizzaImg from '../assets/Images/pizza1.png';
import burgerImg from '../assets/Images/burger1.png';
import chineseImg from '../assets/Images/Chinese-Food-Download-Free-PNG.png';
import biryaniImg from '../assets/Images/biryani.png';
import chickenImg from '../assets/Images/chicken.png';

export const APP_CATEGORIES = [
  { id: 'all', name: 'All', image: allImg },
  { id: 'biryani', name: 'Biryani', image: biryaniImg },
  { id: 'pizza', name: 'Pizza', image: pizzaImg },
  { id: 'burger', name: 'Burger', image: burgerImg },
  { id: 'chinese', name: 'Chinese', image: chineseImg },
  { id: 'chicken', name: 'Chicken', image: chickenImg },
];

const SEARCH_SUGGESTIONS = [
  'Biryani',
  'Pizza',
  'Burger',
  'Chinese',
  'Chicken',
  'Butter Chicken',
];

const CHEF_SPECIAL = {
  _id: 'featured-biryani-special',
  name: 'Shahi Hyderabadi Dum Biryani',
  category: 'Biryani',
  price: 299,
  originalPrice: 399,
  rating: 4.9,
  prepTime: '25-30 min',
  image: biryaniImg,
  description: 'Slow-cooked aged basmati rice with marinated chicken, saffron & desi ghee.',
};

export default function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [added, setAdded] = useState(false);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/menu');
    }
  };

  const handleQuickTag = (tag) => {
    setSearchQuery(tag);
    navigate(`/menu?search=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (catName) => {
    setActiveCategory(catName);
    if (catName === 'All') {
      navigate('/menu');
    } else {
      navigate(`/menu?category=${encodeURIComponent(catName.toLowerCase())}`);
    }
  };

  const handleOrderSpecial = () => {
    if (addToCart) {
      addToCart({
        _id: CHEF_SPECIAL._id,
        name: CHEF_SPECIAL.name,
        price: CHEF_SPECIAL.price,
        image: CHEF_SPECIAL.image,
        category: CHEF_SPECIAL.category,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      toast.success(`${CHEF_SPECIAL.name} added to cart!`, {
        duration: 2000,
        style: {
          borderRadius: '12px',
          background: isDark ? '#1a1a24' : '#ffffff',
          color: isDark ? '#ffffff' : '#0f172a',
          fontWeight: 600,
          fontSize: '14px',
        },
      });
    } else {
      navigate('/menu');
    }
  };

  return (
    <section
      id="home"
      className="relative w-full overflow-hidden bg-white dark:bg-[#0d0d12] text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20 border-b border-neutral-200/80 dark:border-neutral-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-7 flex flex-col justify-center min-w-0">
            
            {/* Top Offer Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-orange-600 dark:text-orange-400 text-xs font-semibold w-fit mb-4">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              <span>Fresh food prepared to order • Fast delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
              Delicious Food, Delivered{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500">
                Fresh & Hot.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
              Order your favorite dum biryanis, stone-baked pizzas, juicy burgers, and authentic tandoori delights prepared fresh in our kitchen and delivered straight to your door.
            </p>

            {/* Clean Search Bar */}
            <div className="mt-6 p-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm max-w-xl">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes, biryani, pizza, burger..."
                    className="w-full pl-10 pr-3 py-2.5 sm:py-3 text-xs sm:text-sm rounded-xl bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-orange-600 hover:bg-orange-500 active:scale-95 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Popular Search Suggestions */}
              <div className="mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                <span className="text-[11px] font-semibold text-neutral-400 shrink-0">
                  Popular:
                </span>
                {SEARCH_SUGGESTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleQuickTag(tag)}
                    className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors shrink-0 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Categories Row */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                  Explore Cuisines
                </span>
                <button
                  onClick={() => navigate('/menu')}
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Menu</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pt-1 pb-2 scrollbar-none">
                {APP_CATEGORIES.map((cat) => {
                  const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden p-1 transition-all duration-200 border ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/30 shadow-sm'
                            : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 group-hover:border-orange-400'
                        }`}
                      >
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <span
                        className={`text-xs font-bold transition-colors ${
                          isSelected
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-neutral-700 dark:text-neutral-300 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Clean Trust Indicators */}
            <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-neutral-800 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">25-30 Mins</p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500">Average Delivery</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">4.8 / 5.0</p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500">10,000+ Reviews</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white">100% Fresh</p>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500">Hygienic Kitchen</p>
                </div>
              </div>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: GROUNDED REALISTIC SHOWCASE ================= */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <div className="w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
              
              {/* Banquet Photography Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <img
                  src={isDark ? heroDarkImg : heroLightImg}
                  alt="Delicious food banquet"
                  className="w-full h-full object-cover"
                />
                
                {/* Clean In-Image Badge */}
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Top Rated Dishes</span>
                </div>
              </div>

              {/* Grounded Chef Special Card Below Image */}
              <div className="p-4 sm:p-5 bg-white dark:bg-neutral-900 border-t border-neutral-200/80 dark:border-neutral-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide block mb-0.5">
                      Chef&apos;s Special Today
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white truncate">
                      {CHEF_SPECIAL.name}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                      {CHEF_SPECIAL.description}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white">
                      ₹{CHEF_SPECIAL.price}
                    </p>
                    <p className="text-xs text-neutral-400 line-through">
                      ₹{CHEF_SPECIAL.originalPrice}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2.5">
                  <button
                    onClick={handleOrderSpecial}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      added
                        ? 'bg-emerald-600'
                        : 'bg-orange-600 hover:bg-orange-500 active:scale-95'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Order Now • ₹{CHEF_SPECIAL.price}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => navigate('/menu')}
                    className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border border-neutral-200 dark:border-neutral-750 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                  >
                    View Menu
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
