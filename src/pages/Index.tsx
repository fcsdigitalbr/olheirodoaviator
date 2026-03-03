import { useState } from "react";
import { Users, UserCheck, Clock, TrendingUp, Activity, Zap, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { UsersTable } from "@/components/dashboard/UsersTable";
import { DepositBreakdown } from "@/components/dashboard/DepositBreakdown";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import { useFunnelMetrics, useUsers, useDepositVerifications } from "@/hooks/useDashboardData";
import { exportUsersCsv, exportDepositsCsv } from "@/lib/exportCsv";
import type { DateRange } from "@/components/dashboard/DateRangeFilter";

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const metrics = useFunnelMetrics(dateRange);
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: deposits } = useDepositVerifications();

  // Filter users by date range for the table
  const filteredUsers = users?.filter((u) => {
    if (!dateRange.from) return true;
    const created = new Date(u.created_at);
    if (created < dateRange.from) return false;
    if (dateRange.to) {
      const endOfDay = new Date(dateRange.to);
      endOfDay.setHours(23, 59, 59, 999);
      if (created > endOfDay) return false;
    }
    return true;
  });

  const funnelSteps = [
    { label: "Entraram no Fluxo", value: metrics.totalUsers, color: "hsl(0, 72%, 51%)" },
    { label: "Depósito Pendente", value: metrics.pendingUsers, color: "hsl(38, 92%, 50%)" },
    { label: "Conta Ativada", value: metrics.activeUsers, color: "hsl(142, 60%, 45%)" },
  ];

  const rangeLabel = dateRange.from
    ? dateRange.to
      ? `${format(dateRange.from, "dd MMM", { locale: ptBR })} – ${format(dateRange.to, "dd MMM", { locale: ptBR })}`
      : format(dateRange.from, "dd MMM yyyy", { locale: ptBR })
    : "Todo o período";

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">O Lheiro do Aviator</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Painel de ativação · Fluxo n8n · {rangeLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <div className="h-6 w-px bg-border hidden sm:block" />
          <button
            onClick={() => filteredUsers && exportUsersCsv(filteredUsers)}
            disabled={!filteredUsers?.length}
            className="h-9 px-3 text-xs rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1.5 disabled:opacity-40"
            title="Exportar usuários"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Usuários</span>
          </button>
          <button
            onClick={() => deposits && exportDepositsCsv(deposits)}
            disabled={!deposits?.length}
            className="h-9 px-3 text-xs rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent transition-colors flex items-center gap-1.5 disabled:opacity-40"
            title="Exportar depósitos"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Depósitos</span>
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total de Usuários"
          value={metrics.isLoading ? "—" : metrics.totalUsers}
          subtitle="Entraram no fluxo"
          icon={<Users className="h-5 w-5" />}
          trend={metrics.isLoading ? undefined : { value: metrics.recentUsers, label: "esta semana" }}
          variant="default"
        />
        <MetricCard
          title="Depósito Pendente"
          value={metrics.isLoading ? "—" : metrics.pendingUsers}
          subtitle="Aguardando ativação"
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          title="Ativados"
          value={metrics.isLoading ? "—" : metrics.activeUsers}
          subtitle="Cadastro completo"
          icon={<UserCheck className="h-5 w-5" />}
          trend={metrics.isLoading ? undefined : { value: metrics.recentActive, label: "esta semana" }}
          variant="success"
        />
        <MetricCard
          title="Taxa de Conversão"
          value={metrics.isLoading ? "—" : `${metrics.conversionRate.toFixed(1)}%`}
          subtitle="Fluxo → Ativado"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="primary"
        />
      </div>

      {/* Funnel + Deposits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <FunnelChart steps={funnelSteps} />
        <DepositBreakdown
          pending={metrics.pendingDeposits}
          approved={metrics.approvedDeposits}
          rejected={metrics.rejectedDeposits}
        />
      </div>

      {/* Users Table */}
      <UsersTable users={filteredUsers ?? []} isLoading={usersLoading} />

      {/* Footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-3 w-3" />
        <span>Atualiza automaticamente a cada 30s</span>
      </div>
    </div>
  );
};

export default Index;
