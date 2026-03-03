import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: { value: number; label: string };
  variant?: "default" | "primary" | "success" | "warning";
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function MetricCard({ title, value, subtitle, icon, trend, variant = "default" }: MetricCardProps) {
  return (
    <div className={`rounded-lg border p-5 animate-slide-up ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight font-mono">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${iconVariantStyles[variant]}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs">
          <span className={trend.value >= 0 ? "text-success" : "text-destructive"}>
            {trend.value >= 0 ? "+" : ""}{trend.value}
          </span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
