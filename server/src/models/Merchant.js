import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    merchantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "merch_fitprime_001",
    },
    name: {
      type: String,
      required: true,
      default: "FitPrime Commerce",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayKeyId: {
      type: String,
      default: "rzp_test_fitprime",
    },
    recoveryBudget: {
      type: Number,
      default: 5000000, // in paise (₹50,000)
    },
    maxAutomatedAttempts: {
      type: Number,
      default: 3,
    },
    maxContactsPer24Hours: {
      type: Number,
      default: 2,
    },
    maxAutonomousAmount: {
      type: Number,
      default: 50000, // in paise (₹500)
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Merchant = mongoose.model("Merchant", merchantSchema);
