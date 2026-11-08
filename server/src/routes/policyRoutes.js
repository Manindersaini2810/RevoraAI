import { Router } from "express";
import { getPolicy, updatePolicy } from "../controllers/policyController.js";
import { validate } from "../middleware/validate.js";
import { updatePolicySchema } from "../validations/schemas.js";

const router = Router();
router.get("/", getPolicy);
router.put("/", validate(updatePolicySchema), updatePolicy);

export default router;
