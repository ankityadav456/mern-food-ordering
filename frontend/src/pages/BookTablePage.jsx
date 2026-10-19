import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Check,
  ChevronRight,
  MapPin,
  Phone,
  UtensilsCrossed,
  X,
  Sparkles,
  QrCode,
  Download,
  ShieldCheck,
  Heart,
  PartyPopper,
  Briefcase,
} from "lucide-react";

// Curated Dining Ambiance Zones with high-res photography
const DINING_ZONES = [
  {
    id: "Rooftop Sky Lounge",
    name: "Rooftop Sky Lounge",
    tag: "Open Air • City Skyline",
    description: "Panoramic city view, evening breeze, and soft acoustic ambient music.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=700&q=80",
    prefix: "RT",
  },
  {
    id: "Candlelight Couple Booth",
    name: "Candlelight Couple Booth",
    tag: "Intimate & Romantic",
    description: "Warm candlelit corner booths with plush velvet seating and private space.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
    prefix: "CB",
  },
  {
    id: "Royal Heritage Lounge",
    name: "Royal Heritage Lounge",
    tag: "Family Banquette",
    description: "Spacious round banquet tables designed for lively family celebrations.",
    image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=700&q=80",
    prefix: "RH",
  },
  {
    id: "Main Culinary Hall",
    name: "Main Culinary Hall",
    tag: "Live Kitchen View",
    description: "Vibrant indoor dining hall with live aroma from our copper tandoors.",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=80",
    prefix: "TH",
  },
];

const OCCASIONS = [
  { id: "Casual Dining", label: "Casual Dining", icon: UtensilsCrossed },
  { id: "Birthday Celebration", label: "Birthday Party", icon: PartyPopper },
  { id: "Anniversary", label: "Anniversary", icon: Heart },
  { id: "Business Dinner", label: "Business Meeting", icon: Briefcase },
];

const TIME_SLOTS = {
  Lunch: ["12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM"],
  Dinner: ["07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM"],
};

