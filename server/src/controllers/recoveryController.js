import { RecoveryAttempt } from "../models/RecoveryAttempt.js";
import { RecoveryDecision } from "../models/RecoveryDecision.js";
import { PolicyDecision } from "../models/PolicyDecision.js";
import { PaymentLink } from "../models/PaymentLink.js";
import { AuditLog } from "../models/AuditLog.js";

export const getRecoveries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== "ALL") {
      query.status = status;
    }

    const recoveries = await RecoveryAttempt.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: recoveries.length, recoveries });
  } catch (err) {
    next(err);
  }
};

export const getRecoveryById = async (req, res, next) => {
  try {
    const recovery = await RecoveryAttempt.findOne({ recoveryId: req.params.id }).lean();
    if (!recovery) {
      return res.status(404).json({ success: false, message: "Recovery attempt not found" });
    }

    const [aiDecision, policyDecision, paymentLink] = await Promise.all([
      RecoveryDecision.findOne({ recoveryAttemptId: recovery.recoveryId }).lean(),
      PolicyDecision.findOne({ recoveryAttemptId: recovery.recoveryId }).lean(),
      PaymentLink.findOne({ recoveryAttemptId: recovery.recoveryId }).lean(),
    ]);

    res.json({
      success: true,
      recovery,
      aiDecision,
      policyDecision,
      paymentLink,
    });
  } catch (err) {
    next(err);
  }
};

export const approveRecovery = async (req, res, next) => {
  try {
    const recovery = await RecoveryAttempt.findOne({ recoveryId: req.params.id });
    if (!recovery) {
      return res.status(404).json({ success: false, message: "Recovery attempt not found" });
    }

    recovery.status = "SUCCESS";
    recovery.amountRecovered = recovery.amountAtRisk;
    recovery.completedAt = new Date();
    await recovery.save();

    await AuditLog.create({
      logId: `log_${Date.now()}`,
      merchantId: recovery.merchantId,
      transactionId: recovery.transactionId,
      recoveryAttemptId: recovery.recoveryId,
      eventType: "HUMAN_APPROVAL_GRANTED",
      actor: "MERCHANT",
      message: `Manual approval granted for recovery ${recovery.recoveryId}. Action executed successfully.`,
    });

    res.json({ success: true, message: "Recovery approved and executed", recovery });
  } catch (err) {
    next(err);
  }
};

export const rejectRecovery = async (req, res, next) => {
  try {
    const recovery = await RecoveryAttempt.findOne({ recoveryId: req.params.id });
    if (!recovery) {
      return res.status(404).json({ success: false, message: "Recovery attempt not found" });
    }

    recovery.status = "STOPPED";
    await recovery.save();

    await AuditLog.create({
      logId: `log_${Date.now()}`,
      merchantId: recovery.merchantId,
      transactionId: recovery.transactionId,
      recoveryAttemptId: recovery.recoveryId,
      eventType: "HUMAN_APPROVAL_REJECTED",
      actor: "MERCHANT",
      message: `Manual rejection for recovery ${recovery.recoveryId}. Operation terminated safely.`,
    });

    res.json({ success: true, message: "Recovery rejected and terminated", recovery });
  } catch (err) {
    next(err);
  }
};
