import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingPage } from "@/pages/LandingPage";
import { Dashboard } from "@/pages/Dashboard";
import { RiskCases } from "@/pages/RiskCases";
import { Investigations } from "@/pages/Investigations";
import { RecoveryBatches } from "@/pages/RecoveryBatches";
import { Recoveries } from "@/pages/Recoveries";
import { RecoveryDetail } from "@/pages/RecoveryDetail";
import { Transactions } from "@/pages/Transactions";
import { Customers } from "@/pages/Customers";
import { CustomerDetail } from "@/pages/CustomerDetail";
import { Experiments } from "@/pages/Experiments";
import { ExperimentDetail } from "@/pages/ExperimentDetail";
import { AuditLogs } from "@/pages/AuditLogs";
import { Settings } from "@/pages/Settings";
import { AiAssistant } from "@/pages/AiAssistant";

export default function App() {
  return (
    <Routes>
      {/* Standalone Marketing / Overview Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Authenticated / App Shell Layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/risk-cases" element={<RiskCases />} />
        <Route path="/investigations" element={<Investigations />} />
        <Route path="/investigations/:id" element={<Investigations />} />
        <Route path="/recovery" element={<RecoveryBatches />} />
        <Route path="/recoveries" element={<Recoveries />} />
        <Route path="/recoveries/:id" element={<RecoveryDetail />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/customers/:id" element={<CustomerDetail />} />
        <Route path="/experiments" element={<Experiments />} />
        <Route path="/experiments/:id" element={<ExperimentDetail />} />
        <Route path="/audit" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ai-assistant" element={<AiAssistant />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
