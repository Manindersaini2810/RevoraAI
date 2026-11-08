import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    logId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    merchantId: {
      type: String,
      index: true,
      default: "merch_fitprime_001",
    },
    transactionId: {
      type: String,
      index: true,
    },
    recoveryAttemptId: {
      type: String,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    actor: {
      type: String,
      enum: ["SYSTEM", "AI_AGENT", "POLICY_GUARDIAN", "RECOVERY_EXECUTOR", "RAZORPAY", "MERCHANT", "SIMULATOR"],
      default: "SYSTEM",
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
