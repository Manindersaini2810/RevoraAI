import { useState } from "react";
import { Play, ShieldCheck, Loader2, UserCheck, BugPlay } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";

export function DemoButtons({ onDemoTriggered }) {
  const [loading, setLoading] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const navigate = useNavigate();

  const runDemo = async (type) => {
    setLoading(type);
    setTestResult(null);
    try {
      const data = await api.runRecoveryDemo(type);
      if (data.recoveryAttemptId || data.id) {
        if (onDemoTriggered) onDemoTriggered();
        navigate(`/recoveries/${data.recoveryAttemptId || data.id}`);
      } else if (data.error) {
        alert(`Demo result: ${data.error}`);
        setLoading(null);
      } else {
        navigate("/recoveries");
        setLoading(null);
      }
    } catch (e) {
      console.error(e);
      alert("Demo failed to run. Check console.");
      setLoading(null);
    }
  };

  const runResilienceTest = async (test) => {
    setTestResult(null);
    try {
      const result = await api.runResilienceTest(test);
      setTestResult(result);
    } catch (e) {
      console.error(e);
      setTestResult("Test failed to run. Check console.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => runDemo("success")}
          disabled={!!loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center shadow-sm disabled:opacity-50"
        >
          {loading === "success" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Success Demo
        </button>

        <button
          onClick={() => runDemo("safety")}
          disabled={!!loading}
          className="px-4 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center disabled:opacity-50"
        >
          {loading === "safety" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4 mr-2 text-slate-500" />
          )}
          Safety Demo
        </button>

        <button
          onClick={() => runDemo("approval")}
          disabled={!!loading}
          className="px-4 py-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 flex items-center disabled:opacity-50"
        >
          {loading === "approval" ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <UserCheck className="w-4 h-4 mr-2 text-amber-600" />
          )}
          Human Approval Demo
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200/50">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1">
          <BugPlay className="w-3.5 h-3.5" /> Resilience Tests (Live Checks)
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => runResilienceTest("duplicate-webhook")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium border border-slate-200"
          >
            Duplicate Webhook
          </button>
          <button
            onClick={() => runResilienceTest("malicious-ai")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium border border-slate-200"
          >
            Invalid Execution
          </button>
          <button
            onClick={() => runResilienceTest("stale-approval")}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium border border-slate-200"
          >
            Stale Approval
          </button>
        </div>

        {testResult && (
          <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-700 whitespace-pre-wrap">
            {testResult}
          </div>
        )}
      </div>
    </div>
  );
}
