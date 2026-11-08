import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["ADMIN", "MERCHANT", "OPERATOR", "AUDITOR"]).optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const transactionCreateSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, "Customer ID is required"),
    amount: z.number().int().positive("Amount must be a positive integer in paise"),
    currency: z.string().default("INR"),
    paymentMethod: z.enum(["UPI", "CARD", "NETBANKING", "WALLET", "card", "upi"]).default("UPI"),
    failureReason: z.string().optional(),
  }),
});

export const updatePolicySchema = z.object({
  body: z.object({
    maxAutomatedAttempts: z.number().int().min(1).max(10).optional(),
    maxAutonomousAmount: z.number().int().positive().optional(),
    maxContactsPer24Hours: z.number().int().min(1).max(5).optional(),
    allowPaymentLinks: z.boolean().optional(),
    allowAutomatedRetry: z.boolean().optional(),
    requireApprovalAboveAmount: z.number().int().positive().optional(),
  }),
});

export const recoveryActionSchema = z.object({
  body: z.object({
    action: z.enum(["APPROVE", "REJECT", "EXECUTE_PLAYBOOK"]),
    reason: z.string().optional(),
  }),
});
