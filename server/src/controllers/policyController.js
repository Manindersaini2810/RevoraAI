import { MerchantPolicy } from "../models/MerchantPolicy.js";

export const getPolicy = async (req, res, next) => {
  try {
    let policy = await MerchantPolicy.findOne().lean();
    if (!policy) {
      policy = await MerchantPolicy.create({
        policyId: "pol_fitprime_001",
        merchantId: "merch_fitprime_001",
      });
    }
    res.json({ success: true, policy });
  } catch (err) {
    next(err);
  }
};

export const updatePolicy = async (req, res, next) => {
  try {
    let policy = await MerchantPolicy.findOne();
    if (!policy) {
      policy = new MerchantPolicy({
        policyId: "pol_fitprime_001",
        merchantId: "merch_fitprime_001",
      });
    }

    Object.assign(policy, req.body);
    await policy.save();

    res.json({ success: true, message: "Policy Guardian configuration updated", policy });
  } catch (err) {
    next(err);
  }
};
