import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { AiDecisionCard } from "@/components/recovery/AiDecisionCard";
import { PolicyCard } from "@/components/recovery/PolicyCard";
import { ExecutionCard } from "@/components/recovery/ExecutionCard";
import { api } from "@/services/api";

export function RecoveryDetail() {
  const { id } = useParams();
  const [attemptState, setAttemptState] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAttempt = async () => {
    try {
      const data = await api.getRecovery(id);
      setAttemptState(data);
      if (data && data.auditLogs) {
        setLogs(data.auditLogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttempt();
  }, [id]);

  if (loading) {
    return <div className="w-full h-96 bg-slate-100 animate-pulse rounded-xl" />;
  }

  if (!attemptState) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900">Recovery Attempt Not Found</h2>
        <Link to="/dashboard" className="text-indigo-600 hover:underline mt-4 inline-block font-semibold">
          ← Back to Command Center
        </Link>
      </div>
    );
  }

  const status = attemptState.status;
  const transaction = attemptState.transaction || {};
  const customer = attemptState.customer || transaction.customer || { name: "Customer", email: "" };
  const decision = attemptState.recoveryDecision;
  const policy = attemptState.policyDecisions?.[0];
  const paymentLink = attemptState.paymentLinks?.[0];

  const handleApprove = async () => {
    try {
      await api.approveRecovery(attemptState.id);
      loadAttempt();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async () => {
    try {
      await api.rejectRecovery(attemptState.id);
      loadAttempt();
    } catch (e) {
      console.error(e);
    }
  };

  const getPipelineStage = () => {
    const stages = [
      { id: "PROPOSED", label: "REVENUE AT RISK", icon: AlertTriangle, color: "amber" },
      { id: "ANALYZING", label: "AI ANALYSIS", icon: CheckCircle2, color: "indigo" },
      { id: "POLICY_CHECKING", label: "POLICY GUARDIAN", icon: CheckCircle2, color: "indigo" },
      { id: "EXECUTING", label: "ACTION", icon: CheckCircle2, color: "indigo" },
      { id: "WAITING", label: "CUSTOMER", icon: CheckCircle2, color: "indigo" },
      { id: "SUCCESS", label: "RECOVERED", icon: CheckCircle2, color: "emerald" },
    ];

    let currentIndex = 0;
    if (status === "SUCCESS") currentIndex = 5;
    else if (status === "WAITING_FOR_CUSTOMER") currentIndex = 4;
    else if (["READY_TO_EXECUTE", "EXECUTING", "EXECUTED"].includes(status)) currentIndex = 3;
    else if (["POLICY_CHECKING", "POLICY_APPROVED", "PENDING_APPROVAL", "POLICY_BLOCKED"].includes(status))
      currentIndex = 2;
    else if (["ANALYZING", "ANALYSIS_COMPLETE"].includes(status)) currentIndex = 1;

    return { currentIndex, stages };
  };

  const { currentIndex, stages } = getPipelineStage();

  // Success State Header
  if (status === "SUCCESS") {
    return (
      <div className="space-y-8 animate-fade-in">
        <Link
          to="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-800 flex items-center font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Command Center
        </Link>
        <div className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-white shadow-xl shadow-emerald-600/20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 mix-blend-overlay"></div>
          <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-200 mb-6" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            ₹{(attemptState.amountRecovered / 100).toFixed(2)}{" "}
            <span className="font-light">RECOVERED</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-emerald-100 font-medium text-sm md:text-base">
            <div className="bg-emerald-700/50 px-4 py-2 rounded-lg">
              Recovered through: <span className="text-white">Payment Link</span>
            </div>
            <div className="bg-emerald-700/50 px-4 py-2 rounded-lg">
              Recovery attempt: <span className="text-white">#{attemptState.attemptNumber}</span>
            </div>
            <div className="bg-emerald-700/50 px-4 py-2 rounded-lg">
              Customer: <span className="text-white">{customer.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Audit Timeline
            </h3>
            <div className="card p-6">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute w-4 h-4 bg-white border-2 border-emerald-500 rounded-full -left-[9px] top-1" />
                    <div className="text-xs font-semibold text-slate-400 mb-1">
                      {new Date(log.createdAt).toLocaleTimeString()} • {log.actor}
                    </div>
                    <div className="text-sm font-medium text-slate-900">
                      {log.eventType ? log.eventType.replace(/_/g, " ") : ""}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">{log.message}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <AiDecisionCard decision={decision} />
            <ExecutionCard attempt={attemptState} paymentLink={paymentLink} />
          </div>
        </div>
      </div>
    );
  }

  // Blocked State Header
  if (status === "POLICY_BLOCKED") {
    return (
      <div className="space-y-8">
        <Link
          to="/dashboard"
          className="text-sm text-slate-500 hover:text-slate-800 flex items-center font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Command Center
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center relative overflow-hidden">
          <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h1 className="text-4xl font-bold text-red-950 tracking-tight mb-2">
            RECOVERY BLOCKED
          </h1>
          <p className="text-red-700 font-medium">
            Reason: {policy?.reason || "Maximum automated attempts reached."}
          </p>
          <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
            <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex-1 max-w-xs w-full">
              <div className="text-red-400 font-medium mb-1 text-xs uppercase tracking-wider">
                AI Wanted
              </div>
              <div className="font-semibold text-slate-900 line-through text-lg">
                {decision?.recommendedAction?.replace(/_/g, " ")}
              </div>
            </div>
            <ArrowRight className="w-6 h-6 text-red-300 hidden md:block" />
            <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex-1 max-w-xs w-full">
              <div className="text-red-600 font-medium mb-1 text-xs uppercase tracking-wider">
                Revora AI Did
              </div>
              <div className="font-semibold text-slate-900 text-lg">ESCALATED TO HUMAN</div>
              <div className="text-xs text-slate-500 mt-1">No external action was executed.</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <PolicyCard policy={policy} action={decision?.recommendedAction} />
            <AiDecisionCard decision={decision} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
              Audit Timeline
            </h3>
            <div className="card p-6 h-full">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {logs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <div className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[7px] top-1.5" />
                    <div className="text-xs font-semibold text-slate-400 mb-0.5">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="text-sm text-slate-600 mt-0.5">
                      <span className="font-medium text-slate-900">{log.actor}</span>: {log.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active / Standard State
  return (
    <div className="space-y-8">
      <Link
        to="/dashboard"
        className="text-sm text-slate-500 hover:text-slate-800 flex items-center font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Command Center
      </Link>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-3">
            Recovery Workflow
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
              Attempt #{attemptState.attemptNumber}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Transaction: {transaction.id} • Customer: {customer.name}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-slate-500">Amount at Risk</div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹{(attemptState.amountAtRisk / 100).toFixed(2)}
          </div>
        </div>
      </div>

      {status === "PENDING_APPROVAL" && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              HUMAN APPROVAL REQUIRED
            </h2>
            <p className="text-sm text-amber-700 mt-1">
              {policy?.reason || "This action requires manual authorization."}
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={handleReject}
              className="flex-1 md:flex-none px-4 py-2 bg-white text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors"
            >
              REJECT
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 md:flex-none px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-lg text-sm font-medium transition-colors"
            >
              APPROVE ACTION
            </button>
          </div>
        </div>
      )}

      {/* Recovery Journey Visualization */}
      <div className="card p-6 overflow-x-auto">
        <div className="min-w-[700px] flex items-center justify-between relative px-4">
          <div className="absolute top-5 left-8 right-8 h-1 bg-slate-100 -z-10 rounded-full" />
          <div
            className="absolute top-5 left-8 h-1 bg-indigo-500 -z-10 transition-all duration-700 rounded-full"
            style={{
              width: `${(currentIndex / (stages.length - 1)) * 100}%`,
              maxWidth: "calc(100% - 64px)",
            }}
          />

          {stages.map((stage, i) => (
            <div key={stage.id} className="relative z-10 flex flex-col items-center w-32 text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  i < currentIndex
                    ? `bg-indigo-500 border-indigo-100 text-white shadow-sm`
                    : i === currentIndex
                    ? `bg-white border-indigo-500 text-indigo-600 shadow-md scale-110`
                    : `bg-white border-slate-100 text-slate-300`
                }`}
              >
                {i <= currentIndex ? (
                  <stage.icon className="w-5 h-5" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                )}
              </div>
              <div
                className={`mt-3 text-[10px] font-bold tracking-widest uppercase ${
                  i <= currentIndex ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {stage.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <AiDecisionCard decision={decision} />
          <PolicyCard policy={policy} action={decision?.recommendedAction} />
          <ExecutionCard attempt={attemptState} paymentLink={paymentLink} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">
            Audit Timeline
          </h3>
          <div className="card p-6 h-full">
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
              {logs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  <div className="absolute w-3 h-3 bg-white border-2 border-slate-300 rounded-full -left-[7px] top-1.5" />
                  <div className="text-xs font-semibold text-slate-400 mb-0.5">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-slate-600 mt-0.5">
                    <span className="font-medium text-slate-900">{log.actor}</span>: {log.message}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-sm text-slate-500 pl-6">No logs yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
