import mongoose from "mongoose";

const policyDecisionSchema = new mongoose.Schema(
  {
    policyDecisionId: {
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
    allowed: {
      type: Boolean,
      required: true,
    },
    policyName: {
      type: String,
      default: "DEFAULT_GUARDIAN_POLICY",
    },
    reason: {
      type: String,
    },
    requiresHumanApproval: {
      type: Boolean,
      default: false,
    },
    blockedRules: {
      type: [String],
      default: [],
    },
    policyVersion: {
      type: String,
      default: "1.0",
    },
  },
  {
    timestamps: true,
  }
);

export const PolicyDecision = mongoose.model("PolicyDecision", policyDecisionSchema);
