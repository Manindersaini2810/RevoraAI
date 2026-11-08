import { Transaction } from "../models/Transaction.js";
import { Customer } from "../models/Customer.js";

export const getTransactions = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== "ALL") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: "i" } },
        { customerId: { $regex: search, $options: "i" } },
      ];
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      count: transactions.length,
      total,
      transactions,
    });
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ transactionId: req.params.id }).lean();
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const customer = await Customer.findOne({ customerId: transaction.customerId }).lean();

    res.json({
      success: true,
      transaction,
      customer,
    });
  } catch (err) {
    next(err);
  }
};
