import { BrainCircuit, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";

export function AiDecisionCard({ decision }) {
  if (!decision) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center h-48 border-dashed border-2">
        <BrainCircuit className="w-8 h-8 text-slate-300 mb-3 animate-pulse" />
        <h3 className="text-sm font-medium text-slate-900">AI Analysis Pending</h3>
        <p className="text-xs text-slate-500 mt-1">Revora AI is analyzing the customer context...</p>
      </div>
    );
  }

  const getRiskColor = (level) => {
    switch (level) {
      case "LOW":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "MEDIUM":
        return "text-amber-700 bg-amber-50 border-amber-200";
      case "HIGH":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-slate-700 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
          <BrainCircuit className="w-5 h-5" />
          {decision.metadata?.decisionSource === "DETERMINISTIC FALLBACK" ? (
            <span className="text-amber-600">DETERMINISTIC FALLBACK</span>
          ) : (
            <div className="flex flex-col">
              <span>AI RECOVERY BRAIN</span>
              {decision.metadata?.model && (
                <span className="text-[10px] text-slate-400 font-normal">
                  {decision.metadata.model.includes("nemotron")
                    ? "Nemotron 3 Ultra via OpenRouter"
                    : decision.metadata.model}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          {Math.round(decision.confidence * 100)}% Confidence
        </div>
      </div>

      <div className="p-5 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Diagnosis
            </div>
            <div className="text-sm font-medium text-slate-900">{decision.diagnosis}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Recommended Action
            </div>
            <div className="text-sm font-semibold text-indigo-600">
              {decision.recommendedAction ? decision.recommendedAction.replace(/_/g, " ") : ""}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Expected Recovery
            </div>
            <div className="text-sm font-medium text-emerald-600">
              ₹{(decision.expectedRecovery / 100).toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Risk Level
            </div>
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(
                decision.riskLevel
              )}`}
            >
              {decision.riskLevel === "LOW" && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {decision.riskLevel !== "LOW" && <AlertTriangle className="w-3 h-3 mr-1" />}
              {decision.riskLevel}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-4">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Customer Context
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {decision.metadata?.customerContextSummary || "No explicit customer context recorded."}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-200">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Business Reasoning
            </div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              &quot;{decision.reasoningSummary}&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
