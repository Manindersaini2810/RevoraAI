import { ShieldAlert, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function DemoBanner() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isJudgeMode, setIsJudgeMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsJudgeMode(sessionStorage.getItem("judgeMode") === "true");
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (pathname === "/") return null;

  return (
    <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-center text-xs font-medium tracking-wide sticky top-0 z-50 shadow-sm">
      <ShieldAlert className="w-4 h-4 mr-2" />
      RAZORPAY TEST MODE — Live Simulation Environment
      {isJudgeMode && (
        <button
          onClick={() => {
            sessionStorage.removeItem("judgeMode");
            window.location.reload();
          }}
          className="ml-4 flex items-center bg-indigo-700 hover:bg-indigo-800 px-2 py-0.5 rounded transition-colors"
        >
          Exit Judge Mode
          <X className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  );
}
