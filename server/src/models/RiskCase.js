import mongoose from "mongoose";

const riskCaseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
      index: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "INVESTIGATING", "RECOVERY_PLANNED", "RECOVERING", "RESOLVED"],
      default: "OPEN",
      index: true,
    },
    riskType: {
      type: String,
      enum: ["PAYMENT_DEGRADATION", "CHECKOUT_ABANDONMENT", "SUBSCRIPTION_FAILURES", "GATEWAY_LATENCY"],
      default: "PAYMENT_DEGRADATION",
      index: true,
    },
    gateway: {
      type: String,
      default: "Razorpay",
    },
    bank: {
      type: String,
    },
    affectedTransactions: {
      type: Number,
      default: 0,
    },
    amountAtRisk: {
      type: Number,
      default: 0, // in paise
    },
    amountRecovered: {
      type: Number,
      default: 0, // in paise
    },
    recoveryRate: {
      type: Number,
      default: 0,
    },
    investigationId: {
      type: String,
    },
    aiDiagnosis: {
      type: String,
    },
    suggestedAction: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const RiskCase = mongoose.model("RiskCase", riskCaseSchema);
