interface DepositBreakdownProps {
  pending: number;
  approved: number;
  rejected: number;
}

export function DepositBreakdown({ pending, approved, rejected }: DepositBreakdownProps) {
  const total = pending + approved + rejected;

  const segments = [
    { label: "Aprovado", value: approved, color: "bg-success" },
    { label: "Pendente", value: pending, color: "bg-warning" },
    { label: "Rejeitado", value: rejected, color: "bg-destructive" },
  ];

  return (
    <div className="rounded-lg border border-border p-5 animate-slide-up">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Verificações de Depósito</h3>

      {/* Stacked bar */}
      <div className="h-3 rounded-full bg-muted overflow-hidden flex mb-5">
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.value / total) * 100 : 0;
          return pct > 0 ? (
            <div
              key={seg.label}
              className={`h-full ${seg.color} transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          ) : null;
        })}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="text-center">
            <p className="text-2xl font-mono font-semibold">{seg.value}</p>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <span className={`h-2 w-2 rounded-full ${seg.color}`} />
              <span className="text-xs text-muted-foreground">{seg.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
