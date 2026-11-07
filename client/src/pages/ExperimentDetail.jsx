import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Beaker, CheckCircle2, ShieldAlert } from "lucide-react";
import { api } from "@/services/api";

export function ExperimentDetail() {
  const { id } = useParams();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getExperiment(id).then((data) => {
      setRun(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Loading scientific evaluation...</div>;
  }

  if (!run) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Experiment Not Found</h2>
        <Link to="/experiments" className="text-indigo-600 hover:underline mt-4 inline-block font-medium">
          ← Back to Experiment Lab
        </Link>
      </div>
    );
  }

  const cases = run.cases || [];

  return (
    <div className="space-y-8 pb-12">
      <Link
        to="/experiments"
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Experiment Lab
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* HERO RESULT */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">
              Incremental Revenue Recovered
            </h2>
            <div className="text-5xl md:text-6xl font-bold text-emerald-600 tracking-tight mb-2">
              +₹{(run.incrementalRevenue / 100).toFixed(2)}
            </div>

            {run.incrementalRevenue > 0 && run.recoverOSAttempts <= run.baselineAttempts && (
              <p className="text-emerald-700 text-lg mb-8 font-medium">
                Revora AI recovered ₹{(run.incrementalRevenue / 100).toFixed(0)} more revenue using fewer, targeted interventions.
              </p>
            )}
            {run.incrementalRevenue > 0 && run.recoverOSAttempts > run.baselineAttempts && (
              <p className="text-emerald-700 text-lg mb-8 font-medium">
                Revora AI recovered ₹{(run.incrementalRevenue / 100).toFixed(0)} more revenue using highly targeted interventions.
              </p>
            )}
            {run.incrementalRevenue <= 0 && (
              <p className="text-slate-500 text-lg mb-8">Revora AI vs Fixed Retry Strategy</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-slate-100">
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Revora AI</div>
                <div className="font-semibold text-slate-900 text-xl">
                  ₹{(run.recoverOSRevenueRecovered / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Baseline</div>
                <div className="font-semibold text-slate-900 text-xl">
                  ₹{(run.baselineRevenueRecovered / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Total Risk</div>
                <div className="font-semibold text-slate-900 text-xl">
                  ₹{(run.totalRevenueAtRisk / 100).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-medium mb-1">Improvement</div>
                <div className="font-bold text-emerald-600 text-xl">
                  +{Number(run.incrementalRecoveryRate).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* SECONDARY METRICS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Recovery Rate</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-500">Baseline</span>
                    <span className="text-slate-900">
                      {Number(run.baselineRecoveryRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full">
                    <div
                      className="bg-slate-400 h-2 rounded-full"
                      style={{ width: `${run.baselineRecoveryRate}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span className="text-slate-900">Revora AI</span>
                    <span className="text-emerald-600">
                      {Number(run.recoverOSRecoveryRate).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full">
                    <div
                      className="bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${run.recoverOSRecoveryRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Intervention Efficiency</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Baseline Attempts</span>
                  <span className="font-medium text-slate-900">{run.baselineAttempts}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500">Revora AI Attempts</span>
                  <span className="font-medium text-slate-900">{run.recoverOSAttempts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Net Revenue (Revora AI)</span>
                  <span className="font-medium text-emerald-600">
                    ₹{(run.netRecoveredRevenueRecoverOS / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CASE EXPLORER */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Explorer (Sample)</h3>
            <div className="card overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-medium text-xs border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Failure Reason</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Baseline</th>
                    <th className="px-4 py-3">Revora AI Action</th>
                    <th className="px-4 py-3">Policy</th>
                    <th className="px-4 py-3">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {c.failureReason.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3">₹{(c.amount / 100).toFixed(0)}</td>
                      <td className="px-4 py-3">
                        {c.baselineSuccess ? (
                          <span className="text-emerald-600 font-medium">Recovered</span>
                        ) : (
                          <span className="text-slate-400">Failed</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-indigo-600 font-medium">
                        {c.recoverOSAction.replace(/_/g, " ")}
                      </td>
                      <td className="px-4 py-3">
                        {c.recoverOSPolicyResult === "APPROVED" ? (
                          <span className="text-emerald-600">
                            <CheckCircle2 className="w-4 h-4 inline" />
                          </span>
                        ) : (
                          <span className="text-red-500 text-xs font-medium">
                            {c.recoverOSPolicyResult}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {c.recoverOSSuccess ? (
                          <span className="text-emerald-600 font-medium">Recovered</span>
                        ) : (
                          <span className="text-slate-400">Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="card p-6 bg-slate-900 text-slate-300">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-indigo-400" />
              Experiment Integrity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Dataset</span>
                <span className="text-white font-medium">{run.sampleSize} holdout cases</span>
              </div>
              <div className="flex justify-between">
                <span>Seed</span>
                <span className="text-white font-mono">{run.seed}</span>
              </div>
              <div className="flex justify-between">
                <span>Baseline</span>
                <span className="text-white font-medium">Fixed Retry v1</span>
              </div>
              <div className="flex justify-between">
                <span>Revora AI</span>
                <span className="text-white font-medium">Policy Engine v1</span>
              </div>
              <div className="flex justify-between">
                <span>Attribution</span>
                <span className="text-white font-medium">72 hours strict</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-400">
                Deterministic execution ensures 100% reproducible scientific evaluation.
              </div>
            </div>
          </div>

          <div className="card p-6 border-amber-200 bg-amber-50">
            <h3 className="font-semibold text-amber-900 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              Policy Safety
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">Actions Blocked</span>
                <span className="font-bold text-amber-700">{run.policyBlocks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">Human Escalations</span>
                <span className="font-bold text-amber-700">{run.humanEscalations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-800">Stopped Interventions</span>
                <span className="font-bold text-amber-700">{run.stoppedRecoveries}</span>
              </div>
              <p className="text-xs text-amber-700 mt-2">
                Revora AI intentionally halts low-probability or high-risk recoveries to protect the merchant brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
