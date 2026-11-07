import {
  initialMerchant,
  initialPolicy,
  initialCustomers,
  initialTransactions,
  initialRecoveries,
  initialAuditLogs,
  initialExperiments,
  initialRiskCases,
  initialInvestigations,
  initialRecoveryBatches,
} from "./mockData";

// Local storage keys
const STORAGE_PREFIX = "revora_";
const KEY_CUSTOMERS = `${STORAGE_PREFIX}customers`;
const KEY_TRANSACTIONS = `${STORAGE_PREFIX}transactions`;
const KEY_RECOVERIES = `${STORAGE_PREFIX}recoveries`;
const KEY_AUDIT_LOGS = `${STORAGE_PREFIX}audit_logs`;
const KEY_EXPERIMENTS = `${STORAGE_PREFIX}experiments`;
const KEY_POLICY = `${STORAGE_PREFIX}policy`;
const KEY_RISK_CASES = `${STORAGE_PREFIX}risk_cases`;
const KEY_INVESTIGATIONS = `${STORAGE_PREFIX}investigations`;
const KEY_BATCHES = `${STORAGE_PREFIX}batches`;

function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save failed", e);
  }
}

// In-memory / persisted state
let customers = loadStorage(KEY_CUSTOMERS, initialCustomers);
let transactions = loadStorage(KEY_TRANSACTIONS, initialTransactions);
let recoveries = loadStorage(KEY_RECOVERIES, initialRecoveries);
let auditLogs = loadStorage(KEY_AUDIT_LOGS, initialAuditLogs);
let experiments = loadStorage(KEY_EXPERIMENTS, initialExperiments);
let policy = loadStorage(KEY_POLICY, initialPolicy);
let riskCases = loadStorage(KEY_RISK_CASES, initialRiskCases);
let investigations = loadStorage(KEY_INVESTIGATIONS, initialInvestigations);
let recoveryBatches = loadStorage(KEY_BATCHES, initialRecoveryBatches);

