import mongoose from "mongoose";

const recoveryDecisionSchema = new mongoose.Schema(
  {
    decisionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    recoveryAttemptId: {
      type: String,
      required: true,
      index: true,
    },
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true, // 0.00 to 1.00
    },
    recoveryWorthwhile: {
      type: Boolean,
      default: true,
    },
    recommendedAction: {
      type: String,
      required: true,
    },
    reasoningSummary: {
      type: String,
      required: true,
    },
    expectedRecovery: {
      type: Number, // in paise
    },
    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
    model: {
      type: String,
      default: "google/gemini-flash-1.5",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const RecoveryDecision = mongoose.model("RecoveryDecision", recoveryDecisionSchema);
