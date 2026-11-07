import { ShieldCheck, ShieldAlert, Check, X, ShieldQuestion } from "lucide-react";

export function PolicyCard({ policy, action }) {
  if (!policy) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center h-48 border-dashed border-2">
        <ShieldCheck className="w-8 h-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-medium text-slate-900">Policy Check Pending</h3>
        <p className="text-xs text-slate-500 mt-1">Waiting for AI decision...</p>
      </div>
    );
  }

  const isApproved = policy.allowed && !policy.requiresHumanApproval;
  const isBlocked = !policy.allowed;
  const isPending = policy.allowed && policy.requiresHumanApproval;

  return (
    <div
      className={`card overflow-hidden border-2 ${
        isApproved
          ? "border-emerald-500"
          : isBlocked
          ? "border-red-500"
          : "border-amber-500"
      }`}
    >
      <div
        className={`p-4 flex items-center justify-between text-white ${
          isApproved
            ? "bg-emerald-500"
            : isBlocked
            ? "bg-red-500"
            : "bg-amber-500"
        }`}
      >
        <div className="flex items-center gap-2 font-medium text-sm">
          {isApproved && <ShieldCheck className="w-5 h-5" />}
          {isBlocked && <ShieldAlert className="w-5 h-5" />}
          {isPending && <ShieldQuestion className="w-5 h-5" />}
          POLICY GUARDIAN
        </div>
        <div className="text-xs font-bold tracking-wider px-2 py-1 bg-white/20 rounded">
          {isApproved ? "APPROVED" : isBlocked ? "BLOCKED" : "HUMAN APPROVAL REQUIRED"}
        </div>
      </div>

      <div className="p-5">
        {isApproved && (
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Amount within autonomous limit
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Recovery attempt within bounds
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> Transaction state valid
            </div>
            {action && (
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {action.replace(/_/g, " ")} policy passed
              </div>
            )}
          </div>
        )}

        {isBlocked && (
          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-red-600 uppercase tracking-wider mb-1">
                Reason
              </div>
              <div className="text-sm font-medium text-slate-900">
                {policy.reason || "Violated hardcoded rules"}
              </div>
            </div>
            {policy.blockedRules && policy.blockedRules.length > 0 && (
              <div className="space-y-2 text-sm text-slate-700 mt-4 pt-4 border-t border-slate-100">
                {policy.blockedRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <X className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="font-medium text-red-800">{rule}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isPending && (
          <div className="space-y-3">
            <div className="text-sm font-medium text-amber-900">{policy.reason}</div>
            <p className="text-xs text-amber-700">
              This action exceeds the merchant&apos;s configured risk threshold or autonomous limits and requires manual authorization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
