import mongoose from "mongoose";

const paymentLinkSchema = new mongoose.Schema(
  {
    linkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    recoveryAttemptId: {
      type: String,
      index: true,
    },
    razorpayPaymentLinkId: {
      type: String,
      index: true,
    },
    amount: {
      type: Number,
      required: true, // in paise
    },
    status: {
      type: String,
      enum: ["CREATED", "ACTIVE", "PAID", "EXPIRED", "CANCELLED"],
      default: "CREATED",
    },
    shortUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentLink = mongoose.model("PaymentLink", paymentLinkSchema);
