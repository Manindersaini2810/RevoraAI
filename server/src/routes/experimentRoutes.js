import { Router } from "express";
import { getExperiments, getExperimentById, runExperiment } from "../controllers/experimentController.js";

const router = Router();
router.get("/", getExperiments);
router.get("/:id", getExperimentById);
router.post("/run", runExperiment);

export default router;
