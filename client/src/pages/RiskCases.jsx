import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";
import { formatCurrency } from "@/lib/utils";
import {
  TriangleAlert,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Zap,
  Building,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Play,
} from "lucide-react";

export function RiskCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [riskType, setRiskType] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  useEffect(() => {
    loadCases();
  }, [search, severity, status, riskType]);

  const loadCases = async () => {
    setLoading(true);
    try {
      const data = await api.getRiskCases({ search, severity, status, riskType });
      setCases(data);
    } catch (err) {
      console.error("Error loading risk cases", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerPlaybook = async (caseId) => {
    setActionLoading(caseId);
    try {
      const res = await api.triggerRiskCasePlaybook(caseId);
      if (res.success) {
        setActionSuccess(`Automated recovery playbook launched for ${caseId}!`);
        await loadCases();
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30";
      case "HIGH":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "MEDIUM":
        return "bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/30";
      case "LOW":
        return "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case "INVESTIGATING":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30";
      case "RECOVERING":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30";
      case "RECOVERY_PLANNED":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30";
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
      default:
        return "bg-neutral-500/10 text-neutral-700 dark:text-neutral-400 border-neutral-500/30";
    }
  };

  const totalAtRisk = cases.reduce((acc, c) => acc + (c.amountAtRisk || 0), 0);
  const totalRecovered = cases.reduce((acc, c) => acc + (c.amountRecovered || 0), 0);
  const totalTransactions = cases.reduce((acc, c) => acc + (c.affectedTransactions || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner / Toast Alert */}
      {actionSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium shadow-sm transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Revenue Risk Cases
            </h1>
            <span className="rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {cases.length} active
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Identify, prioritize, and investigate revenue leakage across merchant payment channels.
          </p>
        </div>

        {/* Latest AI Investigation Callout */}
        <Link
          to="/investigations/INV-001"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90 transition-all shadow-sm shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Latest AI Investigation</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-70" />
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Total Revenue at Risk</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-foreground">
            {formatCurrency(totalAtRisk)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Across {totalTransactions} failed transactions
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Revenue Recovered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatCurrency(totalRecovered)}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Via autonomous payment links &amp; routing
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Average Recovery Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold tracking-tight text-foreground">
            {totalAtRisk > 0 ? `${Math.round((totalRecovered / totalAtRisk) * 100)}%` : "0%"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Target: &gt;60% bounded recovery
          </p>
        </div>

        <div className="rounded-xl border border-border/80 bg-card p-4 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Active Incident</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-sm font-bold tracking-tight text-rose-600 dark:text-rose-400 truncate">
            RC-001 (UPI Latency)
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Policy Guardian: Bounded Execution
          </p>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="rounded-xl border border-border/80 bg-card p-3 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by case ID, title, root cause, or bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          {/* Severity */}
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RECOVERY_PLANNED">Recovery Planned</option>
            <option value="RECOVERING">Recovering</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          {/* Risk Type */}
          <select
            value={riskType}
            onChange={(e) => setRiskType(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-hidden"
          >
            <option value="ALL">All Risk Types</option>
            <option value="PAYMENT_DEGRADATION">Payment Degradation</option>
            <option value="CHECKOUT_ABANDONMENT">Checkout Abandonment</option>
            <option value="SUBSCRIPTION_FAILURES">Subscription Failures</option>
            <option value="GATEWAY_LATENCY">Gateway Latency</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground/60" />
            Loading risk cases telemetry...
          </div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-border rounded-xl">
            <TriangleAlert className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">No matching risk cases found</p>
            <p className="text-xs text-muted-foreground mt-1">Try clearing your filters or search terms.</p>
          </div>
        ) : (
          cases.map((rc) => {
            const recoveryPercent =
              rc.amountAtRisk > 0
                ? Math.round((rc.amountRecovered / rc.amountAtRisk) * 100)
                : 0;

            return (
              <div
                key={rc.id}
                className="rounded-xl border border-border/80 bg-card hover:border-border transition-all shadow-xs p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left & Middle Info */}
                <div className="space-y-3 flex-1 min-w-0">
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-foreground px-2 py-0.5 rounded-md bg-muted border border-border/80">
                      {rc.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold ${getSeverityBadge(rc.severity)}`}>
                      {rc.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${getStatusBadge(rc.status)}`}>
                      {rc.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-60" />
                      {new Date(rc.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Title and summary */}
                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight hover:text-indigo-600 transition-colors">
                      <Link to={`/investigations/${rc.investigationId || "INV-001"}`}>
                        {rc.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {rc.summary}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span>{rc.gateway}</span>
                    </div>
                    {rc.bank && (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-muted-foreground/70" />
                        <span>{rc.bank}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <TriangleAlert className="w-3.5 h-3.5 text-amber-500/80" />
                      <span>{rc.affectedTransactions} transactions impacted</span>
                    </div>
                  </div>

                  {/* AI Root Cause Diagnosis Box */}
                  <div className="rounded-lg bg-muted/40 border border-border/60 p-2.5 text-xs flex items-start gap-2 text-foreground/90">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-foreground">AI Diagnosis: </span>
                      <span className="text-muted-foreground">{rc.aiDiagnosis}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Financials & CTAs */}
                <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-border/80 pt-4 lg:pt-0 lg:pl-6 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground font-medium">Revenue At Risk:</span>
                      <span className="font-bold text-foreground font-mono">
                        {formatCurrency(rc.amountAtRisk)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Recovered:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatCurrency(rc.amountRecovered)} ({recoveryPercent}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, recoveryPercent)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      to={`/investigations/${rc.investigationId || "INV-001"}`}
                      className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span>AI Report</span>
                    </Link>

                    {rc.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleTriggerPlaybook(rc.id)}
                        disabled={actionLoading === rc.id || rc.status === "RECOVERING"}
                        className={`flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all cursor-pointer ${
                          rc.status === "RECOVERING"
                            ? "bg-blue-600 hover:bg-blue-700 opacity-90"
                            : "bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-950 hover:opacity-90"
                        }`}
                      >
                        {actionLoading === rc.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : rc.status === "RECOVERING" ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Recovering</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Playbook</span>
                          </>
                        )}
                      </button>
                    )}
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
