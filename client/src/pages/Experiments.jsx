import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Beaker, Play, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { api } from "@/services/api";

export function Experiments() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getExperiments().then((data) => {
      if (data.runs) setRuns(data.runs);
      setLoading(false);
    });
  }, []);

  const runExperiment = async () => {
    setRunning(true);
    try {
      const data = await api.runExperiment();
      if (data.success && data.run) {
        navigate(`/experiments/${data.run.id}`);
      } else {
        alert("Failed to run experiment");
        setRunning(false);
      }
    } catch (e) {
      console.error(e);
      setRunning(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center py-12 px-4 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20"></div>

        <Beaker className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          Does Revora AI actually recover more revenue?
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          Run a controlled holdout evaluation of Revora AI against a conventional fixed-retry baseline on a synthetic dataset of 1,000 failed payments.
        </p>

        <button
          onClick={runExperiment}
          disabled={running}
          className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          {running ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              EVALUATING 1,000 FAILED PAYMENTS...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              RUN NEW EXPERIMENT
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-12 mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Recent Experiments</h2>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        </div>
      ) : runs.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-slate-500">No experiments run yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {runs.map((run) => (
            <Link
              to={`/experiments/${run.id}`}
              key={run.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-900">{run.name}</span>
                </div>
                <div className="text-sm text-slate-500 flex gap-4">
                  <span>Seed: {run.seed}</span>
                  <span>{new Date(run.startedAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
                    Incremental Revenue
                  </div>
                  <div className="font-bold text-emerald-600 text-lg">
                    +₹{(run.incrementalRevenue / 100).toFixed(2)}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
