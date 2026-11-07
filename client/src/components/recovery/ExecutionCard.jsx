import { Play, CheckCircle2, ShieldBan, ExternalLink, RefreshCw, XCircle } from "lucide-react";

export function ExecutionCard({ attempt, paymentLink }) {
  if (!attempt) return null;

  if (
    attempt.status === "PROPOSED" ||
    attempt.status === "ANALYZING" ||
    attempt.status === "ANALYSIS_COMPLETE" ||
    attempt.status === "POLICY_CHECKING"
  ) {
    return (
      <div className="card p-6 flex flex-col items-center justify-center text-center h-48 border-dashed border-2">
        <Play className="w-8 h-8 text-slate-300 mb-3" />
        <h3 className="text-sm font-medium text-slate-900">Execution Pending</h3>
        <p className="text-xs text-slate-500 mt-1">Waiting for approval...</p>
      </div>
    );
  }

  if (attempt.status === "POLICY_BLOCKED" || attempt.status === "STOPPED") {
    return (
      <div className="card overflow-hidden border-2 border-slate-200">
        <div className="p-4 bg-slate-100 flex items-center justify-between text-slate-700">
          <div className="flex items-center gap-2 font-medium text-sm">
            <ShieldBan className="w-5 h-5" />
            EXECUTION PREVENTED
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-white rounded border border-slate-200">
            {attempt.status === "STOPPED" ? "STOPPED" : "BLOCKED"}
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-sm font-medium text-slate-900">No external action executed</div>
              <p className="text-sm text-slate-500 mt-1">
                Revora AI intentionally halted the workflow to protect customer experience and comply with merchant policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isExecuted = ["EXECUTED", "WAITING_FOR_CUSTOMER", "SUCCESS"].includes(attempt.status);

  return (
    <div
      className={`card overflow-hidden border-2 ${
        isExecuted ? "border-indigo-500" : "border-slate-200"
      }`}
    >
      <div
        className={`p-4 flex items-center justify-between ${
          isExecuted ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
        }`}
      >
        <div className="flex items-center gap-2 font-medium text-sm">
          {isExecuted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <RefreshCw className="w-5 h-5 animate-spin" />
          )}
          {isExecuted ? "ACTION EXECUTED" : "EXECUTING..."}
        </div>
        <div className="text-xs font-bold tracking-wider px-2 py-1 bg-white/20 rounded">
          {attempt.action}
        </div>
      </div>

      <div className="p-5">
        {paymentLink && (
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div>
              <div className="text-xs font-medium text-indigo-600 uppercase tracking-wider mb-1">
                Generated Payment Link
              </div>
              <div className="text-lg font-semibold text-slate-900">
                ₹{(paymentLink.amount / 100).toFixed(2)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-slate-800 text-white">
                  TEST MODE
                </span>
                <span className="text-xs text-slate-500">{paymentLink.razorpayPaymentLinkId}</span>
              </div>
            </div>
            {paymentLink.shortUrl && (
              <a
                href={paymentLink.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-50 transition-colors text-sm"
              >
                OPEN LINK
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {!paymentLink && isExecuted && (
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <div>
              <div className="text-sm font-medium text-slate-900">
                {attempt.action ? attempt.action.replace(/_/g, " ") : "Action"} successfully executed.
              </div>
              {attempt.executedAt && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {new Date(attempt.executedAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
