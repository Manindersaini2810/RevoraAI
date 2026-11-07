import { useState, useEffect } from "react";
import { ShieldCheck, Banknote, RotateCcw, Loader2 } from "lucide-react";
import { api } from "@/services/api";

export function Settings() {
  const [policy, setPolicy] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPolicy().then((data) => {
      setPolicy(data);
      setLoading(false);
    });
  }, []);

  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all demo datasets? This deletes all existing transactions, customers, audit logs, and experiment runs, and seeds exactly the 4 deterministic profiles required for judging."
      )
    ) {
      return;
    }

    setResetting(true);
    try {
      await api.resetDemoData();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (e) {
      console.error(e);
      alert("Failed to reset dataset");
      setResetting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Merchant configuration and Policy Guardian rules
        </p>
      </div>

      {!policy ? (
        <div className="card p-12 text-center text-slate-500">
          No active merchant policy found.
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Autonomous Recovery Settings
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                    Status
                  </label>
                  <div className="font-medium text-emerald-600">
                    {policy.isActive ? "Enabled" : "Disabled"}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                    Max Autonomous Amount
                  </label>
                  <div className="font-medium text-slate-900">
                    ₹{(policy.maxAutonomousAmount / 100).toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Amounts above this require human approval
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                    Max Automated Attempts
                  </label>
                  <div className="font-medium text-slate-900">
                    {policy.maxAutomatedAttempts} per transaction
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider block mb-1">
                    Max Customer Contacts
                  </label>
                  <div className="font-medium text-slate-900">
                    {policy.maxContactsPer24Hours} per 24 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-indigo-500" />
              Recovery Strategies
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-medium text-slate-900">Payment Links</div>
                  <div className="text-sm text-slate-500">
                    Allow AI to generate and send Razorpay Payment Links
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    policy.allowPaymentLinks
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {policy.allowPaymentLinks ? "ENABLED" : "DISABLED"}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div>
                  <div className="font-medium text-slate-900">Automated Retry</div>
                  <div className="text-sm text-slate-500">
                    Allow AI to automatically retry cards on file
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    policy.allowAutomatedRetry
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {policy.allowAutomatedRetry ? "ENABLED" : "DISABLED"}
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 border-red-200 bg-red-50">
            <h2 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-600" />
              Danger Zone
            </h2>
            <p className="text-sm text-red-700 mb-6">
              Reset the entire deterministic demo dataset. This deletes all existing transactions, customers, audit logs, and experiment runs, and seeds exactly the 4 deterministic profiles required for judging.
            </p>
            <button
              onClick={handleReset}
              disabled={resetting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center disabled:opacity-50"
            >
              {resetting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Demo Environment...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Demo Environment
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
