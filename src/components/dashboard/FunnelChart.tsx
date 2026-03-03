interface FunnelStep {
  label: string;
  value: number;
  color: string;
}

interface FunnelChartProps {
  steps: FunnelStep[];
}

export function FunnelChart({ steps }: FunnelChartProps) {
  const maxValue = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="rounded-lg border border-border p-4 sm:p-5 animate-slide-up">
      <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-4 sm:mb-5">Funil de Ativação</h3>
      <div className="space-y-3 sm:space-y-4">
        {steps.map((step, i) => {
          const widthPercent = Math.max((step.value / maxValue) * 100, 8);
          const dropoff = i > 0 && steps[i - 1].value > 0
            ? ((steps[i - 1].value - step.value) / steps[i - 1].value * 100).toFixed(0)
            : null;

          return (
            <div key={step.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-foreground truncate pr-2">{step.label}</span>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <span className="font-mono font-medium">{step.value}</span>
                  {dropoff && (
                    <span className="text-xs text-muted-foreground">
                      −{dropoff}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-6 sm:h-8 rounded-md bg-muted overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-700 ease-out flex items-center px-2 sm:px-3"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: step.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
