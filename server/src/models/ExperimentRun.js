import mongoose from "mongoose";

const experimentRunSchema = new mongoose.Schema(
  {
    experimentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    seed: {
      type: Number,
      required: true,
    },
    sampleSize: {
      type: Number,
      default: 1000,
    },
    status: {
      type: String,
      enum: ["RUNNING", "COMPLETED", "FAILED"],
      default: "COMPLETED",
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    totalRevenueAtRisk: {
      type: Number,
      required: true,
    },
    baselineRevenueRecovered: {
      type: Number,
      required: true,
    },
    recoverOSRevenueRecovered: {
      type: Number,
      required: true,
    },
    incrementalRevenue: {
      type: Number,
      required: true,
    },
    baselineRecoveryRate: {
      type: Number,
      required: true,
    },
    recoverOSRecoveryRate: {
      type: Number,
      required: true,
    },
    incrementalRecoveryRate: {
      type: Number,
      required: true,
    },
    baselineAttempts: {
      type: Number,
      required: true,
    },
    recoverOSAttempts: {
      type: Number,
      required: true,
    },
    policyBlocks: {
      type: Number,
      default: 0,
    },
    humanEscalations: {
      type: Number,
      default: 0,
    },
    stoppedRecoveries: {
      type: Number,
      default: 0,
    },
    cases: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ExperimentRun = mongoose.model("ExperimentRun", experimentRunSchema);
