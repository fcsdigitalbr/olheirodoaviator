import { useQuery } from "@tanstack/react-query";
import { supabase, User, DepositVerification } from "@/lib/supabase";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as User[];
    },
    refetchInterval: 30000,
  });
}

export function useDepositVerifications() {
  return useQuery({
    queryKey: ["deposit_verifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deposit_verifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DepositVerification[];
    },
    refetchInterval: 30000,
  });
}

type DateRange = { from: Date | undefined; to: Date | undefined };

function filterByDateRange<T extends { created_at: string }>(items: T[], range: DateRange): T[] {
  if (!range.from) return items;
  return items.filter((item) => {
    const created = new Date(item.created_at);
    if (created < range.from!) return false;
    if (range.to) {
      const endOfDay = new Date(range.to);
      endOfDay.setHours(23, 59, 59, 999);
      if (created > endOfDay) return false;
    }
    return true;
  });
}

export function useFunnelMetrics(dateRange: DateRange = { from: undefined, to: undefined }) {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: deposits, isLoading: depositsLoading } = useDepositVerifications();

  const filtered = filterByDateRange(users ?? [], dateRange);
  const filteredDeposits = filterByDateRange(deposits ?? [], dateRange);

  const totalUsers = filtered.length;
  const activeUsers = filtered.filter((u) => u.status === "active").length;
  const pendingUsers = filtered.filter((u) => u.status === "pending_deposit").length;
  const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

  const pendingDeposits = filteredDeposits.filter((d) => d.verification_status === "pending").length;
  const approvedDeposits = filteredDeposits.filter((d) => d.verification_status === "approved").length;
  const rejectedDeposits = filteredDeposits.filter((d) => d.verification_status === "rejected").length;

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = (users ?? []).filter((u) => new Date(u.created_at) >= weekAgo).length;
  const recentActive = (users ?? []).filter(
    (u) => u.status === "active" && u.activated_at && new Date(u.activated_at) >= weekAgo
  ).length;

  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    conversionRate,
    pendingDeposits,
    approvedDeposits,
    rejectedDeposits,
    recentUsers,
    recentActive,
    isLoading: usersLoading || depositsLoading,
  };
}
