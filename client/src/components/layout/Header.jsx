import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldAlert,
  X,
  Menu,
  ChevronRight,
  Search,
  ChevronDown,
  Building2,
  Bell,
  Sun,
  Moon,
} from "lucide-react";

export function Header({ onToggleMobileMenu }) {
  const location = useLocation();
  const [showBanner, setShowBanner] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const getPageTitle = (path) => {
    if (path === "/dashboard") return "Dashboard";
    if (path === "/risk-cases") return "Revenue Risk Cases";
    if (path.startsWith("/investigations")) return "Investigations";
    if (path.startsWith("/recovery")) return "Recovery Batches";
    if (path.startsWith("/recoveries")) return "Active Recovery Workflows";
    if (path === "/transactions") return "Transactions";
    if (path === "/customers") return "Customers";
    if (path === "/experiments") return "Experiment Lab";
    if (path === "/audit") return "Audit Trail";
    if (path === "/settings") return "Settings";
    if (path === "/ai-assistant") return "AI Assistant";
    return "Command Center";
  };

  return (
    <div className="flex flex-col w-full shrink-0">
      {/* Test Mode Warning Banner */}
      {showBanner && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 max-w-4xl">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>
              <strong>Razorpay Test Mode Active:</strong> You are operating in a sandboxed financial environment. Simulated recovery transactions do not trigger real settlement debits.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="text-amber-700 dark:text-amber-400 hover:opacity-75 p-0.5 rounded ml-2 cursor-pointer"
            aria-label="Dismiss test mode notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/80 bg-card/95 px-4 backdrop-blur-md transition-colors">
        {/* Left Side: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/dashboard" className="font-medium text-foreground/80 hover:text-foreground">
              Revora AI
            </Link>
            <ChevronRight className="w-3 h-3 opacity-40" />
            <span className="font-semibold text-foreground">
              {getPageTitle(location.pathname)}
            </span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search trigger */}
          <Link
            to="/transactions"
            className="hidden md:flex items-center gap-2 px-2.5 py-1 text-xs text-muted-foreground bg-muted/50 border border-border/80 rounded-md hover:bg-muted transition-colors w-48 sm:w-60 justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Search or jump to...</span>
            </span>
            <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Link>

          {/* Active Incident Pill */}
          <Link
            to="/risk-cases"
            className="inline-flex items-center justify-center rounded-md h-8 text-xs gap-1.5 px-2.5 font-medium border border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300 dark:bg-rose-950/30 hover:bg-rose-500/10 transition-colors shadow-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-muted-foreground font-normal hidden sm:inline">Active Incident:</span>
            <span className="font-semibold truncate max-w-[140px]">UPI Degradation</span>
            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold">
              RC-001
            </span>
          </Link>

          {/* Test Mode Pill */}
          <div className="flex items-center gap-1.5 px-2 py-1 sm:px-2.5 rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold select-none shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="hidden sm:inline">Test Mode</span>
          </div>

          {/* Merchant Dropdown */}
          <div className="inline-flex items-center rounded-md h-8 gap-1.5 px-2 sm:px-2.5 text-xs font-medium text-foreground bg-background border border-border">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold hidden sm:inline">FitPrime Commerce</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </div>

          {/* Notification Bell */}
          <button
            className="inline-flex items-center justify-center rounded-md h-7 w-7 relative text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="inline-flex items-center justify-center rounded-md h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-border/70">
            <div className="w-7 h-7 rounded-full bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-bold text-xs flex items-center justify-center shadow-xs">
              RA
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
