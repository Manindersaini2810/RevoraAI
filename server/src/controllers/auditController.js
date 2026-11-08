import { AuditLog } from "../models/AuditLog.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { actor, eventType, limit = 100 } = req.query;
    const query = {};

    if (actor && actor !== "ALL") query.actor = actor;
    if (eventType) query.eventType = eventType;

    const logs = await AuditLog.find(query).sort({ createdAt: -1 }).limit(Number(limit)).lean();
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};
