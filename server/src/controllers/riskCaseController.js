import { RiskCase } from "../models/RiskCase.js";
import { AuditLog } from "../models/AuditLog.js";

export const getRiskCases = async (req, res, next) => {
  try {
    const { severity, status, riskType, search } = req.query;
    const query = {};

    if (severity && severity !== "ALL") query.severity = severity;
    if (status && status !== "ALL") query.status = status;
    if (riskType && riskType !== "ALL") query.riskType = riskType;
    if (search) {
      query.$or = [
        { caseId: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
        { bank: { $regex: search, $options: "i" } },
      ];
    }

    const cases = await RiskCase.find(query).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: cases.length, cases });
  } catch (err) {
    next(err);
  }
};

export const getRiskCaseById = async (req, res, next) => {
  try {
    const riskCase = await RiskCase.findOne({ caseId: req.params.id }).lean();
    if (!riskCase) {
      return res.status(404).json({ success: false, message: "Risk case not found" });
    }
    res.json({ success: true, riskCase });
  } catch (err) {
    next(err);
  }
};

export const triggerRiskPlaybook = async (req, res, next) => {
  try {
    const riskCase = await RiskCase.findOne({ caseId: req.params.id });
    if (!riskCase) {
      return res.status(404).json({ success: false, message: "Risk case not found" });
    }

    riskCase.status = "RECOVERING";
    await riskCase.save();

    await AuditLog.create({
      logId: `log_${Date.now()}`,
      eventType: "RISK_PLAYBOOK_DISPATCHED",
      actor: "AI_AGENT",
      message: `Triggered automated recovery playbook for Risk Case ${riskCase.caseId} (${riskCase.title}).`,
    });

    res.json({
      success: true,
      message: "Automated playbook dispatched",
      riskCase,
    });
  } catch (err) {
    next(err);
  }
};
