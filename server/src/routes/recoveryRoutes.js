import { Router } from "express";
import { getRecoveries, getRecoveryById, approveRecovery, rejectRecovery } from "../controllers/recoveryController.js";

const router = Router();
router.get("/", getRecoveries);
router.get("/:id", getRecoveryById);
router.post("/:id/approve", approveRecovery);
router.post("/:id/reject", rejectRecovery);

export default router;
