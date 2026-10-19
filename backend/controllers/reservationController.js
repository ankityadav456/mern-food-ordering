// controllers/reservationController.js
import Reservation from "../models/Reservation.js";

// Helper to generate reference ID
const generateRef = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "YMG-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Helper to assign a table number based on dining area
const assignTableNumber = (diningArea, guests) => {
  const prefixes = {
    "Rooftop Sky Lounge": "RT-",
    "Royal Heritage Lounge": "RH-",
    "Candlelight Couple Booth": "CB-",
    "Main Culinary Hall": "TH-",
    "VIP Private Dining Suite": "VIP-",
  };
  const prefix = prefixes[diningArea] || "T-";
  const num = Math.floor(Math.random() * 15) + 1;
  return `${prefix}${num < 10 ? "0" + num : num}`;
};

// 1. Create a table reservation
export const createReservation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      date,
      timeSlot,
      guests,
      diningArea,
      occasion,
      specialRequests,
      dietaryPreferences,
    } = req.body;

    if (!fullName || !email || !phone || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: name, email, phone, date, and time slot.",
      });
    }

    // Generate unique reference
    let bookingReference = generateRef();
    let exists = await Reservation.findOne({ bookingReference });
    while (exists) {
      bookingReference = generateRef();
      exists = await Reservation.findOne({ bookingReference });
    }

    const tableNumber = assignTableNumber(diningArea, guests);

    const reservation = new Reservation({
      bookingReference,
      user: req.user?._id || null,
      fullName,
      email,
      phone,
      date,
      timeSlot,
      guests: Number(guests) || 2,
      diningArea: diningArea || "Main Culinary Hall",
      occasion: occasion || "Casual Dining",
      tableNumber,
      specialRequests: specialRequests || "",
      dietaryPreferences: Array.isArray(dietaryPreferences) ? dietaryPreferences : [],
      status: "Confirmed",
    });

    const savedReservation = await reservation.save();

    res.status(201).json({
      success: true,
      message: "Table booked successfully! Confirmation pass generated.",
      reservation: savedReservation,
    });
  } catch (error) {
    console.error("Create reservation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to book table. Please try again.",
    });
  }
};

// 2. Get reservations for logged-in user or email
export const getMyReservations = async (req, res) => {
  try {
    const query = {};
    if (req.user?._id) {
      query.$or = [{ user: req.user._id }, { email: req.user.email }];
    } else if (req.query.email) {
      query.email = req.query.email.toLowerCase();
    } else {
      return res.status(200).json({
        success: true,
        reservations: [],
      });
    }

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error("Get my reservations error:", error);
    res.status(500).json({
      success: false,
      message: "Could not fetch reservations.",
    });
  }
};

// 3. Get single reservation by reference or id
export const getReservationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let reservation;
    if (id.startsWith("YMG-")) {
      reservation = await Reservation.findOne({ bookingReference: id });
    } else {
      reservation = await Reservation.findById(id);
    }

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    res.status(200).json({
      success: true,
      reservation,
    });
  } catch (error) {
    console.error("Get reservation details error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reservation.",
    });
  }
};

// 4. Cancel a reservation
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found.",
      });
    }

    // If user is attached, verify ownership unless admin
    if (
      req.user &&
      req.user.role !== "admin" &&
      reservation.user &&
      reservation.user.toString() !== req.user._id.toString() &&
      reservation.email !== req.user.email
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this booking.",
      });
    }

    reservation.status = "Cancelled";
    await reservation.save();

    res.status(200).json({
      success: true,
      message: "Table reservation cancelled successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);
    res.status(500).json({
      success: false,
      message: "Error cancelling reservation.",
    });
  }
};

// 5. Admin: Get all reservations
export const getAllReservations = async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;

    const reservations = await Reservation.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Get all reservations error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reservations.",
    });
  }
};
