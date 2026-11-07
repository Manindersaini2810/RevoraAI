import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import {
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  ArrowRight,
  TrendingUp,
  CreditCard,
  MessageSquare,
  Play,
} from "lucide-react";

export function RecoveryBatches() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const data = await api.getRecoveryBatches();
      setBatches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchNewBatch = async () => {
    setCreating(true);
    try {
      await api.triggerRiskCasePlaybook("RC-001");
      await loadBatches();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const totalTarget = batches.reduce((acc, b) => acc + (b.targetAmount || 0), 0);
  const totalRecovered = batches.reduce((acc, b) => acc + (b.recoveredAmount || 0), 0);
  const totalTxns = batches.reduce((acc, b) => acc + (b.targetCount || 0), 0);
  const totalRecoveredTxns = batches.reduce((acc, b) => acc + (b.recoveredCount || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Recovery Batches
            </h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
              {batches.length} batches
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Autonomous multi-channel recovery workflows executed under Policy Guardian guardrails.
          </p>
        </div>

        <button
          onClick={handleLaunchNewBatch}
          disabled={creating}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90 transition-opacity cursor-pointer shrink-0"
        >
          {creating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-current" />
          )}
          <span>Launch AI Recovery Batch</span>
        </button>
      </div>

      {/* KPI Ribbons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Batch Target Revenue</span>
          <div className="text-xl font-bold tracking-tight text-foreground mt-1">
            {formatCurrency(totalTarget)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">{totalTxns} failed transactions</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Recovered Revenue</span>
          <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalRecovered)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {totalRecoveredTxns} payments rescued
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Overall Batch Efficiency</span>
          <div className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400 mt-1">
            {totalTarget > 0 ? `${Math.round((totalRecovered / totalTarget) * 100)}%` : "0%"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Automated settlement rate</p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Policy Adherence</span>
          <div className="text-xl font-bold tracking-tight text-foreground mt-1">
            100%
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Zero unapproved financial actions</p>
        </div>
      </div>

      {/* Batches Table / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground/60" />
            Loading recovery batches...
          </div>
        ) : (
          batches.map((batch) => {
            const pct =
              batch.targetAmount > 0
                ? Math.round((batch.recoveredAmount / batch.targetAmount) * 100)
                : 0;

            return (
              <div
                key={batch.id}
                className="rounded-xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-foreground px-2 py-0.5 rounded bg-muted border border-border/80">
                      {batch.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${
                        batch.status === "PROCESSING"
                          ? "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
                          : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      }`}
                    >
                      {batch.status}
                    </span>
                    {batch.caseId && (
                      <Link
                        to="/risk-cases"
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-mono"
                      >
                        Ref: {batch.caseId}
                      </Link>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground tracking-tight">
                    {batch.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Strategy: <strong className="text-foreground">{batch.strategy}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                      Channels: <strong className="text-foreground">{batch.channel}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/60" />
                      Started {new Date(batch.startedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                {/* Progress & Values */}
                <div className="md:w-64 shrink-0 space-y-2 border-t md:border-t-0 md:border-l border-border/80 pt-3 md:pt-0 md:pl-5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress:</span>
                    <span className="font-bold text-foreground font-mono">
                      {batch.recoveredCount} / {batch.targetCount} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Recovered:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(batch.recoveredAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
