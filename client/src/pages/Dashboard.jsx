import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Zap,
  ShieldAlert,
  Users,
  ShieldCheck,
  Info,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DemoButtons } from "@/components/dashboard/DemoButtons";
import { LiveRecoveryFeed } from "@/components/recovery/LiveRecoveryFeed";
import { api } from "@/services/api";

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-44 bg-slate-200 rounded-2xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 rounded-xl"></div>
          <div className="h-28 bg-slate-200 rounded-xl"></div>
          <div className="h-28 bg-slate-200 rounded-xl"></div>
          <div className="h-28 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const revenueAtRisk = stats.revenueAtRisk || 0;
  const revenueRecovered = stats.revenueRecovered || 0;
  const recoveryRate = stats.recoveryRate || 0;
  const activeRecoveries = stats.activeRecoveries || 0;
  const humanEscalations = stats.humanEscalations || 0;
  const blockedAttempts = stats.blockedAttempts || 0;
  const strategies = stats.strategies || [];
  const allRecovered = stats.recentRecoveries || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Razorpay Test Mode Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
        <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span className="font-semibold text-amber-800">RAZORPAY TEST MODE</span>
        <span className="text-amber-700">
          — All payment actions use Razorpay Test Mode. No real money is moved.
        </span>
      </div>

      {/* Hero / Demo Lab */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/2"></div>
        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide mb-4 border border-indigo-100">
            <Zap className="w-3.5 h-3.5" /> DEMO LAB
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Command Center
          </h1>
          <p className="text-base text-slate-500 mt-2 max-w-xl">
            Watch Revora AI autonomously detect revenue at risk, decide how to recover it, safely execute approved actions, and prove the revenue recovered.
          </p>
        </div>
        <div className="z-10 flex-shrink-0">
          <DemoButtons onDemoTriggered={loadData} />
        </div>
      </div>

      {/* Recovery Performance Metrics */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Recovery Performance
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Revenue at Risk"
            value={`₹${(revenueAtRisk / 100).toFixed(2)}`}
            icon={<AlertTriangle className="w-5 h-5" />}
            variant="danger"
          />
          <MetricCard
            label="Revenue Recovered"
            value={`₹${(revenueRecovered / 100).toFixed(2)}`}
            icon={<CheckCircle2 className="w-5 h-5" />}
            variant="success"
          />
          <MetricCard
            label="Recovery Rate"
            value={`${recoveryRate}%`}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <MetricCard
            label="Active Workflows"
            value={activeRecoveries}
            icon={<Zap className="w-5 h-5" />}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="card p-4 flex items-center justify-between bg-amber-50/30 border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">Human Escalations</div>
                <div className="text-xl font-semibold text-slate-900">{humanEscalations}</div>
              </div>
            </div>
          </div>
          <div className="card p-4 flex items-center justify-between bg-red-50/30 border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">Blocked Actions</div>
                <div className="text-xl font-semibold text-slate-900">{blockedAttempts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Metric Definitions */}
        <div className="mt-3 text-[10px] text-slate-400 flex flex-wrap gap-x-6 gap-y-1">
          <span>
            <strong>Revenue at Risk</strong> = sum of failed + recovering + recovered tx amounts
          </span>
          <span>
            <strong>Revenue Recovered</strong> = sum of tx amounts with status RECOVERED
          </span>
          <span>
            <strong>Recovery Rate</strong> = Revenue Recovered / Revenue at Risk × 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between" id="live-feed">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Recovery Feed
            </h2>
            <Link to="/recoveries" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View All
            </Link>
          </div>
          <LiveRecoveryFeed recoveries={allRecovered} />
        </div>

        {/* Strategy Performance */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Strategy Performance</h2>
          <div className="card p-5 space-y-5">
            {strategies.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">
                No recovery attempts yet. Run a demo to see strategy data.
              </p>
            )}
            {strategies.map((s, i) => (
              <div key={s.action} className={i > 0 ? "pt-4 border-t border-slate-100" : ""}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-medium text-slate-900">
                    {s.action.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      s.successRate >= 50
                        ? "text-emerald-600"
                        : s.successRate > 0
                        ? "text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    {s.successRate}% success
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
                  <div
                    className="bg-indigo-500 h-1.5 rounded-full"
                    style={{ width: `${s.successRate}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{s.total} attempts</span>
                  <span>₹{(s.recovered / 100).toFixed(2)} recovered</span>
                </div>
              </div>
            ))}
            <div className="mt-4 text-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                Data from database
              </span>
            </div>
          </div>

          <div className="card p-5 space-y-5 bg-slate-900 border-slate-800 text-white mt-8">
            <h3 className="font-semibold flex items-center gap-2 text-indigo-400">
              <ShieldCheck className="w-5 h-5" /> Autonomy Guardrails
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="text-slate-400 w-24 flex-shrink-0 font-medium text-right">
                  AI
                </div>
                <div className="text-white">PROPOSES</div>
              </div>
              <div className="flex justify-between items-start gap-4 border-t border-slate-800 pt-3">
                <div className="text-slate-400 w-24 flex-shrink-0 font-medium text-right">
                  Policy Guardian
                </div>
                <div className="text-white">APPROVES / BLOCKS</div>
              </div>
              <div className="flex justify-between items-start gap-4 border-t border-slate-800 pt-3">
                <div className="text-slate-400 w-24 flex-shrink-0 font-medium text-right">
                  Executor
                </div>
                <div className="text-white text-emerald-400 font-semibold">
                  EXECUTES ONLY APPROVED ACTIONS
                </div>
              </div>
              <div className="flex justify-between items-start gap-4 border-t border-slate-800 pt-3">
                <div className="text-slate-400 w-24 flex-shrink-0 font-medium text-right">
                  Observer
                </div>
                <div className="text-white">VERIFIES REAL PAYMENT</div>
              </div>
              <div className="flex justify-between items-start gap-4 border-t border-slate-800 pt-3">
                <div className="text-slate-400 w-24 flex-shrink-0 font-medium text-right">
                  Audit Trail
                </div>
                <div className="text-white">RECORDS EVERYTHING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