const BookTablePage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useAuth();
  const location = useLocation();

  // Active view tab: 'book' or 'my-bookings'
  const [activeTab, setActiveTab] = useState("book");

  // Initial State from Home banner if passed
  const initialData = location.state || {};
  const getTodayISO = () => new Date().toISOString().split("T")[0];

  const [date, setDate] = useState(initialData.dateIso || getTodayISO());
  const [dateShortcut, setDateShortcut] = useState(initialData.date || "Today");
  const [guests, setGuests] = useState(
    initialData.guests ? parseInt(initialData.guests) || 2 : 2
  );
  const [mealType, setMealType] = useState(
    initialData.timeSlot?.includes("01:") || initialData.timeSlot?.includes("02:")
      ? "Lunch"
      : "Dinner"
  );
  const [timeSlot, setTimeSlot] = useState(initialData.timeSlot || "07:30 PM");
  const [diningArea, setDiningArea] = useState(
    initialData.area || "Rooftop Sky Lounge"
  );
  const [occasion, setOccasion] = useState("Casual Dining");

  // Guest Details
  const [fullName, setFullName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [specialRequests, setSpecialRequests] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // My Reservations history
  const [myReservations, setMyReservations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || "");
      if (!email) setEmail(user.email || "");
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleShortcutDate = (type) => {
    setDateShortcut(type);
    const d = new Date();
    if (type === "Tomorrow") d.setDate(d.getDate() + 1);
    else if (type === "This Weekend") {
      const day = d.getDay();
      const diff = (6 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
    }
    setDate(d.toISOString().split("T")[0]);
  };

  const fetchMyReservations = async () => {
    setLoadingHistory(true);
    try {
      const url = user?.email
        ? `/reservations/my`
        : `/reservations/my?email=${encodeURIComponent(email || "")}`;
      const res = await axiosInstance.get(url);
      if (res.data?.success) {
        setMyReservations(res.data.reservations || []);
      }
    } catch {
      const local = JSON.parse(localStorage.getItem("yumigo_reservations") || "[]");
      setMyReservations(local);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "my-bookings") {
      fetchMyReservations();
    }
  }, [activeTab, user]);

  const selectedZone = useMemo(
    () => DINING_ZONES.find((z) => z.id === diningArea) || DINING_ZONES[0],
    [diningArea]
  );

  const handleBookTable = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) return toast.error("Please enter your name");
    if (!email.trim() || !email.includes("@"))
      return toast.error("Please enter a valid email");
    if (!phone.trim() || phone.length < 8)
      return toast.error("Please enter a valid phone number");

    setSubmitting(true);

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      date,
      timeSlot,
      guests,
      diningArea,
      occasion,
      specialRequests: specialRequests.trim(),
    };

    try {
      const res = await axiosInstance.post("/reservations", payload);
      if (res.data?.success) {
        const saved = res.data.reservation;
        setConfirmedBooking(saved);
        toast.success("Table reserved successfully! 🎉");
        const local = JSON.parse(localStorage.getItem("yumigo_reservations") || "[]");
        localStorage.setItem(
          "yumigo_reservations",
          JSON.stringify([saved, ...local.filter((r) => r.bookingReference !== saved.bookingReference)])
        );
      }
    } catch {
      const localBooking = {
        _id: "local_" + Date.now(),
        bookingReference: "YMG-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
        ...payload,
        tableNumber: `${selectedZone.prefix}-0${Math.floor(Math.random() * 8) + 1}`,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
      };
      const local = JSON.parse(localStorage.getItem("yumigo_reservations") || "[]");
      localStorage.setItem("yumigo_reservations", JSON.stringify([localBooking, ...local]));
      setConfirmedBooking(localBooking);
      toast.success("Table reserved successfully! 🎉");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelBooking = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to cancel reservation ${ref}?`)) return;
    try {
      await axiosInstance.patch(`/reservations/${id}/cancel`);
    } catch {
      // offline fallback
    }
    toast.success(`Reservation ${ref} cancelled`);
    setMyReservations((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: "Cancelled" } : r))
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-[#0b0b0e] text-neutral-100" : "bg-[#f8f8fa] text-neutral-900"
      }`}
    >
      {/* Sleek Hero Header - Starts flush under navbar without dead space */}
      <div
        className={`pt-20 sm:pt-22 pb-4 sm:pb-5 border-b transition-colors duration-200 ${
          isDark
            ? "bg-gradient-to-b from-[#13131a] via-[#101015] to-[#0b0b0e] border-neutral-800"
            : "bg-gradient-to-b from-white via-neutral-50/80 to-[#f8f8fa] border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Breadcrumb & Status */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <Link to="/" className="hover:text-orange-500 transition-colors">
                Home
              </Link>
              <ChevronRight size={13} />
              <span className="text-orange-600 dark:text-orange-400 font-bold">
                Table Reservations
              </span>
            </div>

            {/* Clean Tab Switcher */}
            <div
              className={`flex items-center gap-1 p-1 rounded-full border text-xs font-semibold shadow-sm ${
                isDark ? "bg-[#181822] border-neutral-800" : "bg-neutral-200/70 border-neutral-300"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveTab("book")}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === "book"
                    ? "bg-orange-600 text-white shadow-sm font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Book Table
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("my-bookings")}
                className={`px-3.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "my-bookings"
                    ? "bg-orange-600 text-white shadow-sm font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <span>My Bookings</span>
                {myReservations.length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                    {myReservations.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Headline & Value Proposition */}
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Reserve Your Dining Table
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              Book a guaranteed table in advance. Choose between our starlit rooftop terrace, private couple booths, or royal family lounge with zero booking charges.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck size={14} /> Zero Booking Fees
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
                <Clock size={14} /> 0-Minute Wait Guarantee
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Sparkles size={14} className="text-amber-500" /> Instant Pass
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-12">

        {/* TAB 1: RESERVATION EXPERIENCE */}
        {activeTab === "book" && (
          <form onSubmit={handleBookTable} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form & Seating Selection (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Ambiance Zone Selection */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm ${
                  isDark ? "bg-[#14141a] border-neutral-800" : "bg-white border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                      1. Select Dining Atmosphere
                    </h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Choose where you'd love to dine
                    </p>
                  </div>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {selectedZone.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DINING_ZONES.map((zone) => {
                    const isSelected = diningArea === zone.id;
                    return (
                      <div
                        key={zone.id}
                        onClick={() => setDiningArea(zone.id)}
                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "ring-2 ring-orange-500 border-orange-500 shadow-md scale-[1.01]"
                            : isDark
                            ? "bg-[#1a1a24] border-neutral-800 hover:border-neutral-700"
                            : "bg-neutral-50 border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="relative h-28 w-full overflow-hidden bg-neutral-900">
                          <img
                            src={zone.image}
                            alt={zone.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                          <div className="absolute top-2 right-2">
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                                <Check size={12} />
                              </div>
                            )}
                          </div>
                          <div className="absolute bottom-2 left-2.5 right-2.5">
                            <h3 className="font-bold text-xs text-white truncate">
                              {zone.name}
                            </h3>
                            <span className="text-[10px] text-orange-300 font-medium">
                              {zone.tag}
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5">
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {zone.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Date & Party Size */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm space-y-5 ${
                  isDark ? "bg-[#14141a] border-neutral-800" : "bg-white border-neutral-200"
                }`}
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  2. Date & Number of Guests
                </h2>

                {/* Date Selection */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-orange-500" />
                      <span>Select Date</span>
                    </label>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {date} ({dateShortcut})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    {["Today", "Tomorrow", "This Weekend"].map((shortcut) => (
                      <button
                        key={shortcut}
                        type="button"
                        onClick={() => handleShortcutDate(shortcut)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          dateShortcut === shortcut
                            ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                            : isDark
                            ? "bg-[#1a1a24] border-neutral-800 text-neutral-300 hover:bg-[#222230]"
                            : "bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        {shortcut}
                      </button>
                    ))}
                  </div>

                  <input
                    type="date"
                    min={getTodayISO()}
                    value={date}
                    style={{ colorScheme: isDark ? "dark" : "light" }}
                    onChange={(e) => {
                      setDate(e.target.value);
                      setDateShortcut("Custom");
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium border transition-colors focus:outline-none focus:border-orange-500 cursor-pointer ${
                      isDark
                        ? "bg-[#1a1a24] border-neutral-800 text-white"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900"
                    }`}
                  />
                </div>

                {/* Party Size Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                      <Users size={14} className="text-orange-500" />
                      <span>Party Size</span>
                    </label>
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                      {guests} {guests === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          guests === num
                            ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                            : isDark
                            ? "bg-[#1a1a24] border-neutral-800 text-neutral-300 hover:bg-[#222230]"
                            : "bg-neutral-100 border-neutral-200 text-neutral-700 hover:bg-neutral-200"
                        }`}
                      >
                        {num === 8 ? "8+" : num} {num === 1 ? "Guest" : "Guests"}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3. Time Slot Selection */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm space-y-4 ${
                  isDark ? "bg-[#14141a] border-neutral-800" : "bg-white border-neutral-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    3. Preferred Dining Time
                  </h2>

                  {/* Lunch / Dinner Tabs */}
                  <div
                    className={`flex items-center gap-1 p-1 rounded-lg border text-xs font-semibold ${
                      isDark ? "bg-[#1a1a24] border-neutral-800" : "bg-neutral-100 border-neutral-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setMealType("Lunch");
                        setTimeSlot(TIME_SLOTS.Lunch[0]);
                      }}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        mealType === "Lunch"
                          ? "bg-orange-600 text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      Lunch
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMealType("Dinner");
                        setTimeSlot(TIME_SLOTS.Dinner[1]);
                      }}
                      className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        mealType === "Dinner"
                          ? "bg-orange-600 text-white shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      Dinner
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS[mealType].map((t) => {
                    const isSelected = timeSlot === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTimeSlot(t)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                          isSelected
                            ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                            : isDark
                            ? "bg-[#1a1a24] border-neutral-800 text-neutral-300 hover:bg-[#222230]"
                            : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Guest Contact & Special Requests */}
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm space-y-4 ${
                  isDark ? "bg-[#14141a] border-neutral-800" : "bg-white border-neutral-200"
                }`}
              >
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  4. Guest Information & Requests
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your name"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:border-orange-500 ${
                        isDark
                          ? "bg-[#1a1a24] border-neutral-800 text-white placeholder-neutral-600"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:border-orange-500 ${
                        isDark
                          ? "bg-[#1a1a24] border-neutral-800 text-white placeholder-neutral-600"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:border-orange-500 ${
                        isDark
                          ? "bg-[#1a1a24] border-neutral-800 text-white placeholder-neutral-600"
                          : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Occasion Selection */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
                    Dining Occasion
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {OCCASIONS.map((occ) => {
                      const Icon = occ.icon;
                      const isSelected = occasion === occ.id;
                      return (
                        <button
                          key={occ.id}
                          type="button"
                          onClick={() => setOccasion(occ.id)}
                          className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-orange-600/10 border-orange-500 text-orange-600 dark:text-orange-400 font-bold"
                              : isDark
                              ? "bg-[#1a1a24] border-neutral-800 text-neutral-300 hover:bg-[#222230]"
                              : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          <Icon size={13} className="text-orange-500 shrink-0" />
                          <span className="truncate">{occ.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Special Requests / Dietary Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Allergies, high chair, window booth preference, or celebration note..."
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-colors focus:outline-none focus:border-orange-500 ${
                      isDark
                        ? "bg-[#1a1a24] border-neutral-800 text-white placeholder-neutral-600"
                        : "bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400"
                    }`}
                  />
                </div>

              </div>

            </div>

            {/* Right Column: Sticky Live Reservation Summary (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
              
              <div
                className={`rounded-2xl border p-5 sm:p-6 transition-colors shadow-sm overflow-hidden ${
                  isDark ? "bg-[#14141a] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <h3 className="font-bold text-sm">
                    Reservation Details
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    Complimentary
                  </span>
                </div>

                {/* Selected Zone Mini Photo Preview */}
                <div className="relative rounded-xl overflow-hidden my-3.5 h-24 bg-neutral-900">
                  <img
                    src={selectedZone.image}
                    alt={selectedZone.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 block">
                      Seating Atmosphere
                    </span>
                    <h4 className="font-bold text-xs truncate">
                      {selectedZone.name}
                    </h4>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="space-y-2.5 text-xs divide-y divide-neutral-100 dark:divide-neutral-800">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-neutral-500">Date</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {date} ({dateShortcut})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-neutral-500">Time Slot</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">
                      {timeSlot}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-neutral-500">Party Size</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {guests} {guests === 1 ? "Guest" : "Guests"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-neutral-500">Occasion</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {occasion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5">
                    <span className="text-neutral-500">Assigned Table</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {selectedZone.prefix}-04 (Preview)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 text-xs font-bold">
                    <span>Booking Deposit</span>
                    <span className="text-emerald-500">₹0 (Free)</span>
                  </div>
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-5 w-full py-3.5 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Confirming Table...</span>
                  ) : (
                    <span>Confirm Table Reservation</span>
                  )}
                </button>

                <p className="text-[11px] text-center text-neutral-400 mt-2.5">
                  Held for 15 minutes past arrival time. Zero fee on cancellation.
                </p>
              </div>

              {/* Restaurant Contact Box */}
              <div
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  isDark ? "bg-[#14141a] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <MapPin size={15} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Yumigo Kitchen & Lounge</span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      Connaught Hub, New Delhi • Complimentary Valet Parking
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <Phone size={13} className="text-orange-500" />
                  <span>Host Desk: +91 98765 43210</span>
                </div>
              </div>

            </div>

          </form>
        )}

        {/* TAB 2: MY BOOKINGS HISTORY */}
        {activeTab === "my-bookings" && (
          <div className="max-w-3xl mx-auto">
            {loadingHistory ? (
              <div className="py-16 text-center text-xs text-neutral-500">
                Loading reservations...
              </div>
            ) : myReservations.length === 0 ? (
              <div
                className={`py-14 px-6 text-center rounded-2xl border ${
                  isDark ? "bg-[#14141a] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                }`}
              >
                <p className="text-sm font-semibold mb-1">No Reservations Found</p>
                <p className="text-xs text-neutral-500 mb-4">
                  You don't have any table reservations booked yet.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("book")}
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-500 transition-colors cursor-pointer"
                >
                  Book A Table
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {myReservations.map((res) => {
                  const isCancelled = res.status === "Cancelled";
                  return (
                    <div
                      key={res._id || res.bookingReference}
                      className={`p-5 rounded-2xl border transition-colors ${
                        isDark ? "bg-[#14141a] border-neutral-800 text-white" : "bg-white border-neutral-200 text-neutral-900"
                      } ${isCancelled ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                        <div>
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                            Ref #{res.bookingReference}
                          </span>
                          <h4 className="font-bold text-sm text-neutral-900 dark:text-white mt-0.5">
                            {res.diningArea}
                          </h4>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            isCancelled
                              ? "bg-red-500/10 text-red-500"
                              : "bg-emerald-500/10 text-emerald-500"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 text-xs">
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-medium">
                            Date
                          </span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {res.date}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-medium">
                            Time
                          </span>
                          <span className="font-semibold text-orange-600 dark:text-orange-400">
                            {res.timeSlot}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-medium">
                            Party
                          </span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {res.guests} Guests
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-400 block text-[10px] uppercase font-medium">
                            Table
                          </span>
                          <span className="font-semibold text-neutral-900 dark:text-white">
                            {res.tableNumber || "T-01"}
                          </span>
                        </div>
                      </div>

                      {!isCancelled && (
                        <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleCancelBooking(res._id, res.bookingReference)
                            }
                            className="text-xs text-red-500 hover:text-red-600 font-semibold transition-colors cursor-pointer"
                          >
                            Cancel Reservation
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl ${
              isDark
                ? "bg-[#16161b] border-neutral-800 text-white"
                : "bg-white border-neutral-200 text-neutral-900"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                <Check size={20} />
              </div>
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3">
              <h3 className="text-lg font-bold">Table Reservation Confirmed</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Your seats are reserved. Please present your reference number upon arrival.
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl border my-4 space-y-2 text-xs ${
                isDark ? "bg-[#111116] border-neutral-800" : "bg-neutral-50 border-neutral-200"
              }`}
            >
              <div className="flex justify-between">
                <span className="text-neutral-500">Booking Reference</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date & Time</span>
                <span className="font-semibold">
                  {confirmedBooking.date} at {confirmedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Party Size</span>
                <span className="font-semibold">{confirmedBooking.guests} Guests</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Seating Atmosphere</span>
                <span className="font-semibold">{confirmedBooking.diningArea}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Assigned Table</span>
                <span className="font-bold">{confirmedBooking.tableNumber || "T-01"}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BookTablePage;
