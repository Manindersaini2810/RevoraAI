// Initial deterministic dataset matching RecoveryOS simulation logic

export const initialMerchant = {
  id: "merch_fitprime_001",
  name: "FitPrime Subscriptions",
  email: "admin@fitprime.com",
  currency: "INR",
  razorpayKeyId: "rzp_test_fitprime",
  recoveryBudget: 5000000, // ₹50,000
  maxAutomatedAttempts: 3,
  maxContactsPer24Hours: 2,
  maxAutonomousAmount: 50000, // ₹500
};

export const initialPolicy = {
  id: "pol_fitprime_001",
  merchantId: "merch_fitprime_001",
  isActive: true,
  maxAutonomousAmount: 50000, // ₹500
  maxAutomatedAttempts: 3,
  maxContactsPer24Hours: 2,
  allowPaymentLinks: true,
  allowAutomatedRetry: true,
  requireApprovalAboveAmount: 100000, // ₹1,000
};

export const initialCustomers = [
  {
    id: "cust_ananya123",
    name: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    externalCustomerId: "ext_ananya_01",
    lifetimeValue: 4800000, // ₹48,000
    riskLevel: "LOW",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: "cust_rahul123",
    name: "Rahul Mehta",
    email: "rahul.mehta@example.com",
    externalCustomerId: "ext_rahul_02",
    lifetimeValue: 450000, // ₹4,500
    riskLevel: "MEDIUM",
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    id: "cust_vikram123",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    externalCustomerId: "ext_vikram_03",
    lifetimeValue: 120000, // ₹1,200
    riskLevel: "HIGH",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: "cust_priya123",
    name: "Priya Kapoor",
    email: "priya.kapoor@example.com",
    externalCustomerId: "ext_priya_04",
    lifetimeValue: 9500000, // ₹95,000
    riskLevel: "LOW",
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: "cust_rajesh123",
    name: "Rajesh Patel",
    email: "rajesh.patel@example.com",
    externalCustomerId: "ext_rajesh_05",
    lifetimeValue: 1540000, // ₹15,400
    riskLevel: "LOW",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "cust_sneha123",
    name: "Sneha Roy",
    email: "sneha.roy@example.com",
    externalCustomerId: "ext_sneha_06",
    lifetimeValue: 890000, // ₹8,900
    riskLevel: "MEDIUM",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

export const initialTransactions = [
  {
    id: "txn_ananya_01",
    customerId: "cust_ananya123",
    amount: 249900, // ₹2,499.00
    status: "RECOVERED",
    failureReason: "INSUFFICIENT_FUNDS",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "txn_rahul_01",
    customerId: "cust_rahul123",
    amount: 99900, // ₹999.00
    status: "RECOVERING",
    failureReason: "EXPIRED_CARD",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "txn_vikram_01",
    customerId: "cust_vikram123",
    amount: 149900, // ₹1,499.00
    status: "FAILED",
    failureReason: "PAYMENT_CANCELLED_BY_USER",
    paymentMethod: "upi",
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: "txn_priya_01",
    customerId: "cust_priya123",
    amount: 499900, // ₹4,999.00
    status: "FAILED",
    failureReason: "AUTHENTICATION_FAILED",
    paymentMethod: "netbanking",
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "txn_rajesh_01",
    customerId: "cust_rajesh123",
    amount: 349900, // ₹3,499.00
    status: "SUCCESS",
    failureReason: null,
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "txn_sneha_01",
    customerId: "cust_sneha123",
    amount: 129900, // ₹1,299.00
    status: "SUCCESS",
    failureReason: null,
    paymentMethod: "upi",
    createdAt: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
];

export const initialRecoveries = [
  {
    id: "rec_ananya_01",
    transactionId: "txn_ananya_01",
    customerId: "cust_ananya123",
    attemptNumber: 1,
    status: "SUCCESS",
    action: "SEND_PAYMENT_LINK",
    amountAtRisk: 249900,
    amountRecovered: 249900,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    executedAt: new Date(Date.now() - 1.8 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
    recoveryDecision: {
      diagnosis: "Temporary liquidity shortfall on recurring card debit",
      recommendedAction: "SEND_PAYMENT_LINK",
      expectedRecovery: 249900,
      riskLevel: "LOW",
      confidence: 0.94,
      reasoningSummary: "High LTV subscriber with 14 continuous successful cycles. Sending interactive Razorpay link with UPI option guarantees minimal friction.",
      metadata: {
        decisionSource: "AI RECOVERY AGENT",
        model: "deepseek-r1-distill-llama-70b via OpenRouter",
        customerContextSummary: "Customer since Oct 2024. Monthly Gym Pro subscription. Low churn propensity.",
      },
    },
    policyDecisions: [
      {
        allowed: true,
        requiresHumanApproval: false,
        reason: "Amount within approved range; recovery attempt #1 within maximum threshold (3).",
        blockedRules: [],
        createdAt: new Date(Date.now() - 1.9 * 3600000).toISOString(),
      },
    ],
    paymentLinks: [
      {
        id: "plink_ananya_01",
        razorpayPaymentLinkId: "plink_K9xZqW8a01",
        shortUrl: "https://rzp.io/i/test_ananya_01",
        amount: 249900,
        status: "paid",
      },
    ],
    auditLogs: [
      {
        id: "log_ananya_01",
        actor: "RAZORPAY",
        eventType: "PAYMENT_LINK_PAID",
        message: "Payment link paid by customer via UPI. Transaction verified.",
        createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      },
      {
        id: "log_ananya_02",
        actor: "EXECUTOR",
        eventType: "PAYMENT_LINK_CREATED",
        message: "Generated active Razorpay test payment link plink_K9xZqW8a01.",
        createdAt: new Date(Date.now() - 1.8 * 3600000).toISOString(),
      },
      {
        id: "log_ananya_03",
        actor: "POLICY_GUARDIAN",
        eventType: "POLICY_APPROVED",
        message: "Autonomous action SEND_PAYMENT_LINK authorized for ₹2,499.00.",
        createdAt: new Date(Date.now() - 1.9 * 3600000).toISOString(),
      },
      {
        id: "log_ananya_04",
        actor: "AI_AGENT",
        eventType: "AI_RECOMMENDATION_GENERATED",
        message: "AI Agent analyzed failure reason (INSUFFICIENT_FUNDS) and recommended SEND_PAYMENT_LINK with 94% confidence.",
        createdAt: new Date(Date.now() - 2.0 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: "rec_vikram_01",
    transactionId: "txn_vikram_01",
    customerId: "cust_vikram123",
    attemptNumber: 4,
    status: "POLICY_BLOCKED",
    action: "ESCALATE_TO_HUMAN",
    amountAtRisk: 149900,
    amountRecovered: 0,
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    executedAt: new Date(Date.now() - 7.9 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 7.9 * 3600000).toISOString(),
    recoveryDecision: {
      diagnosis: "Persistent repeated failures; previous 3 retry notifications ignored",
      recommendedAction: "RETRY_PAYMENT_CARD",
      expectedRecovery: 75000,
      riskLevel: "HIGH",
      confidence: 0.62,
      reasoningSummary: "AI suggested automated card re-attempt, but safety rule evaluation intervened.",
      metadata: {
        decisionSource: "AI RECOVERY AGENT",
        model: "deepseek-r1-distill-llama-70b via OpenRouter",
        customerContextSummary: "High dispute risk, 3 previous attempts reached maximum contact limit.",
      },
    },
    policyDecisions: [
      {
        allowed: false,
        requiresHumanApproval: true,
        reason: "Maximum automated attempts (3) exceeded for this billing cycle. Repeated contact blocked to prevent customer harassment.",
        blockedRules: [
          "RULE_MAX_ATTEMPTS: Attempt count 4 exceeds maximum allowed 3",
          "RULE_CONTACT_FREQUENCY: Customer contacted 2 times in last 24 hours",
        ],
        createdAt: new Date(Date.now() - 7.95 * 3600000).toISOString(),
      },
    ],
    paymentLinks: [],
    auditLogs: [
      {
        id: "log_vikram_01",
        actor: "POLICY_GUARDIAN",
        eventType: "POLICY_BLOCKED",
        message: "Blocked proposed RETRY_PAYMENT_CARD. Exceeded max automated attempts limit.",
        createdAt: new Date(Date.now() - 7.95 * 3600000).toISOString(),
      },
      {
        id: "log_vikram_02",
        actor: "SYSTEM",
        eventType: "ESCALATED_TO_HUMAN",
        message: "Autonomous action prevented. Recovery case escalated to human merchant operations queue.",
        createdAt: new Date(Date.now() - 7.9 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: "rec_priya_01",
    transactionId: "txn_priya_01",
    customerId: "cust_priya123",
    attemptNumber: 1,
    status: "PENDING_APPROVAL",
    action: "SEND_PAYMENT_LINK",
    amountAtRisk: 499900,
    amountRecovered: 0,
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    recoveryDecision: {
      diagnosis: "High-value enterprise tier transaction authentication timeout",
      recommendedAction: "SEND_PAYMENT_LINK",
      expectedRecovery: 499900,
      riskLevel: "MEDIUM",
      confidence: 0.88,
      reasoningSummary: "VIP corporate subscriber failed 3D Secure OTP verification. Sending dedicated high-priority recovery invoice.",
      metadata: {
        decisionSource: "AI RECOVERY AGENT",
        model: "deepseek-r1-distill-llama-70b via OpenRouter",
        customerContextSummary: "Premium customer LTV ₹95,000. Annual VIP tier.",
      },
    },
    policyDecisions: [
      {
        allowed: true,
        requiresHumanApproval: true,
        reason: "Transaction amount (₹4,999.00) exceeds autonomous threshold limit (₹1,000.00). Requires manual operator sign-off.",
        blockedRules: [],
        createdAt: new Date(Date.now() - 11.9 * 3600000).toISOString(),
      },
    ],
    paymentLinks: [],
    auditLogs: [
      {
        id: "log_priya_01",
        actor: "POLICY_GUARDIAN",
        eventType: "HUMAN_APPROVAL_REQUESTED",
        message: "Amount ₹4,999.00 exceeds autonomous limit. Awaiting operator authorization.",
        createdAt: new Date(Date.now() - 11.9 * 3600000).toISOString(),
      },
      {
        id: "log_priya_02",
        actor: "AI_AGENT",
        eventType: "AI_RECOMMENDATION_GENERATED",
        message: "AI proposed SEND_PAYMENT_LINK with personalized VIP messaging template.",
        createdAt: new Date(Date.now() - 12.0 * 3600000).toISOString(),
      },
    ],
  },
  {
    id: "rec_rahul_01",
    transactionId: "txn_rahul_01",
    customerId: "cust_rahul123",
    attemptNumber: 1,
    status: "WAITING_FOR_CUSTOMER",
    action: "SEND_PAYMENT_LINK",
    amountAtRisk: 99900,
    amountRecovered: 0,
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    executedAt: new Date(Date.now() - 3.8 * 3600000).toISOString(),
    recoveryDecision: {
      diagnosis: "Card expired on recurring billing date",
      recommendedAction: "SEND_PAYMENT_LINK",
      expectedRecovery: 99900,
      riskLevel: "LOW",
      confidence: 0.91,
      reasoningSummary: "Customer card expired this month. Payment link with card update prompt is standard optimal intervention.",
      metadata: {
        decisionSource: "AI RECOVERY AGENT",
        model: "deepseek-r1-distill-llama-70b via OpenRouter",
        customerContextSummary: "Mid-tier user with 6 prior on-time renewals.",
      },
    },
    policyDecisions: [
      {
        allowed: true,
        requiresHumanApproval: false,
        reason: "Valid recovery attempt within merchant policy rules.",
        blockedRules: [],
        createdAt: new Date(Date.now() - 3.9 * 3600000).toISOString(),
      },
    ],
    paymentLinks: [
      {
        id: "plink_rahul_01",
        razorpayPaymentLinkId: "plink_R8mX7z9Y02",
        shortUrl: "https://rzp.io/i/test_rahul_01",
        amount: 99900,
        status: "issued",
      },
    ],
    auditLogs: [
      {
        id: "log_rahul_01",
        actor: "EXECUTOR",
        eventType: "PAYMENT_LINK_SENT",
        message: "Payment link dispatched to rahul.mehta@example.com with 48h validity.",
        createdAt: new Date(Date.now() - 3.8 * 3600000).toISOString(),
      },
      {
        id: "log_rahul_02",
        actor: "POLICY_GUARDIAN",
        eventType: "POLICY_APPROVED",
        message: "Autonomous action SEND_PAYMENT_LINK approved.",
        createdAt: new Date(Date.now() - 3.9 * 3600000).toISOString(),
      },
    ],
  },
];

export const initialAuditLogs = [
  {
    id: "aud_01",
    actor: "RAZORPAY",
    eventType: "PAYMENT_VERIFIED",
    message: "Verified webhook signature and marked transaction txn_ananya_01 as RECOVERED (₹2,499.00).",
    transactionId: "txn_ananya_01",
    recoveryAttemptId: "rec_ananya_01",
    createdAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
  },
  {
    id: "aud_02",
    actor: "EXECUTOR",
    eventType: "PAYMENT_LINK_CREATED",
    message: "Generated Razorpay Payment Link plink_K9xZqW8a01 for ₹2,499.00.",
    transactionId: "txn_ananya_01",
    recoveryAttemptId: "rec_ananya_01",
    createdAt: new Date(Date.now() - 1.8 * 3600000).toISOString(),
  },
  {
    id: "aud_03",
    actor: "POLICY_GUARDIAN",
    eventType: "ACTION_APPROVED",
    message: "Approved AI recommendation: SEND_PAYMENT_LINK. Rules checked: autonomous limit, contact frequency, idempotency.",
    transactionId: "txn_ananya_01",
    recoveryAttemptId: "rec_ananya_01",
    createdAt: new Date(Date.now() - 1.9 * 3600000).toISOString(),
  },
  {
    id: "aud_04",
    actor: "AI_AGENT",
    eventType: "DECISION_GENERATED",
    message: "Diagnosed failure reason INSUFFICIENT_FUNDS. Recommended SEND_PAYMENT_LINK (Confidence: 94%).",
    transactionId: "txn_ananya_01",
    recoveryAttemptId: "rec_ananya_01",
    createdAt: new Date(Date.now() - 2.0 * 3600000).toISOString(),
  },
  {
    id: "aud_05",
    actor: "POLICY_GUARDIAN",
    eventType: "ACTION_BLOCKED",
    message: "Blocked proposed RETRY_PAYMENT_CARD for txn_vikram_01. Maximum automated attempts limit (3) exceeded.",
    transactionId: "txn_vikram_01",
    recoveryAttemptId: "rec_vikram_01",
    createdAt: new Date(Date.now() - 7.95 * 3600000).toISOString(),
  },
  {
    id: "aud_06",
    actor: "SYSTEM",
    eventType: "HUMAN_ESCALATION",
    message: "Escalated transaction txn_vikram_01 to merchant support inbox. Customer contact paused.",
    transactionId: "txn_vikram_01",
    recoveryAttemptId: "rec_vikram_01",
    createdAt: new Date(Date.now() - 7.9 * 3600000).toISOString(),
  },
  {
    id: "aud_07",
    actor: "POLICY_GUARDIAN",
    eventType: "APPROVAL_REQUIRED",
    message: "Flagged transaction txn_priya_01: Amount ₹4,999.00 exceeds autonomous threshold ₹1,000.00.",
    transactionId: "txn_priya_01",
    recoveryAttemptId: "rec_priya_01",
    createdAt: new Date(Date.now() - 11.9 * 3600000).toISOString(),
  },
  {
    id: "aud_08",
    actor: "RAZORPAY",
    eventType: "WEBHOOK_RECEIVED",
    message: "Received payment.failed webhook event for order_fitprime_9901 (Customer: Ananya Sharma).",
    transactionId: "txn_ananya_01",
    recoveryAttemptId: null,
    createdAt: new Date(Date.now() - 2.1 * 3600000).toISOString(),
  },
];

export const initialExperiments = [
  {
    id: "exp_run_001",
    name: "Holdout Evaluation #104 — 1,000 Failed Payments",
    seed: 42,
    sampleSize: 1000,
    startedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 13.9 * 3600000).toISOString(),
    totalRevenueAtRisk: 24850000, // ₹248,500.00
    baselineRevenueRecovered: 8420000, // ₹84,200.00
    recoverOSRevenueRecovered: 12150000, // ₹121,500.00
    incrementalRevenue: 3730000, // +₹37,300.00
    baselineRecoveryRate: 33.9,
    recoverOSRecoveryRate: 48.9,
    incrementalRecoveryRate: 15.0,
    baselineAttempts: 2840,
    recoverOSAttempts: 1420,
    netRecoveredRevenueRecoverOS: 11980000,
    policyBlocks: 218,
    humanEscalations: 64,
    stoppedRecoveries: 152,
    cases: [
      { id: "case_1", failureReason: "INSUFFICIENT_FUNDS", amount: 249900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_2", failureReason: "EXPIRED_CARD", amount: 149900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_3", failureReason: "AUTHENTICATION_FAILED", amount: 499900, baselineSuccess: false, recoverOSAction: "ESCALATE_TO_HUMAN", recoverOSPolicyResult: "MANUAL_APPROVAL", recoverOSSuccess: false },
      { id: "case_4", failureReason: "CARD_LIMIT_EXCEEDED", amount: 399900, baselineSuccess: true, recoverOSAction: "SCHEDULE_RETRY", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_5", failureReason: "NETWORK_ERROR", amount: 99900, baselineSuccess: true, recoverOSAction: "IMMEDIATE_RETRY", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_6", failureReason: "DO_NOT_HONOR", amount: 199900, baselineSuccess: false, recoverOSAction: "STOP_INTERVENTION", recoverOSPolicyResult: "BLOCKED", recoverOSSuccess: false },
      { id: "case_7", failureReason: "INSUFFICIENT_FUNDS", amount: 129900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_8", failureReason: "AUTHENTICATION_FAILED", amount: 189900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_9", failureReason: "CARD_EXPIRED", amount: 299900, baselineSuccess: false, recoverOSAction: "SEND_PAYMENT_LINK", recoverOSPolicyResult: "APPROVED", recoverOSSuccess: true },
      { id: "case_10", failureReason: "INVALID_CARD_DETAILS", amount: 89900, baselineSuccess: false, recoverOSAction: "STOP_INTERVENTION", recoverOSPolicyResult: "BLOCKED", recoverOSSuccess: false },
    ],
  },
  {
    id: "exp_run_002",
    name: "Holdout Evaluation #103 — 500 Failed Payments",
    seed: 1337,
    sampleSize: 500,
    startedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 47.9 * 3600000).toISOString(),
    totalRevenueAtRisk: 12400000,
    baselineRevenueRecovered: 4100000,
    recoverOSRevenueRecovered: 6250000,
    incrementalRevenue: 2150000,
    baselineRecoveryRate: 33.1,
    recoverOSRecoveryRate: 50.4,
    incrementalRecoveryRate: 17.3,
    baselineAttempts: 1410,
    recoverOSAttempts: 710,
    netRecoveredRevenueRecoverOS: 6180000,
    policyBlocks: 104,
    humanEscalations: 29,
    stoppedRecoveries: 75,
    cases: [],
  },
];

export const initialRiskCases = [
  {
    id: "RC-001",
    title: "UPI Intent Degradation on HDFC & SBI",
    summary: "Intermittent NPCI switch timeouts leading to 68.4% payment failure rates on Google Pay and PhonePe handles.",
    severity: "CRITICAL",
    status: "INVESTIGATING",
    riskType: "PAYMENT_DEGRADATION",
    gateway: "Razorpay UPI",
    bank: "HDFC Bank, State Bank of India",
    affectedTransactions: 142,
    amountAtRisk: 34850000, // ₹3,48,500
    amountRecovered: 23100000, // ₹2,31,000
    recoveryRate: 66.3,
    investigationId: "INV-001",
    aiDiagnosis: "NPCI gateway timeout during evening traffic peak. Dynamic fallback to ICICI routing and 1-click WhatsApp checkout recommended.",
    suggestedAction: "DISPATCH_SMART_PAYMENT_LINKS",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: "RC-002",
    title: "3DS OTP Timeout Surge on International Cards",
    summary: "High latency on 3D Secure verification page causing checkout abandonment on foreign Visa/Mastercard cards.",
    severity: "HIGH",
    status: "RECOVERY_PLANNED",
    riskType: "PAYMENT_DEGRADATION",
    gateway: "Razorpay Cards",
    bank: "International Issuers (US/UK/EU)",
    affectedTransactions: 48,
    amountAtRisk: 18990000, // ₹1,89,900
    amountRecovered: 12050000, // ₹1,20,500
    recoveryRate: 63.5,
    investigationId: "INV-002",
    aiDiagnosis: "International SMS gateway delay exceeding 120s. Headless tokenized retry and localized currency billing recommended.",
    suggestedAction: "HEADLESS_TOKEN_RETRY",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
  {
    id: "RC-003",
    title: "Recurring Mandate Auto-Debit Failure Surge",
    summary: "Pre-debit notifications failed to deliver on telecom DND registers, causing auto-debit rejection by issuer banks.",
    severity: "MEDIUM",
    status: "RECOVERING",
    riskType: "SUBSCRIPTION_FAILURES",
    gateway: "Razorpay Mandates (eNACH)",
    bank: "Axis Bank, Kotak Mahindra",
    affectedTransactions: 35,
    amountAtRisk: 8750000, // ₹87,500
    amountRecovered: 6500000, // ₹65,000
    recoveryRate: 74.3,
    investigationId: "INV-003",
    aiDiagnosis: "Automated pre-debit SMS blocked by carrier spam filters. Dispatched multi-channel WhatsApp reminder with 1-click renewal.",
    suggestedAction: "SEND_MULTI_CHANNEL_REMINDER",
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "RC-004",
    title: "Checkout Abandonment on Low-Bandwidth Networks",
    summary: "High bounce rate on slow 3G/4G connections during peak mobile traffic hours.",
    severity: "LOW",
    status: "OPEN",
    riskType: "CHECKOUT_ABANDONMENT",
    gateway: "Merchant Checkout API",
    bank: "All Mobile Carriers",
    affectedTransactions: 78,
    amountAtRisk: 14200000, // ₹1,42,000
    amountRecovered: 4500000, // ₹45,000
    recoveryRate: 31.7,
    investigationId: "INV-004",
    aiDiagnosis: "Checkout script asset size exceeding 1.8MB on slow mobile links. Fast-path checkout link with 5% limited-time incentive recommended.",
    suggestedAction: "DISPATCH_FAST_CHECKOUT_LINK",
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "RC-005",
    title: "HDFC Netbanking Latency Throttle",
    summary: "Core banking system throttle caused timeouts during early morning scheduled maintenance window.",
    severity: "HIGH",
    status: "RESOLVED",
    riskType: "GATEWAY_LATENCY",
    gateway: "Netbanking Switch",
    bank: "HDFC Bank",
    affectedTransactions: 92,
    amountAtRisk: 21500000, // ₹2,15,000
    amountRecovered: 19800000, // ₹1,98,000
    recoveryRate: 92.1,
    investigationId: "INV-005",
    aiDiagnosis: "Maintenance window concluded. 92% of affected customers successfully recovered via automated UPI retry links.",
    suggestedAction: "RESOLVED_AUTO_ROUTE",
    createdAt: new Date(Date.now() - 32 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

export const initialInvestigations = [
  {
    id: "INV-001",
    caseId: "RC-001",
    title: "UPI Intent Degradation Investigation — NPCI/HDFC Gateway Failure",
    status: "ACTIVE_INCIDENT",
    severity: "CRITICAL",
    riskType: "PAYMENT_DEGRADATION",
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
    failureRate: "68.4%",
    baselineFailureRate: "4.2%",
    totalImpacted: 142,
    revenueAtRisk: 34850000, // ₹3,48,500
    potentialRecoverable: 28500000, // ₹2,85,000
    actualRecovered: 23100000, // ₹2,31,000
    recoveryProgressPercent: 81.1,
    rootCauseSummary: "NPCI UPI Switch timeout on @okhdfcbank and @oksbi handles. Average response latency spiked from 420ms to 8,450ms, causing Google Pay & PhonePe client timeouts.",
    telemetryBreakdown: [
      { name: "HDFC UPI Intent", failureRate: "72.4%", count: 88, status: "DEGRADED" },
      { name: "SBI UPI Intent", failureRate: "64.1%", count: 54, status: "DEGRADED" },
      { name: "ICICI UPI Intent", failureRate: "3.1%", count: 32, status: "HEALTHY" },
      { name: "Axis UPI Intent", failureRate: "2.8%", count: 26, status: "HEALTHY" },
    ],
    timeline: [
      { time: "14:15", title: "Anomaly Detected", desc: "Revora AI real-time telemetry flagged >50% failure surge on Razorpay UPI node.", type: "alert" },
      { time: "14:18", title: "AI Root Cause Diagnosis", desc: "LLM Agent identified NPCI switch latency spike specifically on HDFC & SBI issuer banks.", type: "ai" },
      { time: "14:20", title: "Policy Guardian Evaluation", desc: "Validated bounded recovery parameters: max 2 retry attempts, autonomous payment link budget approved.", type: "policy" },
      { time: "14:25", title: "Automated Batch Recovery Dispatched", desc: "Generated 142 personalized smart checkout links with fallback to ICICI UPI & Cards.", type: "execution" },
      { time: "15:10", title: "Revenue Recovery Update", desc: "94 of 142 customers recovered successfully. ₹2,31,000 recovered into merchant account.", type: "success" },
    ],
    recommendedPlaybook: {
      action: "DYNAMIC_ROUTING_AND_SMART_LINKS",
      priority: "IMMEDIATE",
      routingRecommendation: "Route subsequent UPI requests through ICICI / Axis gateway nodes; bypass degraded NPCI handles.",
      customerAction: "Deliver 1-click WhatsApp payment retry link with pre-filled cart and instant UPI verification.",
    },
  },
];

export const initialRecoveryBatches = [
  {
    id: "BATCH-2026-001",
    name: "HDFC/SBI UPI Incident Recovery Run",
    caseId: "RC-001",
    status: "PROCESSING",
    strategy: "AI Dynamic Payment Links",
    targetCount: 142,
    recoveredCount: 94,
    successRate: 66.2,
    targetAmount: 34850000,
    recoveredAmount: 23100000,
    channel: "WhatsApp & SMS",
    startedAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: "BATCH-2026-002",
    name: "Card Expiry Batch Renewal — November Cohort",
    caseId: "RC-002",
    status: "COMPLETED",
    strategy: "Headless Card Update Prompt",
    targetCount: 68,
    recoveredCount: 52,
    successRate: 76.5,
    targetAmount: 16990000,
    recoveredAmount: 13000000,
    channel: "Email & WhatsApp",
    startedAt: new Date(Date.now() - 14 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    id: "BATCH-2026-003",
    name: "High-Value Cart Abandonment Recovery",
    caseId: "RC-004",
    status: "COMPLETED",
    strategy: "Smart Discount Recovery Link",
    targetCount: 45,
    recoveredCount: 38,
    successRate: 84.4,
    targetAmount: 11250000,
    recoveredAmount: 9500000,
    channel: "SMS & WhatsApp",
    startedAt: new Date(Date.now() - 28 * 3600000).toISOString(),
    completedAt: new Date(Date.now() - 25 * 3600000).toISOString(),
  },
];

