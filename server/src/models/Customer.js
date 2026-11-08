import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    merchantId: {
      type: String,
      required: true,
      index: true,
      default: "merch_fitprime_001",
    },
    externalCustomerId: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    lifetimeValue: {
      type: Number,
      default: 0, // in paise
    },
    totalPayments: {
      type: Number,
      default: 0,
    },
    successfulPayments: {
      type: Number,
      default: 0,
    },
    failedPayments: {
      type: Number,
      default: 0,
    },
    averageOrderValue: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ merchantId: 1, email: 1 });

export const Customer = mongoose.model("Customer", customerSchema);
