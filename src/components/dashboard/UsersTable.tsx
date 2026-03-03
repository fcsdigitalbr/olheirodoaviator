import { User } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border p-5 animate-slide-up">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent Users</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-muted animate-pulse-soft" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Users</h3>
        <span className="text-xs text-muted-foreground font-mono">{users.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">WhatsApp</th>
              <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Follow-up</th>
              <th className="text-right py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 20).map((user) => (
              <tr key={user.whatsapp_number} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="py-3 font-medium">{user.name}</td>
                <td className="py-3 font-mono text-muted-foreground text-xs">{user.whatsapp_number}</td>
                <td className="py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="py-3">
                  {user.follow_up_sent ? (
                    <span className="text-xs text-muted-foreground">Sent</span>
                  ) : (
                    <span className="text-xs text-warning">Pending</span>
                  )}
                </td>
                <td className="py-3 text-right text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warning">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      Pending
    </span>
  );
}
