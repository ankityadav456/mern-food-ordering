import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Star,
  Flame,
  Menu as MenuIcon,
  X,
  Clock,
  ChevronDown,
  Search,
  ArrowRight,
  ShoppingCart,
  Heart,
  ShoppingBag,
  Sparkles,
  Tag,
  Users,
  Award,
  Sun,
  Moon,
  Home as HomeIcon,
  LayoutGrid,
  CircleDot,
  Beef,
  Soup,
  Drum,
  Utensils,
  LogIn,
  UserPlus,
  ChevronRight,
} from 'lucide-react';
import { array } from 'prop-types';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = [
  {
    id: 'pizza',
    label: 'Pizza',
    icon: CircleDot,
    count: 64,
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc: 'Wood-fired, thin crust, deep dish and more',
  },
  {
    id: 'burger',
    label: 'Burger',
    icon: Beef,
    count: 48,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc: 'Juicy patties, loaded toppings, gourmet bites',
  },
  {
    id: 'biryani',
    label: 'Biryani',
    icon: Soup,
    count: 36,
    image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc: 'Aromatic rice, rich spices, slow-cooked perfection',
  },
  {
    id: 'chinese',
    label: 'Chinese',
    icon: Utensils,
    count: 52,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc: 'Noodles, dim sum, stir-fry and wok-tossed flavors',
  },
  {
    id: 'chicken',
    label: 'Chicken',
    icon: Drum,
    count: 44,
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    desc: 'Grilled, fried, roasted and smoky tenders',
  },
];

const FEATURED_ITEMS = [
  {
    name: 'Margherita Classica',
    category: 'Pizza',
    price: '$12.99',
    originalPrice: '$16.99',
    rating: 4.9,
    reviews: 324,
    image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
    tag: 'Bestseller',
  },
  {
    name: 'Smash Double Stack',
    category: 'Burger',
    price: '$14.50',
    originalPrice: '$18.00',
    rating: 4.8,
    reviews: 256,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',
    tag: 'New',
  },
  {
    name: 'Hyderabadi Dum Biryani',
    category: 'Biryani',
    price: '$15.99',
    originalPrice: '$19.99',
    rating: 4.9,
    reviews: 412,
    image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=400',
    tag: 'Chef Special',
  },
  {
    name: 'Kung Pao Chicken',
    category: 'Chinese',
    price: '$13.50',
    originalPrice: '$17.00',
    rating: 4.7,
    reviews: 198,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=400',
    tag: 'Popular',
  },
  {
    name: 'Peri Peri Grilled',
    category: 'Chicken',
    price: '$11.99',
    originalPrice: '$14.99',
    rating: 4.8,
    reviews: 287,
    image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=400',
    tag: 'Spicy',
  },
];

const STATS = [
  { value: '500+', label: 'Dishes' },
  { value: '50+', label: 'Restaurants' },
  { value: '10K+', label: 'Happy Foodies' },
  { value: '4.8', label: 'Average Rating' },
];

const REVIEWS = [
  { name: 'Ayesha K.', text: 'The biryani here is absolutely authentic. Reminds me of home-cooked flavors. Best food app I have used!', rating: 5 },
  { name: 'Marcus D.', text: 'Ordered the smash burger and it was incredible. Juicy, flavorful, and arrived perfectly. Will order again!', rating: 5 },
  { name: 'Li Wei', text: 'Finally an app that gets Chinese food right. The dim sum and noodles are restaurant quality. Highly recommend.', rating: 5 },
  { name: 'Priya S.', text: 'Love the variety of pizzas. From classic Margherita to loaded BBQ, everything is fresh and delicious.', rating: 4 },
];


