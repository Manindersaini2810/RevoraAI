import mongoose from "mongoose";

const merchantPolicySchema = new mongoose.Schema(
  {
    policyId: {
      type: String,
      required: true,
      unique: true,
      default: "pol_fitprime_001",
    },
    merchantId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "merch_fitprime_001",
    },
    maxAutomatedAttempts: {
      type: Number,
      default: 3,
    },
    maxAutonomousAmount: {
      type: Number,
      default: 50000, // ₹500 in paise
    },
    maxContactsPer24Hours: {
      type: Number,
      default: 2,
    },
    allowPaymentLinks: {
      type: Boolean,
      default: true,
    },
    allowAutomatedRetry: {
      type: Boolean,
      default: true,
    },
    requireApprovalAboveAmount: {
      type: Number,
      default: 100000, // ₹1,000 in paise
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

export const MerchantPolicy = mongoose.model("MerchantPolicy", merchantPolicySchema);
