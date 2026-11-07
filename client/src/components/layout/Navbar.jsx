import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  Activity,
  Zap,
  FileText,
  Users,
  Beaker,
  ShieldCheck,
  Settings,
} from "lucide-react";

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isJudgeMode, setIsJudgeMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsJudgeMode(sessionStorage.getItem("judgeMode") === "true");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Hide nav on the landing page
  if (pathname === "/") return null;
  // If in judge mode, hide navigation
  if (isJudgeMode) return null;

  const links = [
    { href: "/dashboard", label: "Overview", icon: <Activity className="w-4 h-4 mr-2" /> },
    { href: "/recoveries", label: "Live Recoveries", icon: <Zap className="w-4 h-4 mr-2" /> },
    { href: "/transactions", label: "Transactions", icon: <FileText className="w-4 h-4 mr-2" /> },
    { href: "/customers", label: "Customers", icon: <Users className="w-4 h-4 mr-2" /> },
    { href: "/experiments", label: "Experiment Lab", icon: <Beaker className="w-4 h-4 mr-2" /> },
    { href: "/audit", label: "Audit Trail", icon: <ShieldCheck className="w-4 h-4 mr-2" /> },
    { href: "/settings", label: "Settings", icon: <Settings className="w-4 h-4 mr-2" /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-8 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg tracking-tight text-slate-900">
                  Revora AI
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {links.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (pathname.startsWith(link.href) && link.href !== "/dashboard");
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-indigo-500 text-slate-900"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center">
            {/* Judge Mode Toggle */}
            <button
              onClick={() => {
                sessionStorage.setItem("judgeMode", "true");
                window.location.reload();
              }}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 transition-colors"
            >
              Enter Judge Mode
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
