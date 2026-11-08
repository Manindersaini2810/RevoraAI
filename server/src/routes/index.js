import { Router } from "express";
import authRoutes from "./authRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import recoveryRoutes from "./recoveryRoutes.js";
import customerRoutes from "./customerRoutes.js";
import riskCaseRoutes from "./riskCaseRoutes.js";
import experimentRoutes from "./experimentRoutes.js";
import policyRoutes from "./policyRoutes.js";
import auditRoutes from "./auditRoutes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/dashboard", dashboardRoutes);
apiRouter.use("/transactions", transactionRoutes);
apiRouter.use("/recoveries", recoveryRoutes);
apiRouter.use("/customers", customerRoutes);
apiRouter.use("/risk-cases", riskCaseRoutes);
apiRouter.use("/experiments", experimentRoutes);
apiRouter.use("/policies", policyRoutes);
apiRouter.use("/audit", auditRoutes);

export default apiRouter;
