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

export function useFunnelMetrics() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: deposits, isLoading: depositsLoading } = useDepositVerifications();

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter((u) => u.status === "active").length ?? 0;
  const pendingUsers = users?.filter((u) => u.status === "pending_deposit").length ?? 0;
  const conversionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

  const pendingDeposits = deposits?.filter((d) => d.verification_status === "pending").length ?? 0;
  const approvedDeposits = deposits?.filter((d) => d.verification_status === "approved").length ?? 0;
  const rejectedDeposits = deposits?.filter((d) => d.verification_status === "rejected").length ?? 0;

  // Users in the last 7 days
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentUsers = users?.filter((u) => new Date(u.created_at) >= weekAgo).length ?? 0;
  const recentActive = users?.filter(
    (u) => u.status === "active" && u.activated_at && new Date(u.activated_at) >= weekAgo
  ).length ?? 0;

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
