import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  TriangleAlert,
  FileSearch,
  RotateCcw,
  CirclePlay,
  Receipt,
  ShieldCheck,
  Bot,
  Settings,
  CircleHelp,
  ChevronLeft,
  ChevronRight,
  Beaker,
  Users,
} from "lucide-react";

export function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const pathname = location.pathname;

  const revenueLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/risk-cases",
      label: "Risk Cases",
      icon: TriangleAlert,
      badge: "1",
      badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold",
    },
    {
      href: "/investigations",
      label: "Investigations",
      icon: FileSearch,
    },
  ];

  const recoveryLinks = [
    {
      href: "/recovery",
      label: "Recovery Batches",
      icon: RotateCcw,
    },
    {
      href: "/recoveries",
      label: "Active Recovery",
      icon: CirclePlay,
      badge: "Live",
      badgeColor: "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-semibold",
    },
  ];

  const operationsLinks = [
    {
      href: "/transactions",
      label: "Transactions",
      icon: Receipt,
    },
    {
      href: "/customers",
      label: "Customers",
      icon: Users,
    },
    {
      href: "/experiments",
      label: "Experiment Lab",
      icon: Beaker,
    },
    {
      href: "/audit",
      label: "Audit Trail",
      icon: ShieldCheck,
    },
  ];

  const aiLinks = [
    {
      href: "/ai-assistant",
      label: "AI Assistant",
      icon: Bot,
      badge: "AI",
      badgeColor: "bg-violet-600 text-white font-bold",
    },
  ];

  const renderNavLink = (link) => {
    const isActive =
      pathname === link.href ||
      (link.href !== "/dashboard" && pathname.startsWith(link.href));
    const Icon = link.icon;

    return (
      <Link
        key={link.href}
        to={link.href}
        className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-all ${
          isActive
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-semibold shadow-xs"
            : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
        }`}
      >
        <Icon
          className={`h-4 w-4 shrink-0 transition-colors ${
            isActive
              ? "text-white dark:text-neutral-950"
              : "text-muted-foreground group-hover:text-foreground"
          }`}
        />
        {!collapsed && (
          <div className="flex flex-1 items-center justify-between min-w-0">
            <span className="truncate">{link.label}</span>
            {link.badge && (
              <span className={`rounded px-1.5 py-0.5 text-[10px] tracking-tight ${link.badgeColor}`}>
                {link.badge}
              </span>
            )}
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={`hidden lg:block border-r border-border/80 bg-card h-screen sticky top-0 transition-all duration-200 z-40 select-none ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-full flex-col justify-between overflow-y-auto py-3">
        <div className="space-y-4 px-3">
          {/* Logo & Brand Header */}
          <div className="flex items-center justify-between px-2 py-1.5">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#0C2451] text-[#3395FF] flex items-center justify-center shadow-md transition-transform group-hover:scale-105 shrink-0 border border-sky-500/20">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 fill-current text-[#3395FF]"
                  aria-label="Razorpay"
                >
                  <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902Z"></path>
                </svg>
              </div>
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1">
                    Revora AI
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium truncate max-w-[130px]">
                    Revenue Recovery
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              aria-label="Toggle sidebar collapse"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="h-px bg-border/80 my-2"></div>

          {/* Navigation Section 1: Revenue */}
          <nav className="space-y-4">
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Revenue
                </p>
              )}
              <div className="space-y-0.5">{revenueLinks.map(renderNavLink)}</div>
            </div>

            {/* Navigation Section 2: Recovery */}
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Recovery
                </p>
              )}
              <div className="space-y-0.5">{recoveryLinks.map(renderNavLink)}</div>
            </div>

            {/* Navigation Section 3: Operations */}
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  Operations
                </p>
              )}
              <div className="space-y-0.5">{operationsLinks.map(renderNavLink)}</div>
            </div>

            {/* Navigation Section 4: AI */}
            <div className="space-y-1">
              {!collapsed && (
                <p className="px-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  AI
                </p>
              )}
              <div className="space-y-0.5">{aiLinks.map(renderNavLink)}</div>
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar: Merchant & Settings */}
        <div className="space-y-3 px-3 pt-3 border-t border-border/80">
          {!collapsed && (
            <div className="rounded-lg border border-border/80 bg-muted/40 p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-foreground">FitPrime Subscriptions</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20">
                  TEST MODE
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Gateway: Razorpay (Sandbox)</p>
            </div>
          )}

          <div className="space-y-0.5">
            <Link
              to="/settings"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Settings className="w-4 h-4 shrink-0 text-muted-foreground" />
              {!collapsed && <span>Settings</span>}
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <CircleHelp className="w-4 h-4 shrink-0 text-muted-foreground" />
              {!collapsed && <span>Docs &amp; API</span>}
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
