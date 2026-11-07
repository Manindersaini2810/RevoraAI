import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Activity, CheckCircle2 } from "lucide-react";
import { api } from "@/services/api";

export function CustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCustomer(id).then((data) => {
      setCustomer(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading customer profile...</div>;
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800">Customer not found</h2>
        <Link to="/customers" className="text-indigo-600 hover:underline mt-4 inline-block font-medium">
          ← Back to Customers
        </Link>
      </div>
    );
  }

  const txns = customer.transactions || [];
  const recs = customer.recoveryAttempts || [];

  const ltv = txns
    .filter((t) => t.status === "SUCCESS" || t.status === "RECOVERED")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRecovered = recs
    .filter((r) => r.status === "SUCCESS")
    .reduce((sum, r) => sum + (r.amountRecovered || 0), 0);

  return (
    <div className="space-y-8">
      <Link
        to="/customers"
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Customers
      </Link>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{customer.name}</h1>
            <p className="text-sm text-slate-500">{customer.email}</p>
          </div>
        </div>
        <div className="flex gap-6 text-sm text-right">
          <div>
            <div className="text-slate-500 font-medium">Lifetime Value</div>
            <div className="text-xl font-bold text-slate-900">₹{(ltv / 100).toFixed(2)}</div>
          </div>
          <div>
            <div className="text-emerald-600 font-medium">Total Recovered</div>
            <div className="text-xl font-bold text-emerald-600">
              ₹{(totalRecovered / 100).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            Recent Recovery Attempts
          </h2>
          <div className="card divide-y divide-slate-100">
            {recs.map((attempt) => (
              <div key={attempt.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">
                    ₹{(attempt.amountAtRisk / 100).toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(attempt.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      attempt.status === "SUCCESS"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {attempt.status}
                  </div>
                  <Link
                    to={`/recoveries/${attempt.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
            {recs.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No recovery attempts.</div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" />
            Recent Transactions
          </h2>
          <div className="card divide-y divide-slate-100">
            {txns.slice(0, 5).map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-900">₹{(tx.amount / 100).toFixed(2)}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-sm text-slate-700">{tx.status}</div>
              </div>
            ))}
            {txns.length === 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">No transactions found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
