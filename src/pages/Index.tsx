import { Users, UserCheck, Clock, TrendingUp, Activity, Zap } from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { UsersTable } from "@/components/dashboard/UsersTable";
import { DepositBreakdown } from "@/components/dashboard/DepositBreakdown";
import { useFunnelMetrics, useUsers } from "@/hooks/useDashboardData";

const Index = () => {
  const metrics = useFunnelMetrics();
  const { data: users, isLoading: usersLoading } = useUsers();

  const funnelSteps = [
    { label: "Entered Flow", value: metrics.totalUsers, color: "hsl(210, 100%, 60%)" },
    { label: "Pending Deposit", value: metrics.pendingUsers, color: "hsl(38, 92%, 50%)" },
    { label: "Account Activated", value: metrics.activeUsers, color: "hsl(160, 60%, 45%)" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Activation Dashboard</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          n8n workflow performance · Customer activation funnel
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          title="Total Users"
          value={metrics.isLoading ? "—" : metrics.totalUsers}
          subtitle="All-time entries"
          icon={<Users className="h-5 w-5" />}
          trend={metrics.isLoading ? undefined : { value: metrics.recentUsers, label: "this week" }}
          variant="default"
        />
        <MetricCard
          title="Pending Deposit"
          value={metrics.isLoading ? "—" : metrics.pendingUsers}
          subtitle="Awaiting activation"
          icon={<Clock className="h-5 w-5" />}
          variant="warning"
        />
        <MetricCard
          title="Activated"
          value={metrics.isLoading ? "—" : metrics.activeUsers}
          subtitle="Completed signup"
          icon={<UserCheck className="h-5 w-5" />}
          trend={metrics.isLoading ? undefined : { value: metrics.recentActive, label: "this week" }}
          variant="success"
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.isLoading ? "—" : `${metrics.conversionRate.toFixed(1)}%`}
          subtitle="Flow → Activated"
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
      <UsersTable users={users ?? []} isLoading={usersLoading} />

      {/* Footer */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        <Activity className="h-3 w-3" />
        <span>Auto-refreshes every 30s</span>
      </div>
    </div>
  );
};

export default Index;
