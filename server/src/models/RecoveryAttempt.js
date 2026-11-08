import mongoose from "mongoose";

const recoveryAttemptSchema = new mongoose.Schema(
  {
    recoveryId: {
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
    transactionId: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "RETRY_PAYMENT",
        "CREATE_PAYMENT_LINK",
        "SEND_PAYMENT_LINK",
        "SCHEDULE_RETRY",
        "SEND_RECOVERY_MESSAGE",
        "IMMEDIATE_RETRY",
        "ESCALATE_TO_HUMAN",
        "STOP_RECOVERY",
        "STOP_INTERVENTION",
      ],
    },
    attemptNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: [
        "PROPOSED",
        "ANALYZING",
        "ANALYSIS_COMPLETE",
        "POLICY_CHECKING",
        "POLICY_APPROVED",
        "PENDING_APPROVAL",
        "POLICY_BLOCKED",
        "READY_TO_EXECUTE",
        "EXECUTING",
        "EXECUTED",
        "WAITING_FOR_CUSTOMER",
        "SUCCESS",
        "FAILED",
        "STOPPED",
        "ESCALATED",
      ],
      default: "PROPOSED",
      index: true,
    },
    reasoning: {
      type: String,
    },
    amountAtRisk: {
      type: Number,
      required: true, // in paise
    },
    expectedRecovery: {
      type: Number,
    },
    amountRecovered: {
      type: Number,
      default: 0,
    },
    executedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

recoveryAttemptSchema.index({ transactionId: 1, attemptNumber: 1 });

export const RecoveryAttempt = mongoose.model("RecoveryAttempt", recoveryAttemptSchema);