function Hero() {
  const MotionLink = motion(Link);
  const { theme } = useTheme();

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);

  /* ================= PARALLAX ================= */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* ================= GSAP HEADING ================= */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = titleRef.current.querySelectorAll(".hero-line");

      gsap.set(lines, {
        y: 80,
        opacity: 0,
        scale: 0.95,
        filter: "blur(6px)",
      });

      gsap.to(lines, {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1,
        ease: "power4.out",
        stagger: 0.25,
      });
      gsap.from(imageRef.current, {
        y: -320,
        opacity: 0,
        duration: 1.3,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden
      bg-background-light dark:bg-background-dark transition-colors duration-500"
    >
      {/* ================= BACKGROUND ================= */}
      <motion.div style={{ y }} className="absolute inset-0">

        <div className="absolute inset-0 bg-gradient-to-br
          from-background-light via-background-light to-orange-100
          dark:from-background-dark dark:via-background-dark dark:to-surface-dark"
        />

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(255,87,34,0.25), transparent 55%),
              radial-gradient(circle at 80% 20%, rgba(255,193,7,0.25), transparent 55%),
              radial-gradient(circle at 60% 80%, rgba(255,87,34,0.15), transparent 60%)
            `,
          }}
        />

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-light/10 dark:bg-primary-dark/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-light/10 dark:bg-secondary-dark/20 rounded-full blur-3xl" />
      </motion.div>

      {/* ================= CONTENT ================= */}
      <motion.div
        // style={{ opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20"
      >
         <div className="grid lg:grid-cols-2 items-center gap-12">  

          <div className="max-w-3xl text-center lg:text-left">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
              bg-primary-light/10 dark:bg-primary-dark/20
              border border-primary-light dark:border-primary-dark mb-8"
            >
              <Flame className="w-4 h-4 text-primary-light dark:text-primary-dark" />
              <span className="text-sm font-medium text-primary-light dark:text-primary-dark">
                Fresh deals every day
              </span>
            </motion.div>

            {/* Heading */}
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-text-light dark:text-text-dark"
            >
              <span className="hero-line block">Crave it.</span>

              <span
                className="hero-line block text-transparent bg-clip-text
                bg-gradient-to-r
                from-primary-light to-secondary-light
                dark:from-primary-dark dark:to-secondary-dark"
              >
                Order it.
              </span>

              <span className="hero-line block">Love it.</span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg max-w-xl leading-relaxed
              text-text-subtleLight dark:text-text-subtleDark"
            >
              Cravings don’t wait. Fresh food, fast delivery,
              and unforgettable taste — all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
             className="mt-10 flex justify-center lg:justify-start"
            >
              <MotionLink
                to="/menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r
                from-primary-light to-secondary-light
                dark:from-primary-dark dark:to-secondary-dark
                text-white font-semibold shadow-lg flex justify-center items-center gap-2 w-fit"
              >
                <ShoppingBag className="w-5 h-5" />
                Order Now
              </MotionLink>
            </motion.div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          {/* ================= RIGHT IMAGE ================= */}
<div className="flex justify-center w-full lg:w-auto">

  {/* GSAP ENTRY ANIMATION */}
  <div ref={imageRef}>
    
    {/* FLOATING EFFECT */}
    <motion.div
      animate={{ y: [0, -15, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="relative"
    >
      {/* Image */}
      <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl shadow-black/40 rotate-2 hover:rotate-0 transition-transform duration-700">
        <img
          src="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=600"
          alt="Delicious food"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Deal Card */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute -left-16 top-6 bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Tag className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs">Today's deal</p>
            <p className="text-sm font-bold">30% off Biryani</p>
          </div>
        </div>
      </motion.div>

      {/* Rating Card */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute -right-6 bottom-6 bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-secondary-dark fill-secondary-dark" />
          <div>
            <p className="text-xs">Top rated</p>
            <p className="text-sm font-bold">4.8 avg rating</p>
          </div>
        </div>
      </motion.div>

    </motion.div>

  </div>
</div>

        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ChevronDown className="w-6 h-6 text-text-subtleLight dark:text-text-subtleDark" />
        </motion.div>
      </div>
    </section>
  );
}

// export default Hero;
function Categories() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeCategory, setActiveCategory] = useState(null);

  const handleCategoryClick = (category) => {
  navigate(`/menu?category=${category}`);
};

  return (
    <section ref={ref} id="menu" className="py-20 bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Menu</span>
          <h2 className="mt-3 text-4xl font-bold text-text-light dark:text-text-dark tracking-tight">Pick Your Craving</h2>
          <p className="mt-4 text-text-subtle dark:text-text-subtle-dark max-w-lg mx-auto">Five handpicked categories, hundreds of mouthwatering dishes. What are you in the mood for?</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.label)}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden aspect-[4/5]"
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(135deg, rgba(255,87,34,0.3) 0%, transparent 60%)',
              }} />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                {/* <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary-light bg-primary/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    {cat.count} items
                  </span>
                </div> */}
                <h3 className="text-xl font-bold text-white">{cat.label}</h3>
                <p className={`text-sm text-gray-300 transition-all duration-300 overflow-hidden ${activeCategory === cat.id ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'}`}>
                  {cat.desc}
                </p>
              </div>

              <div className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${activeCategory === cat.id ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedItems() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [liked, setLiked] = useState({});

  const toggleLike = (name) => setLiked((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <section ref={ref} className="py-20 bg-surface-light dark:bg-surface-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <span className="text-primary font-semibold text-sm tracking-wider uppercase">Featured</span>
            <h2 className="mt-3 text-4xl font-bold text-text-light dark:text-text-dark tracking-tight">Today's Hot Picks</h2>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            View full menu <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_ITEMS.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300 border border-gray-100 dark:border-gray-800"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary-dark text-white text-xs font-bold shadow-lg shadow-primary/30">
                    {item.tag}
                  </span>
                </div>
                <button
                  onClick={() => toggleLike(item.name)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Heart className={`w-4 h-4 transition-colors ${liked[item.name] ? 'fill-primary text-primary' : 'text-text-subtle dark:text-text-subtle-dark'}`} />
                </button>
                <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-secondary-dark text-secondary-dark" />
                  <span className="text-xs font-bold text-text-light dark:text-text-dark">{item.rating}</span>
                  <span className="text-xs text-text-subtle dark:text-text-subtle-dark">({item.reviews})</span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{item.category}</span>
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark mt-1">{item.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-text-light dark:text-text-dark">{item.price}</span>
                    <span className="text-sm text-text-subtle dark:text-text-subtle-dark line-through">{item.originalPrice}</span>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary-dark text-white flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 transition-all duration-300">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const items = [
    { icon: Sparkles, title: 'Fresh Ingredients', desc: 'Every dish is prepared with farm-fresh ingredients sourced daily. No shortcuts, no compromises.' },
    {
    icon: Clock,
    title: 'Fast Delivery',
    desc: 'Hot meals delivered quickly to your doorstep with real-time tracking and reliable service.',
  },
    { icon: Users, title: 'Community Driven', desc: 'Real reviews from real food lovers. Your ratings help everyone discover the best dishes.' },
    { icon: Tag, title: 'Best Prices', desc: 'Exclusive deals and daily offers you will not find anywhere else. Save on every order.' },
  ];

  return (
    <section ref={ref} className="py-20 bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Why Yumigo</span>
          <h2 className="mt-3 text-4xl font-bold text-text-light dark:text-text-dark tracking-tight">Why Food Lovers Choose Us</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className="group p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/20 dark:hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-primary/10 transition-all duration-300 bg-surface-light dark:bg-surface-dark"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-5 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary-dark transition-all duration-300">
                <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">{item.title}</h3>
              <p className="text-sm text-text-subtle dark:text-text-subtle-dark leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setActive((prev) => (prev + 1) % REVIEWS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 bg-surface-light dark:bg-surface-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="mt-3 text-4xl font-bold text-text-light dark:text-text-dark tracking-tight">What Foodies Are Saying</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: REVIEWS[active].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary-dark text-secondary-dark" />
                ))}
              </div>
              <blockquote className="text-xl text-text-light dark:text-text-dark leading-relaxed italic">
                &ldquo;{REVIEWS[active].text}&rdquo;
              </blockquote>
              <div className="mt-8">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                  {REVIEWS[active].name[0]}
                </div>
                <p className="mt-3 font-semibold text-text-light dark:text-text-dark">{REVIEWS[active].name}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-2 mt-10">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === active ? 'bg-primary w-8' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Categories />
      <FeaturedItems />
      <WhyUs />
      {/* <Reviews /> */}
    </div>
  );
}
