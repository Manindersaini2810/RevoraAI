import { Transaction } from "../models/Transaction.js";
import { RecoveryAttempt } from "../models/RecoveryAttempt.js";

export const getDashboardMetrics = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().lean();
    const recoveries = await RecoveryAttempt.find().lean();

    const totalFailedAmount = transactions
      .filter((t) => ["FAILED", "RECOVERING", "RECOVERED"].includes(t.status))
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalRecoveredAmount = recoveries
      .filter((r) => r.status === "SUCCESS")
      .reduce((sum, r) => sum + (r.amountRecovered || 0), 0);

    const activeRecoveries = recoveries.filter((r) =>
      ["PROPOSED", "ANALYZING", "POLICY_CHECKING", "READY_TO_EXECUTE", "EXECUTING", "WAITING_FOR_CUSTOMER", "PENDING_APPROVAL"].includes(
        r.status
      )
    ).length;

    const blockedAttempts = recoveries.filter((r) => r.status === "POLICY_BLOCKED").length;
    const humanEscalations = recoveries.filter((r) =>
      ["ESCALATED", "POLICY_BLOCKED", "PENDING_APPROVAL"].includes(r.status)
    ).length;

    const recoveryRate =
      totalFailedAmount > 0
        ? Math.round((totalRecoveredAmount / totalFailedAmount) * 100)
        : 0;

    res.json({
      success: true,
      stats: {
        totalRevenueAtRisk: totalFailedAmount,
        totalRevenueRecovered: totalRecoveredAmount,
        recoveryRate,
        activeRecoveriesCount: activeRecoveries,
        blockedAttemptsCount: blockedAttempts,
        humanEscalationsCount: humanEscalations,
        totalTransactionsCount: transactions.length,
      },
    });
  } catch (err) {
    next(err);
  }
};
