import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { api } from "@/services/api";

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Customers</h1>
        <p className="text-sm text-slate-500 mt-1">Customer recovery memory and lifetime value</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">LTV</th>
                <th className="px-4 py-3 text-center">Success / Failed</th>
                <th className="px-4 py-3 text-center">Recovery Attempts</th>
                <th className="px-4 py-3 text-center">Recovered</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-3" />
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const txns = c.transactions || [];
                  const ltv = txns
                    .filter((t) => t.status === "SUCCESS" || t.status === "RECOVERED")
                    .reduce((sum, t) => sum + t.amount, 0);
                  const successfulPayments = txns.filter(
                    (t) => t.status === "SUCCESS" || t.status === "RECOVERED"
                  ).length;
                  const failedPayments = txns.filter((t) => t.status === "FAILED").length;
                  const recoveries = c.recoveryAttempts ? c.recoveryAttempts.length : 0;
                  const successfulRecoveries = c.recoveryAttempts
                    ? c.recoveryAttempts.filter((a) => a.status === "SUCCESS").length
                    : 0;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-medium">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{c.name}</div>
                            <div className="text-[10px] text-slate-500">{c.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-700">
                        ₹{(ltv / 100).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-emerald-600 font-medium">{successfulPayments}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span className="text-red-500 font-medium">{failedPayments}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-600 font-medium">
                        {recoveries}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {recoveries > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {successfulRecoveries} / {recoveries} (
                            {((successfulRecoveries / recoveries) * 100).toFixed(0)}%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/customers/${c.id}`}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          View Profile
                        </Link>
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