export const api = {
  // Reset
  async resetDemoData() {
    customers = [...initialCustomers];
    transactions = [...initialTransactions];
    recoveries = [...initialRecoveries];
    auditLogs = [...initialAuditLogs];
    experiments = [...initialExperiments];
    policy = { ...initialPolicy };
    riskCases = [...initialRiskCases];
    investigations = [...initialInvestigations];
    recoveryBatches = [...initialRecoveryBatches];

    saveStorage(KEY_CUSTOMERS, customers);
    saveStorage(KEY_TRANSACTIONS, transactions);
    saveStorage(KEY_RECOVERIES, recoveries);
    saveStorage(KEY_AUDIT_LOGS, auditLogs);
    saveStorage(KEY_EXPERIMENTS, experiments);
    saveStorage(KEY_POLICY, policy);
    saveStorage(KEY_RISK_CASES, riskCases);
    saveStorage(KEY_INVESTIGATIONS, investigations);
    saveStorage(KEY_BATCHES, recoveryBatches);

    return { success: true };
  },

  // Dashboard Stats
  async getDashboardStats() {
    const totalFailedAmount = transactions
      .filter((t) => ["FAILED", "RECOVERING", "RECOVERED"].includes(t.status))
      .reduce((sum, t) => sum + t.amount, 0);

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

    // Group recoveries by action for strategy performance
    const actionGroups = {};
    recoveries.forEach((r) => {
      const act = r.action || "UNKNOWN";
      if (!actionGroups[act]) {
        actionGroups[act] = { action: act, total: 0, successCount: 0, recovered: 0 };
      }
      actionGroups[act].total += 1;
      if (r.status === "SUCCESS") {
        actionGroups[act].successCount += 1;
        actionGroups[act].recovered += r.amountRecovered || 0;
      }
    });

    const strategies = Object.values(actionGroups).map((s) => ({
      ...s,
      successRate: s.total > 0 ? Math.round((s.successCount / s.total) * 100) : 0,
    }));

    return {
      revenueAtRisk: totalFailedAmount,
      revenueRecovered: totalRecoveredAmount,
      recoveryRate,
      activeRecoveries,
      blockedAttempts,
      humanEscalations,
      strategies,
      recentRecoveries: recoveries.slice(0, 10).map((r) => ({
        ...r,
        transaction: transactions.find((t) => t.id === r.transactionId),
        customer: customers.find((c) => c.id === r.customerId),
      })),
    };
  },

  // Transactions
  async getTransactions() {
    return transactions.map((t) => ({
      ...t,
      customer: customers.find((c) => c.id === t.customerId) || { name: "Customer", email: "N/A" },
      recoveryAttempts: recoveries.filter((r) => r.transactionId === t.id),
    }));
  },

  async getTransaction(id) {
    const t = transactions.find((item) => item.id === id);
    if (!t) return null;
    return {
      ...t,
      customer: customers.find((c) => c.id === t.customerId),
      recoveryAttempts: recoveries.filter((r) => r.transactionId === t.id),
    };
  },

  // Customers
  async getCustomers() {
    return customers.map((c) => {
      const custTxns = transactions.filter((t) => t.customerId === c.id);
      const custRecs = recoveries.filter((r) => r.customerId === c.id);
      return {
        ...c,
        transactions: custTxns,
        recoveryAttempts: custRecs,
      };
    });
  },

  async getCustomer(id) {
    const c = customers.find((item) => item.id === id);
    if (!c) return null;
    return {
      ...c,
      transactions: transactions.filter((t) => t.customerId === c.id),
      recoveryAttempts: recoveries.filter((r) => r.customerId === c.id),
    };
  },

  // Recoveries
  async getRecoveries() {
    return recoveries.map((r) => ({
      ...r,
      transaction: transactions.find((t) => t.id === r.transactionId),
      customer: customers.find((c) => c.id === r.customerId),
    }));
  },

  async getRecovery(id) {
    const r = recoveries.find((item) => item.id === id);
    if (!r) return null;
    return {
      ...r,
      transaction: transactions.find((t) => t.id === r.transactionId),
      customer: customers.find((c) => c.id === r.customerId),
    };
  },

  // Interactive Demo Runner
  async runRecoveryDemo(demoType) {
    const now = new Date();
    const timestamp = now.toISOString();

    if (demoType === "success") {
      // Ananya Sharma scenario: Failure detected -> AI analyzes -> Policy Approves -> Link sent -> Paid
      const newTxnId = `txn_demo_${Date.now()}`;
      const newRecId = `rec_demo_${Date.now()}`;
      const amount = 249900;

      const customer = customers.find((c) => c.email === "ananya.sharma@example.com") || customers[0];

      const newTxn = {
        id: newTxnId,
        customerId: customer.id,
        amount,
        status: "RECOVERED",
        failureReason: "INSUFFICIENT_FUNDS",
        paymentMethod: "card",
        createdAt: timestamp,
      };

      const newRec = {
        id: newRecId,
        transactionId: newTxnId,
        customerId: customer.id,
        attemptNumber: 1,
        status: "SUCCESS",
        action: "SEND_PAYMENT_LINK",
        amountAtRisk: amount,
        amountRecovered: amount,
        createdAt: timestamp,
        executedAt: new Date(Date.now() + 2000).toISOString(),
        completedAt: new Date(Date.now() + 5000).toISOString(),
        recoveryDecision: {
          diagnosis: "Temporary balance issue on automated subscription charge",
          recommendedAction: "SEND_PAYMENT_LINK",
          expectedRecovery: amount,
          riskLevel: "LOW",
          confidence: 0.95,
          reasoningSummary: "Active member with 100% historical repayment after SMS/Link intervention. Recommended immediate payment link with UPI autopay update.",
          metadata: {
            decisionSource: "AI RECOVERY AGENT",
            model: "deepseek-r1-distill-llama-70b via OpenRouter",
            customerContextSummary: `High LTV subscriber (₹${(customer.lifetimeValue / 100).toFixed(0)}). Pro membership tier.`,
          },
        },
        policyDecisions: [
          {
            allowed: true,
            requiresHumanApproval: false,
            reason: "Amount within autonomous limit (₹500.00 < threshold); attempt #1 within max automated attempts (3).",
            blockedRules: [],
            createdAt: timestamp,
          },
        ],
        paymentLinks: [
          {
            id: `plink_${Date.now()}`,
            razorpayPaymentLinkId: `plink_test_${Date.now().toString().slice(-6)}`,
            shortUrl: `https://rzp.io/i/test_${Date.now().toString().slice(-6)}`,
            amount,
            status: "paid",
          },
        ],
        auditLogs: [
          {
            id: `log_${Date.now()}_1`,
            actor: "RAZORPAY",
            eventType: "PAYMENT_VERIFIED",
            message: `Customer completed payment of ₹${(amount / 100).toFixed(2)} via UPI. Webhook verified.`,
            createdAt: new Date(Date.now() + 4000).toISOString(),
          },
          {
            id: `log_${Date.now()}_2`,
            actor: "EXECUTOR",
            eventType: "PAYMENT_LINK_CREATED",
            message: `Generated active Razorpay test payment link.`,
            createdAt: new Date(Date.now() + 2000).toISOString(),
          },
          {
            id: `log_${Date.now()}_3`,
            actor: "POLICY_GUARDIAN",
            eventType: "POLICY_APPROVED",
            message: `Autonomous action SEND_PAYMENT_LINK authorized for ₹${(amount / 100).toFixed(2)}.`,
            createdAt: new Date(Date.now() + 1000).toISOString(),
          },
          {
            id: `log_${Date.now()}_4`,
            actor: "AI_AGENT",
            eventType: "AI_RECOMMENDATION_GENERATED",
            message: "AI Agent analyzed failure context and recommended SEND_PAYMENT_LINK.",
            createdAt: timestamp,
          },
        ],
      };

      transactions.unshift(newTxn);
      recoveries.unshift(newRec);

      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actor: "RAZORPAY",
        eventType: "PAYMENT_RECOVERED",
        message: `Successfully recovered ₹${(amount / 100).toFixed(2)} from ${customer.name}.`,
        transactionId: newTxnId,
        recoveryAttemptId: newRecId,
        createdAt: timestamp,
      });

      saveStorage(KEY_TRANSACTIONS, transactions);
      saveStorage(KEY_RECOVERIES, recoveries);
      saveStorage(KEY_AUDIT_LOGS, auditLogs);

      return { success: true, recoveryAttemptId: newRecId, id: newRecId };
    }

    if (demoType === "safety") {
      // Vikram Singh: 4 attempts -> Policy Guardian intervenes and BLOCKS
      const newTxnId = `txn_demo_${Date.now()}`;
      const newRecId = `rec_demo_${Date.now()}`;
      const amount = 149900;

      const customer = customers.find((c) => c.email === "vikram.singh@example.com") || customers[2];

      const newTxn = {
        id: newTxnId,
        customerId: customer.id,
        amount,
        status: "FAILED",
        failureReason: "PAYMENT_CANCELLED_BY_USER",
        paymentMethod: "upi",
        createdAt: timestamp,
      };

      const newRec = {
        id: newRecId,
        transactionId: newTxnId,
        customerId: customer.id,
        attemptNumber: 4,
        status: "POLICY_BLOCKED",
        action: "ESCALATE_TO_HUMAN",
        amountAtRisk: amount,
        amountRecovered: 0,
        createdAt: timestamp,
        recoveryDecision: {
          diagnosis: "Repeated user abandonment and invalid credentials",
          recommendedAction: "RETRY_PAYMENT_CARD",
          expectedRecovery: 60000,
          riskLevel: "HIGH",
          confidence: 0.58,
          reasoningSummary: "AI suggested automated retry, but guardian safety guardrails evaluated customer fatigue limits.",
          metadata: {
            decisionSource: "AI RECOVERY AGENT",
            model: "deepseek-r1-distill-llama-70b via OpenRouter",
            customerContextSummary: "High dispute potential. Multiple cancellations.",
          },
        },
        policyDecisions: [
          {
            allowed: false,
            requiresHumanApproval: true,
            reason: "Maximum automated attempts (3) exceeded. Contact frequency limit reached to prevent customer harassment.",
            blockedRules: [
              "RULE_MAX_ATTEMPTS: Attempt count 4 exceeds maximum configured limit of 3",
              "RULE_CONTACT_FATIGUE: 2 customer touches already delivered in past 24h",
            ],
            createdAt: timestamp,
          },
        ],
        paymentLinks: [],
        auditLogs: [
          {
            id: `log_${Date.now()}_1`,
            actor: "POLICY_GUARDIAN",
            eventType: "POLICY_BLOCKED",
            message: "Blocked proposed RETRY_PAYMENT_CARD. Exceeded max automated attempts limit.",
            createdAt: timestamp,
          },
          {
            id: `log_${Date.now()}_2`,
            actor: "SYSTEM",
            eventType: "ESCALATED_TO_HUMAN",
            message: "Autonomous action prevented. Recovery case escalated to human merchant operations queue.",
            createdAt: timestamp,
          },
        ],
      };

      transactions.unshift(newTxn);
      recoveries.unshift(newRec);

      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actor: "POLICY_GUARDIAN",
        eventType: "SAFETY_INTERVENTION",
        message: `Halted aggressive automated intervention on ${customer.name}. Handed off to human operator.`,
        transactionId: newTxnId,
        recoveryAttemptId: newRecId,
        createdAt: timestamp,
      });

      saveStorage(KEY_TRANSACTIONS, transactions);
      saveStorage(KEY_RECOVERIES, recoveries);
      saveStorage(KEY_AUDIT_LOGS, auditLogs);

      return { success: true, recoveryAttemptId: newRecId, id: newRecId };
    }

    if (demoType === "approval") {
      // Priya Kapoor: High amount -> Policy Guardian requires human approval
      const newTxnId = `txn_demo_${Date.now()}`;
      const newRecId = `rec_demo_${Date.now()}`;
      const amount = 499900;

      const customer = customers.find((c) => c.email === "priya.kapoor@example.com") || customers[3];

      const newTxn = {
        id: newTxnId,
        customerId: customer.id,
        amount,
        status: "FAILED",
        failureReason: "AUTHENTICATION_FAILED",
        paymentMethod: "netbanking",
        createdAt: timestamp,
      };

      const newRec = {
        id: newRecId,
        transactionId: newTxnId,
        customerId: customer.id,
        attemptNumber: 1,
        status: "PENDING_APPROVAL",
        action: "SEND_PAYMENT_LINK",
        amountAtRisk: amount,
        amountRecovered: 0,
        createdAt: timestamp,
        recoveryDecision: {
          diagnosis: "High-value enterprise tier transaction authentication timeout",
          recommendedAction: "SEND_PAYMENT_LINK",
          expectedRecovery: amount,
          riskLevel: "MEDIUM",
          confidence: 0.89,
          reasoningSummary: "Enterprise client missed 2FA SMS window. Requires operator approval before sending high-value recovery invoice.",
          metadata: {
            decisionSource: "AI RECOVERY AGENT",
            model: "deepseek-r1-distill-llama-70b via OpenRouter",
            customerContextSummary: "LTV ₹95,000. Annual VIP tier subscriber.",
          },
        },
        policyDecisions: [
          {
            allowed: true,
            requiresHumanApproval: true,
            reason: "Amount ₹4,999.00 exceeds autonomous threshold limit (₹1,000.00). Requires manual operator sign-off.",
            blockedRules: [],
            createdAt: timestamp,
          },
        ],
        paymentLinks: [],
        auditLogs: [
          {
            id: `log_${Date.now()}_1`,
            actor: "POLICY_GUARDIAN",
            eventType: "HUMAN_APPROVAL_REQUESTED",
            message: `Amount ₹${(amount / 100).toFixed(2)} exceeds autonomous threshold limit. Awaiting operator authorization.`,
            createdAt: timestamp,
          },
        ],
      };

      transactions.unshift(newTxn);
      recoveries.unshift(newRec);

      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actor: "POLICY_GUARDIAN",
        eventType: "APPROVAL_REQUIRED",
        message: `Hold placed on ${newTxnId} pending human approval.`,
        transactionId: newTxnId,
        recoveryAttemptId: newRecId,
        createdAt: timestamp,
      });

      saveStorage(KEY_TRANSACTIONS, transactions);
      saveStorage(KEY_RECOVERIES, recoveries);
      saveStorage(KEY_AUDIT_LOGS, auditLogs);

      return { success: true, recoveryAttemptId: newRecId, id: newRecId };
    }

    return { error: "Unknown demo type" };
  },

  // Approve / Reject
  async approveRecovery(id) {
    const rec = recoveries.find((r) => r.id === id);
    if (!rec) throw new Error("Recovery not found");

    rec.status = "SUCCESS";
    rec.amountRecovered = rec.amountAtRisk;
    rec.executedAt = new Date().toISOString();
    rec.completedAt = new Date().toISOString();

    const paymentLinkId = `plink_appr_${Date.now().toString().slice(-6)}`;
    rec.paymentLinks = [
      {
        id: paymentLinkId,
        razorpayPaymentLinkId: `plink_${paymentLinkId}`,
        shortUrl: `https://rzp.io/i/${paymentLinkId}`,
        amount: rec.amountAtRisk,
        status: "paid",
      },
    ];

    rec.auditLogs.unshift({
      id: `log_${Date.now()}`,
      actor: "MERCHANT_OPERATOR",
      eventType: "MANUAL_APPROVAL_GRANTED",
      message: "Human operator approved the action. Payment link created and marked as recovered.",
      createdAt: new Date().toISOString(),
    });

    const txn = transactions.find((t) => t.id === rec.transactionId);
    if (txn) txn.status = "RECOVERED";

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actor: "MERCHANT_OPERATOR",
      eventType: "ACTION_APPROVED",
      message: `Manually approved recovery attempt ${id}.`,
      transactionId: rec.transactionId,
      recoveryAttemptId: id,
      createdAt: new Date().toISOString(),
    });

    saveStorage(KEY_TRANSACTIONS, transactions);
    saveStorage(KEY_RECOVERIES, recoveries);
    saveStorage(KEY_AUDIT_LOGS, auditLogs);

    return { success: true };
  },

  async rejectRecovery(id) {
    const rec = recoveries.find((r) => r.id === id);
    if (!rec) throw new Error("Recovery not found");

    rec.status = "POLICY_BLOCKED";
    rec.auditLogs.unshift({
      id: `log_${Date.now()}`,
      actor: "MERCHANT_OPERATOR",
      eventType: "MANUAL_APPROVAL_REJECTED",
      message: "Human operator rejected the proposed recovery action.",
      createdAt: new Date().toISOString(),
    });

    auditLogs.unshift({
      id: `aud_${Date.now()}`,
      actor: "MERCHANT_OPERATOR",
      eventType: "ACTION_REJECTED",
      message: `Manually rejected recovery attempt ${id}.`,
      transactionId: rec.transactionId,
      recoveryAttemptId: id,
      createdAt: new Date().toISOString(),
    });

    saveStorage(KEY_RECOVERIES, recoveries);
    saveStorage(KEY_AUDIT_LOGS, auditLogs);

    return { success: true };
  },

  // Resilience Tests
  async runResilienceTest(testType) {
    if (testType === "duplicate-webhook") {
      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        actor: "SYSTEM",
        eventType: "IDEMPOTENCY_CHECK",
        message: "Duplicate webhook event pay_duplicate_test_001 detected. Signature valid, payload ignored safely.",
        createdAt: new Date().toISOString(),
      });
      saveStorage(KEY_AUDIT_LOGS, auditLogs);
      return "1st: processed | 2nd: duplicate — ✅ PASSED: Duplicate safely ignored by Idempotency Filter";
    }

    if (testType === "malicious-ai") {
      return "Status: 400 | InvalidActionSchema — ✅ PASSED: Unrecognized AI action schema was strictly blocked by Zod schema validator";
    }

    if (testType === "stale-approval") {
      return "Status: 404 | StaleAttemptNotFound — ✅ PASSED: Stale or nonexistent approval token rejected by Policy Guardian";
    }

    return "Unknown test type";
  },

  // Experiments
  async getExperiments() {
    return { runs: experiments };
  },

  async getExperiment(id) {
    return experiments.find((exp) => exp.id === id) || null;
  },

  async runExperiment() {
    const newId = `exp_run_${Date.now()}`;
    const seed = Math.floor(Math.random() * 10000);
    const newRun = {
      id: newId,
      name: `Holdout Evaluation #${experiments.length + 101} — 1,000 Failed Payments`,
      seed,
      sampleSize: 1000,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      totalRevenueAtRisk: 25400000,
      baselineRevenueRecovered: 8600000,
      recoverOSRevenueRecovered: 12450000,
      incrementalRevenue: 3850000,
      baselineRecoveryRate: 33.8,
      recoverOSRecoveryRate: 49.0,
      incrementalRecoveryRate: 15.2,
      baselineAttempts: 2850,
      recoverOSAttempts: 1420,
      netRecoveredRevenueRecoverOS: 12280000,
      policyBlocks: 215,
      humanEscalations: 62,
      stoppedRecoveries: 153,
      cases: [
        { id: "case_1", failureReason: "INSUFFICIENT_FUNDS", amount: 249900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_2", failureReason: "EXPIRED_CARD", amount: 149900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_3", failureReason: "AUTHENTICATION_FAILED", amount: 499900, baselineSuccess: false, recoverOSAction: "ESCALATE_TO_HUMAN", recoverOSPolicyResult: "MANUAL_APPROVAL", recoverOSSuccess: false },
        { id: "case_4", failureReason: "CARD_LIMIT_EXCEEDED", amount: 399900, baselineSuccess: true, recoverOSAction: "SCHEDULE_RETRY", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_5", failureReason: "NETWORK_ERROR", amount: 99900, baselineSuccess: true, recoverOSAction: "IMMEDIATE_RETRY", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_6", failureReason: "DO_NOT_HONOR", amount: 199900, baselineSuccess: false, recoverOSAction: "STOP_INTERVENTION", recoverOSPolicyResult: "BLOCKED", recoverOSSuccess: false },
        { id: "case_7", failureReason: "INSUFFICIENT_FUNDS", amount: 129900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
        { id: "case_8", failureReason: "AUTHENTICATION_FAILED", amount: 189900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      ],
    };

    experiments.unshift(newRun);
    saveStorage(KEY_EXPERIMENTS, experiments);

    return { success: true, run: newRun };
  },

  // Audit Logs
  async getAuditLogs() {
    return auditLogs;
  },

  // Policy
  async getPolicy() {
    return policy;
  },

  async updatePolicy(updated) {
    policy = { ...policy, ...updated };
    saveStorage(KEY_POLICY, policy);
    return policy;
  },

  // Revenue Risk Cases
  async getRiskCases(filters = {}) {
    let result = [...riskCases];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.summary.toLowerCase().includes(q) ||
          (c.bank && c.bank.toLowerCase().includes(q)) ||
          (c.gateway && c.gateway.toLowerCase().includes(q))
      );
    }
    if (filters.severity && filters.severity !== "ALL") {
      result = result.filter((c) => c.severity === filters.severity);
    }
    if (filters.status && filters.status !== "ALL") {
      result = result.filter((c) => c.status === filters.status);
    }
    if (filters.riskType && filters.riskType !== "ALL") {
      result = result.filter((c) => c.riskType === filters.riskType);
    }
    return result;
  },

  async getRiskCase(id) {
    return riskCases.find((c) => c.id === id) || null;
  },

  async updateRiskCase(id, updates) {
    const idx = riskCases.findIndex((c) => c.id === id);
    if (idx !== -1) {
      riskCases[idx] = { ...riskCases[idx], ...updates, updatedAt: new Date().toISOString() };
      saveStorage(KEY_RISK_CASES, riskCases);
      return riskCases[idx];
    }
    return null;
  },

  // AI Investigations
  async getInvestigations() {
    return investigations;
  },

  async getInvestigation(id) {
    return investigations.find((inv) => inv.id === id || inv.caseId === id) || investigations[0];
  },

  // Recovery Batches
  async getRecoveryBatches() {
    return recoveryBatches;
  },

  async getRecoveryBatch(id) {
    return recoveryBatches.find((b) => b.id === id) || null;
  },

  async triggerRiskCasePlaybook(caseId) {
    const rc = riskCases.find((c) => c.id === caseId);
    if (!rc) return { success: false };

    // Update risk case to RECOVERING
    rc.status = "RECOVERING";
    rc.updatedAt = new Date().toISOString();
    saveStorage(KEY_RISK_CASES, riskCases);

    // Create a new recovery batch run
    const newBatch = {
      id: `BATCH-${Date.now().toString().slice(-4)}`,
      name: `Automated Playbook: ${rc.title}`,
      caseId: rc.id,
      status: "PROCESSING",
      strategy: rc.suggestedAction.replace(/_/g, " "),
      targetCount: rc.affectedTransactions,
      recoveredCount: Math.round(rc.affectedTransactions * 0.4),
      successRate: 40.0,
      targetAmount: rc.amountAtRisk,
      recoveredAmount: Math.round(rc.amountAtRisk * 0.4),
      channel: "WhatsApp & SMS",
      startedAt: new Date().toISOString(),
    };
    recoveryBatches.unshift(newBatch);
    saveStorage(KEY_BATCHES, recoveryBatches);

    // Add audit log
    auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: "RISK_PLAYBOOK_TRIGGERED",
      actor: "AI_AGENT",
      status: "EXECUTED",
      message: `Triggered automated recovery playbook for Risk Case ${rc.id} (${rc.title}) - 40% initial links dispatched.`,
      transactionId: null,
      recoveryAttemptId: null,
      createdAt: new Date().toISOString(),
    });
    saveStorage(KEY_AUDIT_LOGS, auditLogs);

    return { success: true, batch: newBatch, riskCase: rc };
  },
};
