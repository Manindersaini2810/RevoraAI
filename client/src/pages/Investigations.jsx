import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import {
  FileSearch,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  RefreshCw,
  ExternalLink,
  Zap,
  Activity,
  Layers,
  Check,
  Send,
} from "lucide-react";

export function Investigations() {
  const { id } = useParams();
  const investigationId = id || "INV-001";
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await api.getInvestigation(investigationId);
        setInvestigation(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [investigationId]);

  if (loading) {
    return (
      <div className="p-16 text-center">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
        <p className="text-xs text-muted-foreground mt-2">Loading AI investigation telemetry...</p>
      </div>
    );
  }

  if (!investigation) {
    return (
      <div className="p-12 text-center border border-dashed border-border rounded-xl">
        <p className="text-sm font-semibold text-foreground">Investigation report not found</p>
        <Link to="/risk-cases" className="text-xs text-indigo-600 hover:underline mt-2 inline-block">
          Return to Risk Cases
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <Link
            to="/risk-cases"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Risk Cases</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-xs font-semibold text-foreground font-mono">
            {investigation.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
            ACTIVE INCIDENT
          </span>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                {investigation.id}
              </span>
              <span className="text-xs text-muted-foreground">Linked to</span>
              <Link
                to="/risk-cases"
                className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {investigation.caseId}
              </Link>
            </div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              {investigation.title}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              Detected {new Date(investigation.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • Real-time Anomaly Tracking
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDispatched(true)}
              disabled={dispatched}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                dispatched
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90"
              }`}
            >
              {dispatched ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Playbook Dispatched</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Execute Playbook</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Financial Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-border/80">
          <div>
            <span className="text-[11px] text-muted-foreground">Failure Spike</span>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400 font-mono">
              {investigation.failureRate}{" "}
              <span className="text-[10px] text-muted-foreground font-normal">
                (base {investigation.baselineFailureRate})
              </span>
            </div>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground">Transactions Impacted</span>
            <div className="text-lg font-bold text-foreground font-mono">
              {investigation.totalImpacted}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground">Revenue at Risk</span>
            <div className="text-lg font-bold text-foreground font-mono">
              {formatCurrency(investigation.revenueAtRisk)}
            </div>
          </div>
          <div>
            <span className="text-[11px] text-muted-foreground">Actual Recovered</span>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {formatCurrency(investigation.actualRecovered)}{" "}
              <span className="text-[10px] font-normal">
                ({investigation.recoveryProgressPercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Diagnosis & Telemetry Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Root Cause & Telemetry Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Root Cause Card */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                AI Agent Root Cause Analysis
              </h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {investigation.rootCauseSummary}
            </p>

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3 text-xs text-foreground space-y-1.5">
              <span className="font-semibold text-purple-700 dark:text-purple-300">
                AI Reasoning Summary:
              </span>
              <p className="text-muted-foreground">
                High frequency of HTTP 504 and UPI_GATEWAY_TIMEOUT codes recorded exclusively against HDFC (@okhdfcbank) and SBI (@oksbi) handle formats. ICICI and Axis handles during the same timeframe experienced nominal success rates (&gt;96%).
              </p>
            </div>
          </div>

          {/* Telemetry Breakdown Table */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-500" />
                <h2 className="text-sm font-bold text-foreground tracking-tight">
                  Gateway Node Telemetry
                </h2>
              </div>
              <span className="text-[11px] text-muted-foreground">1-second sample interval</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground font-medium">
                    <th className="pb-2">Node / Provider</th>
                    <th className="pb-2">Volume</th>
                    <th className="pb-2">Failure Rate</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {investigation.telemetryBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 font-mono text-muted-foreground">{item.count} txns</td>
                      <td className="py-2.5 font-mono font-bold">
                        <span
                          className={
                            item.status === "DEGRADED"
                              ? "text-rose-600 dark:text-rose-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }
                        >
                          {item.failureRate}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === "DEGRADED"
                              ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chronological Incident Timeline */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                Incident &amp; Autonomous Action Timeline
              </h2>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {investigation.timeline.map((step, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 ring-4 ring-card"></div>
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-foreground">{step.time}</span>
                      <span className="font-semibold text-foreground">{step.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Policy Guardian & Playbook Action */}
        <div className="space-y-6">
          {/* Policy Guardian Verification */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                Policy Guardian Check
              </h2>
            </div>
            <p className="text-xs text-muted-foreground">
              Automated actions bounded by merchant financial safety parameters.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span className="text-muted-foreground">Autonomous Limit:</span>
                <span className="font-bold text-foreground">₹500.00 / txn</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span className="text-muted-foreground">Batch Retry Max:</span>
                <span className="font-bold text-foreground">2 attempts max</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                <span className="text-muted-foreground">Approval Status:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Auto-Approved
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Playbook */}
          <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-foreground tracking-tight">
                Recommended Playbook
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="font-semibold text-foreground">Dynamic Routing:</span>
                <p className="text-muted-foreground mt-0.5">
                  {investigation.recommendedPlaybook.routingRecommendation}
                </p>
              </div>
              <div>
                <span className="font-semibold text-foreground">Customer Outreach:</span>
                <p className="text-muted-foreground mt-0.5">
                  {investigation.recommendedPlaybook.customerAction}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/recovery"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90 transition-opacity"
              >
                <span>View Recovery Batches</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
