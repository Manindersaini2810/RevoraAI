import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Brain,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  IndianRupee,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center text-center px-4 py-20 relative">
      <div className="absolute top-6 left-6">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide bg-amber-100 text-amber-800 border border-amber-200 uppercase shadow-sm">
          Razorpay Test Mode
        </span>
      </div>

      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200">
        <ShieldCheck className="w-8 h-8 text-white" />
      </div>

      <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight max-w-4xl">
        Revora AI
      </h1>
      <h2 className="text-xl md:text-3xl text-slate-600 mt-4 max-w-2xl font-light">
        Autonomous revenue recovery for merchants.
      </h2>

      <p className="mt-8 text-lg text-slate-500 max-w-3xl leading-relaxed">
        Revora AI detects failed payments, decides which revenue is worth recovering, takes the safest bounded action, and verifies the money it actually saves.
      </p>

      {/* Visual Hero Flow */}
      <div className="mt-16 w-full max-w-5xl overflow-x-auto pb-4">
        <div className="flex flex-row items-center justify-between min-w-[800px] p-6 bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm">
          <FlowStep title="PAYMENT FAILURE" icon={AlertCircle} color="text-slate-500" />
          <FlowArrow />
          <FlowStep title="REVENUE AT RISK" icon={IndianRupee} color="text-amber-500" />
          <FlowArrow />
          <FlowStep title="AI DECISION" icon={Brain} color="text-indigo-500" highlight />
          <FlowArrow />
          <FlowStep title="POLICY GUARDIAN" icon={ShieldCheck} color="text-indigo-500" highlight />
          <FlowArrow />
          <FlowStep title="BOUNDED ACTION" icon={Zap} color="text-slate-500" />
          <FlowArrow />
          <FlowStep title="PAYMENT VERIFIED" icon={CheckCircle2} color="text-emerald-500" />
          <FlowArrow />
          <FlowStep title="REVENUE RECOVERED" icon={TrendingUp} color="text-emerald-600" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-16">
        <Link
          to="/dashboard"
          className="px-8 py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
        >
          RUN LIVE DEMO
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          to="/dashboard"
          className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          EXPLORE SYSTEM
        </Link>
      </div>
    </div>
  );
}

function FlowStep({ title, icon: Icon, color, highlight }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 w-28 text-center ${
        highlight ? "scale-105" : ""
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
          highlight
            ? "bg-white border-2 border-indigo-100 shadow-indigo-100"
            : "bg-white border border-slate-100"
        }`}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span
        className={`text-[10px] font-bold tracking-wider leading-tight ${
          highlight ? "text-indigo-900" : "text-slate-500"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

function FlowArrow() {
  return <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />;
}
