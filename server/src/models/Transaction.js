import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
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
    customerId: {
      type: String,
      required: true,
      index: true,
    },
    externalTransactionId: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
      required: true, // in paise
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "RECOVERING", "RECOVERED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "CARD", "NETBANKING", "WALLET", "card", "upi", "netbanking", "wallet"],
      default: "UPI",
    },
    failureReason: {
      type: String,
      enum: [
        "INSUFFICIENT_FUNDS",
        "CARD_EXPIRED",
        "EXPIRED_CARD",
        "BANK_ERROR",
        "NETWORK_ERROR",
        "AUTHENTICATION_FAILED",
        "PAYMENT_TIMEOUT",
        "DO_NOT_HONOR",
        "CARD_LIMIT_EXCEEDED",
        "INVALID_CARD_DETAILS",
        "UNKNOWN",
      ],
      default: "UNKNOWN",
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
    recoveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.index({ merchantId: 1, createdAt: -1 });

export const Transaction = mongoose.model("Transaction", transactionSchema);
