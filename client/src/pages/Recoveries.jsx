import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Search, Filter } from "lucide-react";
import { api } from "@/services/api";
import { LiveRecoveryFeed } from "@/components/recovery/LiveRecoveryFeed";

export function Recoveries() {
  const [recoveries, setRecoveries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecoveries().then((data) => {
      setRecoveries(data);
      setLoading(false);
    });
  }, []);

  const filtered = recoveries.filter((r) => {
    const customerName = r.customer?.name || r.transaction?.customer?.name || "";
    const matchesSearch =
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recoveries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Active and historical autonomous recovery attempts
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search attempt or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
            />
          </div>

          <div className="relative flex items-center">
            <Filter className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS (Recovered)</option>
              <option value="WAITING_FOR_CUSTOMER">WAITING FOR CUSTOMER</option>
              <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
              <option value="POLICY_BLOCKED">POLICY BLOCKED</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card p-12 text-center text-slate-400">Loading recoveries...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-700">No recovery workflows found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search filter or trigger a live demo from the Overview dashboard.
          </p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
          >
            Go to Command Center
          </Link>
        </div>
      ) : (
        <LiveRecoveryFeed recoveries={filtered} />
      )}
    </div>
  );
}
