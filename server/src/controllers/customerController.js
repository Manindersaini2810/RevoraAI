import { Customer } from "../models/Customer.js";
import { Transaction } from "../models/Transaction.js";
import { RecoveryAttempt } from "../models/RecoveryAttempt.js";

export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ lifetimeValue: -1 }).lean();
    res.json({ success: true, count: customers.length, customers });
  } catch (err) {
    next(err);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ customerId: req.params.id }).lean();
    if (!customer) {
      return res.status(404).json({ success: false, message: "Customer not found" });
    }

    const [transactions, recoveries] = await Promise.all([
      Transaction.find({ customerId: customer.customerId }).sort({ createdAt: -1 }).lean(),
      RecoveryAttempt.find({ customerId: customer.customerId }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json({
      success: true,
      customer,
      transactions,
      recoveries,
    });
  } catch (err) {
    next(err);
  }
};
