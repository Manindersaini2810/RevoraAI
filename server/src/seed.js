import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows / ISP DNS blocking SRV record resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if restricted
}

import { User } from "./models/User.js";
import { Merchant } from "./models/Merchant.js";
import { MerchantPolicy } from "./models/MerchantPolicy.js";
import { Customer } from "./models/Customer.js";
import { Transaction } from "./models/Transaction.js";
import { RecoveryAttempt } from "./models/RecoveryAttempt.js";
import { RecoveryDecision } from "./models/RecoveryDecision.js";
import { PolicyDecision } from "./models/PolicyDecision.js";
import { AuditLog } from "./models/AuditLog.js";
import { RiskCase } from "./models/RiskCase.js";
import { ExperimentRun } from "./models/ExperimentRun.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes("<username>") || uri.includes("password@cluster0")) {
      console.error("❌ Cannot seed: Please update MONGODB_URI in server/.env with your valid Atlas connection string.");
      process.exit(1);
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log("Connected successfully. Seeding initial Revora AI dataset...");

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Merchant.deleteMany({}),
      MerchantPolicy.deleteMany({}),
      Customer.deleteMany({}),
      Transaction.deleteMany({}),
      RecoveryAttempt.deleteMany({}),
      RecoveryDecision.deleteMany({}),
      PolicyDecision.deleteMany({}),
      AuditLog.deleteMany({}),
      RiskCase.deleteMany({}),
      ExperimentRun.deleteMany({}),
    ]);

    // 1. Merchant User
    const adminUser = await User.create({
      name: "Revora Admin",
      email: "admin@fitprime.com",
      password: "password123",
      role: "ADMIN",
      merchantId: "merch_fitprime_001",
    });

    // 2. Merchant Profile
    await Merchant.create({
      merchantId: "merch_fitprime_001",
      name: "FitPrime Commerce",
      email: "admin@fitprime.com",
      currency: "INR",
      razorpayKeyId: "rzp_test_fitprime",
      recoveryBudget: 5000000,
      maxAutomatedAttempts: 3,
      maxContactsPer24Hours: 2,
      maxAutonomousAmount: 50000,
      isActive: true,
    });

    // 3. Merchant Policy
    await MerchantPolicy.create({
      policyId: "pol_fitprime_001",
      merchantId: "merch_fitprime_001",
      maxAutomatedAttempts: 3,
      maxAutonomousAmount: 50000,
      maxContactsPer24Hours: 2,
      allowPaymentLinks: true,
      allowAutomatedRetry: true,
      requireApprovalAboveAmount: 100000,
      isActive: true,
    });

    // 4. Customers (RecoveryOS personas)
    const customers = await Customer.insertMany([
      {
        customerId: "cust_ananya123",
        merchantId: "merch_fitprime_001",
        externalCustomerId: "ext_ananya_01",
        name: "Ananya Sharma",
        email: "ananya.sharma@example.com",
        phone: "+919876543210",
        lifetimeValue: 4800000,
        riskLevel: "LOW",
        totalPayments: 12,
        successfulPayments: 11,
        failedPayments: 1,
      },
      {
        customerId: "cust_rahul123",
        merchantId: "merch_fitprime_001",
        externalCustomerId: "ext_rahul_02",
        name: "Rahul Mehta",
        email: "rahul.mehta@example.com",
        phone: "+919876543211",
        lifetimeValue: 450000,
        riskLevel: "MEDIUM",
        totalPayments: 4,
        successfulPayments: 3,
        failedPayments: 1,
      },
      {
        customerId: "cust_vikram123",
        merchantId: "merch_fitprime_001",
        externalCustomerId: "ext_vikram_03",
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        phone: "+919876543212",
        lifetimeValue: 120000,
        riskLevel: "HIGH",
        totalPayments: 2,
        successfulPayments: 1,
        failedPayments: 1,
      },
      {
        customerId: "cust_priya123",
        merchantId: "merch_fitprime_001",
        externalCustomerId: "ext_priya_04",
        name: "Priya Kapoor",
        email: "priya.kapoor@example.com",
        phone: "+919876543213",
        lifetimeValue: 9500000,
        riskLevel: "LOW",
        totalPayments: 24,
        successfulPayments: 23,
        failedPayments: 1,
      },
    ]);

    // 5. Transactions
    await Transaction.insertMany([
      {
        transactionId: "txn_ananya_01",
        customerId: "cust_ananya123",
        amount: 249900,
        currency: "INR",
        status: "RECOVERED",
        failureReason: "INSUFFICIENT_FUNDS",
        paymentMethod: "CARD",
        attemptedAt: new Date(Date.now() - 2 * 3600000),
        recoveredAt: new Date(Date.now() - 1 * 3600000),
      },
      {
        transactionId: "txn_rahul_01",
        customerId: "cust_rahul123",
        amount: 99900,
        currency: "INR",
        status: "RECOVERING",
        failureReason: "CARD_EXPIRED",
        paymentMethod: "CARD",
        attemptedAt: new Date(Date.now() - 5 * 3600000),
      },
      {
        transactionId: "txn_vikram_01",
        customerId: "cust_vikram123",
        amount: 499900,
        currency: "INR",
        status: "FAILED",
        failureReason: "DO_NOT_HONOR",
        paymentMethod: "CARD",
        attemptedAt: new Date(Date.now() - 8 * 3600000),
      },
      {
        transactionId: "txn_priya_01",
        customerId: "cust_priya123",
        amount: 349900,
        currency: "INR",
        status: "RECOVERED",
        failureReason: "BANK_ERROR",
        paymentMethod: "UPI",
        attemptedAt: new Date(Date.now() - 12 * 3600000),
        recoveredAt: new Date(Date.now() - 11.5 * 3600000),
      },
    ]);

    // 6. Recovery Attempts & Decisions
    await RecoveryAttempt.create({
      recoveryId: "rec_ananya_01",
      customerId: "cust_ananya123",
      transactionId: "txn_ananya_01",
      action: "SEND_PAYMENT_LINK",
      attemptNumber: 1,
      status: "SUCCESS",
      reasoning: "High LTV customer with insufficient funds. Dispatched instant WhatsApp payment link with 1-click UPI checkout.",
      amountAtRisk: 249900,
      amountRecovered: 249900,
      executedAt: new Date(Date.now() - 1.8 * 3600000),
      completedAt: new Date(Date.now() - 1 * 3600000),
    });

    await RecoveryDecision.create({
      decisionId: "dec_ananya_01",
      recoveryAttemptId: "rec_ananya_01",
      transactionId: "txn_ananya_01",
      diagnosis: "Temporary liquidity shortfall on card account.",
      confidence: 0.94,
      recoveryWorthwhile: true,
      recommendedAction: "SEND_PAYMENT_LINK",
      reasoningSummary: "Customer has 11 successful payments and ₹48,000 LTV. High probability of immediate recovery via alternate payment method.",
      expectedRecovery: 249900,
      riskLevel: "LOW",
    });

    await PolicyDecision.create({
      policyDecisionId: "pol_dec_ananya_01",
      recoveryAttemptId: "rec_ananya_01",
      allowed: true,
      policyName: "STANDARD_RECOVERY_POLICY",
      reason: "Within autonomous budget and acceptable customer risk score.",
      requiresHumanApproval: false,
    });

    // 7. Risk Cases (from recoverai.dhirajm.com.np)
    await RiskCase.insertMany([
      {
        caseId: "RC-001",
        title: "UPI Intent Degradation on HDFC & SBI",
        summary: "Intermittent NPCI switch timeouts leading to 68.4% payment failure rates on Google Pay and PhonePe handles.",
        severity: "CRITICAL",
        status: "INVESTIGATING",
        riskType: "PAYMENT_DEGRADATION",
        gateway: "Razorpay UPI",
        bank: "HDFC Bank, State Bank of India",
        affectedTransactions: 142,
        amountAtRisk: 34850000,
        amountRecovered: 23100000,
        recoveryRate: 66.3,
        investigationId: "INV-001",
        aiDiagnosis: "NPCI gateway timeout during evening traffic peak. Dynamic fallback to ICICI routing and 1-click WhatsApp checkout recommended.",
        suggestedAction: "DISPATCH_SMART_PAYMENT_LINKS",
      },
      {
        caseId: "RC-002",
        title: "3DS OTP Timeout Surge on International Cards",
        summary: "High latency on 3D Secure verification page causing checkout abandonment on foreign Visa/Mastercard cards.",
        severity: "HIGH",
        status: "RECOVERY_PLANNED",
        riskType: "PAYMENT_DEGRADATION",
        gateway: "Razorpay Cards",
        bank: "International Issuers (US/UK/EU)",
        affectedTransactions: 48,
        amountAtRisk: 18990000,
        amountRecovered: 12050000,
        recoveryRate: 63.5,
        investigationId: "INV-002",
        aiDiagnosis: "International SMS gateway delay exceeding 120s. Headless tokenized retry and localized currency billing recommended.",
        suggestedAction: "HEADLESS_TOKEN_RETRY",
      },
      {
        caseId: "RC-003",
        title: "Recurring Mandate Auto-Debit Failure Surge",
        summary: "Pre-debit notifications failed to deliver on telecom DND registers, causing auto-debit rejection by issuer banks.",
        severity: "MEDIUM",
        status: "RECOVERING",
        riskType: "SUBSCRIPTION_FAILURES",
        gateway: "Razorpay Mandates (eNACH)",
        bank: "Axis Bank, Kotak Mahindra",
        affectedTransactions: 35,
        amountAtRisk: 8750000,
        amountRecovered: 6500000,
        recoveryRate: 74.3,
        investigationId: "INV-003",
        aiDiagnosis: "Automated pre-debit SMS blocked by carrier spam filters. Dispatched multi-channel WhatsApp reminder with 1-click renewal.",
        suggestedAction: "SEND_MULTI_CHANNEL_REMINDER",
      },
    ]);

    // 8. Experiment Runs
    await ExperimentRun.create({
      experimentId: "exp_run_001",
      name: "Holdout Evaluation #104 — 1,000 Failed Payments",
      seed: 42,
      sampleSize: 1000,
      totalRevenueAtRisk: 24850000,
      baselineRevenueRecovered: 8420000,
      recoverOSRevenueRecovered: 12150000,
      incrementalRevenue: 3730000,
      baselineRecoveryRate: 33.9,
      recoverOSRecoveryRate: 48.9,
      incrementalRecoveryRate: 15.0,
      baselineAttempts: 2840,
      recoverOSAttempts: 1420,
      policyBlocks: 218,
      humanEscalations: 64,
      stoppedRecoveries: 152,
    });

    // 9. Audit Logs
    await AuditLog.create({
      logId: "log_init_001",
      eventType: "SYSTEM_INITIALIZED",
      actor: "SYSTEM",
      message: "Revora AI Autonomous Revenue Recovery system initialized and connected to database.",
    });

    console.log("✅ Seed completed successfully! All RecoveryOS collections populated in MongoDB Atlas.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seedDatabase();
