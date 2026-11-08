import { Router } from "express";
import { getRiskCases, getRiskCaseById, triggerRiskPlaybook } from "../controllers/riskCaseController.js";

const router = Router();
router.get("/", getRiskCases);
router.get("/:id", getRiskCaseById);
router.post("/:id/playbook", triggerRiskPlaybook);

export default router;
