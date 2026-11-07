import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { api } from "@/services/api";

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Transactions</h1>
        <p className="text-sm text-slate-500 mt-1">Recent payment activity and recovery status</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Transaction / Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Failure Reason</th>
                <th className="px-4 py-3">Recovery Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((t) => {
                  const attempt = t.recoveryAttempts?.[0];
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-[10px] text-slate-500">{t.id}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(t.createdAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/customers/${t.customer?.id}`}
                          className="font-medium text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          {t.customer?.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        ₹{(t.amount / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                            t.status === "SUCCESS" || t.status === "RECOVERED"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : t.status === "FAILED"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {t.failureReason ? t.failureReason.replace(/_/g, " ") : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {attempt ? (
                          <div>
                            <div className="text-xs font-medium text-slate-900">
                              {attempt.status.replace(/_/g, " ")}
                            </div>
                            <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
                              {attempt.action?.replace(/_/g, " ")}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {attempt ? (
                          <Link
                            to={`/recoveries/${attempt.id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
