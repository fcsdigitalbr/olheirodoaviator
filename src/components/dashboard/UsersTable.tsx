import { User } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useIsMobile } from "@/hooks/use-mobile";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border p-4 sm:p-5 animate-slide-up">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-4">Usuários Recentes</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 sm:h-12 rounded bg-muted animate-pulse-soft" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 sm:p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Usuários Recentes</h3>
        <span className="text-xs text-muted-foreground font-mono">{users.length} total</span>
      </div>
      
      {isMobile ? (
        // Mobile card view
        <div className="space-y-3">
          {users.slice(0, 20).map((user) => (
            <div key={user.whatsapp_number} className="border border-border/50 rounded-lg p-3 hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm truncate">{user.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{user.whatsapp_number}</p>
                </div>
                <StatusBadge status={user.status} />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Follow-up: {user.follow_up_sent ? (
                    <span className="text-muted-foreground">Enviado</span>
                  ) : (
                    <span className="text-warning">Pendente</span>
                  )}
                </span>
                <span>
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ptBR })}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Desktop table view
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Nome</th>
                <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">WhatsApp</th>
                <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Follow-up</th>
                <th className="text-right py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Entrou</th>
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
                      <span className="text-xs text-muted-foreground">Enviado</span>
                    ) : (
                      <span className="text-xs text-warning">Pendente</span>
                    )}
                  </td>
                  <td className="py-3 text-right text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(user.created_at), { addSuffix: true, locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
        Ativo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 sm:gap-1.5 text-xs font-medium text-warning">
      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
      Pendente
    </span>
  );
}
