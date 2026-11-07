import { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "@/services/api";

export function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs().then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Audit Trail</h1>
        <p className="text-sm text-slate-500 mt-1">Chronological history of all system events and decisions</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium text-xs border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Event Type</th>
                <th className="px-6 py-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <ShieldCheck className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${
                          log.actor === "AI_AGENT"
                            ? "bg-indigo-100 text-indigo-700"
                            : log.actor === "POLICY_GUARDIAN"
                            ? "bg-emerald-100 text-emerald-700"
                            : log.actor === "RAZORPAY"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {log.actor}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 text-xs">
                      {log.eventType ? log.eventType.replace(/_/g, " ") : ""}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {log.message}
                      {log.transactionId && (
                        <div className="text-xs text-slate-400 mt-1 font-mono">
                          Tx: {log.transactionId}
                          {log.recoveryAttemptId && ` • Attempt: ${log.recoveryAttemptId}`}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
