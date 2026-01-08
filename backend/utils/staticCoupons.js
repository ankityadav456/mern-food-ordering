// utils/staticCoupons.js

export const staticCoupons = [
  {
    code: "ANKIT100",
    discountType: "fixed",          // fixed | percentage
    discountValue: 100,             // ₹100 OFF
    minOrderValue: 500,             // Minimum cart value
    maxDiscount: null,              // not needed for fixed
    expiryDate: new Date("2026-12-31"),
    isActive: true,
    description: "Flat ₹100 off on orders above ₹500",
  },
  {
    code: "YUMIGO50",
    discountType: "fixed",
    discountValue: 50,
    minOrderValue: 200,
    maxDiscount: null,
    expiryDate: new Date("2025-12-31"),
    isActive: true,
    description: "Flat ₹50 off on orders above ₹200",
  },

  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,              // 10% OFF
    minOrderValue: 300,
    maxDiscount: 120,               // safety cap
    expiryDate: new Date("2026-06-30"),
    isActive: true,
    description: "10% off up to ₹120 for new users",
  },

  {
    code: "BIGORDER20",
    discountType: "percentage",
    discountValue: 20,              // 20% OFF
    minOrderValue: 1000,
    maxDiscount: 300,
    expiryDate: new Date("2026-12-31"),
    isActive: true,
    description: "20% off on orders above ₹1000",
  },
];
