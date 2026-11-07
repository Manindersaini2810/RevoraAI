import { ShieldAlert, CheckCircle2, Play } from "lucide-react";
import { Link } from "react-router-dom";

export function LiveRecoveryFeed({ recoveries }) {
  if (!recoveries || recoveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <Play className="w-5 h-5 text-slate-300" />
        </div>
        <h3 className="text-sm font-medium text-slate-600">No active workflows</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Run a demo to see Revora AI autonomously process failed payments in real-time.
        </p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS":
        return "text-emerald-700 bg-emerald-100 ring-emerald-600/20";
      case "POLICY_BLOCKED":
        return "text-red-700 bg-red-100 ring-red-600/20";
      case "FAILED":
        return "text-red-700 bg-red-100 ring-red-600/20";
      case "PENDING_APPROVAL":
        return "text-amber-700 bg-amber-100 ring-amber-600/20";
      case "WAITING_FOR_CUSTOMER":
        return "text-blue-700 bg-blue-100 ring-blue-600/20";
      default:
        return "text-indigo-700 bg-indigo-100 ring-indigo-600/20";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "SUCCESS":
        return "RECOVERED";
      case "WAITING_FOR_CUSTOMER":
        return "WAITING FOR CUSTOMER";
      case "POLICY_BLOCKED":
        return "BLOCKED BY POLICY";
      case "PENDING_APPROVAL":
        return "NEEDS APPROVAL";
      default:
        return "RECOVERING";
    }
  };

  return (
    <div className="space-y-4">
      {recoveries.map((r) => {
        const customerName =
          r.transaction?.customer?.name || r.customer?.name || "Customer";
        const failureReason =
          r.transaction?.failureReason?.replace(/_/g, " ") || "PAYMENT FAILURE";

        return (
          <div
            key={r.id}
            className="card p-4 transition-all hover:shadow-md border-l-4 group"
            style={{
              borderLeftColor:
                r.status === "SUCCESS"
                  ? "#10b981"
                  : r.status === "POLICY_BLOCKED"
                  ? "#ef4444"
                  : "#6366f1",
            }}
          >
            <div className="flex flex-col md:flex-row justify-between gap-4 relative z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(
                      r.status
                    )}`}
                  >
                    {r.status === "SUCCESS" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {r.status === "POLICY_BLOCKED" && <ShieldAlert className="w-3 h-3 mr-1" />}
                    {!["SUCCESS", "POLICY_BLOCKED", "STOPPED", "FAILED", "ESCALATED"].includes(
                      r.status
                    ) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                    )}
                    {getStatusLabel(r.status)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(r.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mt-3">
                  <h3 className="text-lg font-semibold text-slate-900 uppercase tracking-tight">
                    {customerName}
                  </h3>
                  <span className="text-sm font-medium text-slate-500">
                    ₹{(r.amountAtRisk / 100).toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                  <span className="text-slate-400 uppercase tracking-widest text-[10px]">
                    FAILED:
                  </span>{" "}
                  {failureReason}
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="space-y-2 border-l border-slate-200 pl-4 py-1">
                  {r.auditLogs?.map((log, idx) => (
                    <div key={log.id} className="relative">
                      <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-indigo-200 ring-4 ring-white" />
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] text-slate-400 font-mono mt-0.5 whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                        <span
                          className={`text-xs ${
                            idx === 0 ? "text-slate-900 font-medium" : "text-slate-500"
                          }`}
                        >
                          {log.message}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!r.auditLogs || r.auditLogs.length === 0) && (
                    <span className="text-xs text-slate-400 italic">
                      Initializing workflow...
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center md:pl-4">
                <Link
                  to={`/recoveries/${r.id}`}
                  className="w-full md:w-auto px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors text-center shadow-sm whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
