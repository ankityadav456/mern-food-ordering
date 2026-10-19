// models/Reservation.js
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    fullName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Reservation date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: 1,
      max: 30,
      default: 2,
    },
    diningArea: {
      type: String,
      enum: [
        "Rooftop Sky Lounge",
        "Royal Heritage Lounge",
        "Candlelight Couple Booth",
        "Main Culinary Hall",
        "VIP Private Dining Suite",
      ],
      default: "Main Culinary Hall",
    },
    occasion: {
      type: String,
      enum: [
        "Casual Dining",
        "Birthday Celebration",
        "Anniversary",
        "Romantic Date",
        "Family Gathering",
        "Business Dinner",
        "Other",
      ],
      default: "Casual Dining",
    },
    tableNumber: {
      type: String,
      default: "T-01",
    },
    specialRequests: {
      type: String,
      default: "",
    },
    dietaryPreferences: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["Confirmed", "Pending", "Cancelled", "Completed"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;
