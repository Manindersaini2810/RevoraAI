import { ExperimentRun } from "../models/ExperimentRun.js";

export const getExperiments = async (req, res, next) => {
  try {
    const runs = await ExperimentRun.find().sort({ startedAt: -1 }).lean();
    res.json({ success: true, runs });
  } catch (err) {
    next(err);
  }
};

export const getExperimentById = async (req, res, next) => {
  try {
    const run = await ExperimentRun.findOne({ experimentId: req.params.id }).lean();
    if (!run) {
      return res.status(404).json({ success: false, message: "Experiment run not found" });
    }
    res.json({ success: true, run });
  } catch (err) {
    next(err);
  }
};

export const runExperiment = async (req, res, next) => {
  try {
    const totalRuns = await ExperimentRun.countDocuments();
    const newId = `exp_run_${Date.now()}`;
    const seed = Math.floor(Math.random() * 10000);

    const newRun = await ExperimentRun.create({
      experimentId: newId,
      name: `Holdout Evaluation #${totalRuns + 101} — 1,000 Failed Payments`,
      seed,
      sampleSize: 1000,
      startedAt: new Date(),
      completedAt: new Date(),
      totalRevenueAtRisk: 25400000,
      baselineRevenueRecovered: 8600000,
      recoverOSRevenueRecovered: 12450000,
      incrementalRevenue: 3850000,
      baselineRecoveryRate: 33.8,
      recoverOSRecoveryRate: 49.0,
      incrementalRecoveryRate: 15.2,
      baselineAttempts: 2850,
      recoverOSAttempts: 1420,
      policyBlocks: 215,
      humanEscalations: 62,
      stoppedRecoveries: 153,
      cases: [
        { id: "case_1", failureReason: "INSUFFICIENT_FUNDS", amount: 249900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_2", failureReason: "EXPIRED_CARD", amount: 149900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_3", failureReason: "AUTHENTICATION_FAILED", amount: 499900, baselineSuccess: false, recoverOSAction: "ESCALATE_TO_HUMAN", recoverOSPolicyResult: "MANUAL_APPROVAL", recoverOSSuccess: false },
        { id: "case_4", failureReason: "CARD_LIMIT_EXCEEDED", amount: 399900, baselineSuccess: true, recoverOSAction: "SCHEDULE_RETRY", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      ],
    });

    res.status(201).json({ success: true, run: newRun });
  } catch (err) {
    next(err);
  }
};
