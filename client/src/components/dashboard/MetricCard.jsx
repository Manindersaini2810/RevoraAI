import { cn } from "@/lib/utils";

const variantStyles = {
  default: "border-slate-200",
  success: "border-emerald-200 bg-emerald-50/40",
  danger: "border-red-200 bg-red-50/40",
  warning: "border-amber-200 bg-amber-50/40",
};

const variantValueStyles = {
  default: "text-slate-900",
  success: "text-emerald-700",
  danger: "text-red-700",
  warning: "text-amber-700",
};

export function MetricCard({
  label,
  value,
  subValue,
  icon,
  trend,
  trendValue,
  variant = "default",
  className,
}) {
  return (
    <div className={cn("card p-5 animate-fade-in", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="metric-label">{label}</p>
          <p className={cn("metric-value mt-1", variantValueStyles[variant])}>
            {value}
          </p>
          {subValue && <p className="text-xs text-slate-500 mt-1">{subValue}</p>}
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
            {icon}
          </div>
        )}
      </div>

      {trend && trendValue && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-semibold",
              trend === "up" && "text-emerald-600",
              trend === "down" && "text-red-600",
              trend === "neutral" && "text-slate-500"
            )}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
