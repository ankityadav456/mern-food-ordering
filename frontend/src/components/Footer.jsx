import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  ShieldCheck,
  Truck,
  Heart,
  Send,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Award,
} from "lucide-react";
import { showToast } from "../utils/showToast.jsx";
import logo from "../assets/Images/AppLogo.png";

const Footer = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      showToast("Please enter your email address", "error");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      showToast("Please enter a valid email", "error");
      return;
    }
    showToast("🎉 Thank you! ₹150 coupon sent to your inbox.", "success");
    setNewsletterEmail("");
  };

  return (
    <footer
      className={`relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-[#0c0c10] text-neutral-300 border-t border-neutral-800/80"
          : "bg-gradient-to-b from-neutral-50 via-white to-neutral-100 text-neutral-700 border-t border-neutral-200"
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Value Propositions Strip */}
      <div
        className={`border-b ${
          isDark
            ? "border-neutral-800/80 bg-[#121217]/60"
            : "border-neutral-200/80 bg-white/70"
        } backdrop-blur-sm`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Fast Delivery
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Hot & fresh in 25–35 min
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  100% Hygienic
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  FSSAI certified kitchen
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Master Chefs
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Authentic secret recipes
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Best Flavours
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Pure spices & fresh desi ghee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src={logo}
                alt="Yumigo Logo"
                className="w-9 h-9 object-contain drop-shadow-sm transition-transform group-hover:scale-105"
              />
              <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Yumi<span className="text-orange-500">go</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 pr-2">
              Slow-cooked handi biryanis, wood-fired desi pizzas, and authentic
              street-style dishes prepared live in our certified kitchen and
              delivered piping hot to your doorstep.
            </p>

            {/* Social Icons */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {[
                  {
                    icon: FaInstagram,
                    href: "https://instagram.com",
                    label: "Instagram",
                    color: "hover:text-pink-500 hover:border-pink-500/40",
                  },
                  {
                    icon: FaFacebookF,
                    href: "https://facebook.com",
                    label: "Facebook",
                    color: "hover:text-blue-500 hover:border-blue-500/40",
                  },
                  {
                    icon: FaTwitter,
                    href: "https://twitter.com",
                    label: "Twitter",
                    color: "hover:text-sky-400 hover:border-sky-400/40",
                  },
                  {
                    icon: FaYoutube,
                    href: "https://youtube.com",
                    label: "YouTube",
                    color: "hover:text-red-500 hover:border-red-500/40",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={i}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
                        isDark
                          ? "bg-[#17171d] border-neutral-800 text-neutral-300 hover:bg-[#1f1f27]"
                          : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                      } ${item.color}`}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Explore Menu & Categories (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Menu Picks
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Royal Biryani", to: "/menu?category=Biryani" },
                { name: "Desi Pizzas", to: "/menu?category=Pizza" },
                { name: "Street Burgers", to: "/menu?category=Burger" },
                { name: "Indo-Chinese", to: "/menu?category=Chinese" },
                { name: "Tandoori Chicken", to: "/menu?category=Chicken" },
                { name: "Explore All Dishes", to: "/menu" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group"
                  >
                    <ChevronRight
                      size={13}
                      className="text-neutral-400 group-hover:translate-x-0.5 transition-transform"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", to: "/" },
                { name: "Book A Table", to: "/book-table" },
                { name: "My Wishlist", to: "/wishlist" },
                { name: "Cart & Checkout", to: "/cart" },
                { name: "Track My Order", to: "/dashboard" },
                { name: "My Profile", to: "/profile" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors group"
                  >
                    <ChevronRight
                      size={13}
                      className="text-neutral-400 group-hover:translate-x-0.5 transition-transform"
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Get ₹150 Off Your Order
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Join our VIP dining club for exclusive chef specials, festival
                discounts, and instant coupon codes.
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
                    isDark
                      ? "bg-[#16161d] border-neutral-800 text-white placeholder-neutral-500 focus:border-orange-500"
                      : "bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:border-orange-500"
                  }`}
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-semibold shrink-0 shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send size={13} />
                  <span>Join</span>
                </button>
              </div>
            </form>

            {/* Direct Contact Info */}
            <div className="pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                <FaPhoneAlt className="text-orange-500 shrink-0" size={12} />
                <a
                  href="tel:+911234567890"
                  className="hover:text-orange-500 transition-colors font-medium"
                >
                  +91 12345 67890
                </a>
                <span className="text-neutral-400">• 10 AM - 11 PM</span>
              </div>

              <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-400">
                <FaEnvelope className="text-orange-500 shrink-0" size={12} />
                <a
                  href="mailto:support@yumigo.com"
                  className="hover:text-orange-500 transition-colors font-medium"
                >
                  support@yumigo.com
                </a>
              </div>

              <div className="flex items-start gap-2.5 text-neutral-600 dark:text-neutral-400">
                <FaMapMarkerAlt className="text-orange-500 shrink-0 mt-0.5" size={12} />
                <span>123 Food Street, Bandra West, Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright, Legal Links & Theme Toggle */}
      <div
        className={`border-t py-5 px-4 sm:px-6 lg:px-8 ${
          isDark
            ? "border-neutral-800/80 bg-[#09090d]"
            : "border-neutral-200 bg-neutral-100/60"
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          {/* Left: Copyright */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-bold text-neutral-800 dark:text-white">
              Yumigo
            </span>
            <span>• Handcrafted with</span>
            <Heart size={12} className="fill-red-500 text-red-500 inline mx-0.5" />
            <span>for food lovers</span>
            <span className="text-neutral-400 ml-1">
              (v{typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "1.0"})
            </span>
          </div>

          

          {/* Right: Legal & Policy links */}
          <div className="flex items-center gap-4">
            <span className="hover:text-orange-500 transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span>•</span>
            <span className="hover:text-orange-500 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span>•</span>
            <a
              href="mailto:support@yumigo.com"
              className="hover:text-orange-500 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;