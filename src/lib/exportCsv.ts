import { User, DepositVerification } from "@/lib/supabase";
import { format } from "date-fns";

function escapeCsv(value: string | number | boolean | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, csvContent: string) {
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportUsersCsv(users: User[]) {
  const headers = ["Nome", "WhatsApp", "Status", "Follow-up Enviado", "Criado em", "Ativado em"];
  const rows = users.map((u) => [
    escapeCsv(u.name),
    escapeCsv(u.whatsapp_number),
    escapeCsv(u.status === "active" ? "Ativo" : "Pendente"),
    escapeCsv(u.follow_up_sent ? "Sim" : "Não"),
    escapeCsv(format(new Date(u.created_at), "dd/MM/yyyy HH:mm")),
    escapeCsv(u.activated_at ? format(new Date(u.activated_at), "dd/MM/yyyy HH:mm") : ""),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadCsv(`usuarios_${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
}

export function exportDepositsCsv(deposits: DepositVerification[]) {
  const headers = ["ID", "WhatsApp", "Status", "Análise IA", "Verificado em", "Criado em"];
  const rows = deposits.map((d) => [
    escapeCsv(d.id),
    escapeCsv(d.whatsapp_number),
    escapeCsv(
      d.verification_status === "approved" ? "Aprovado" :
      d.verification_status === "rejected" ? "Rejeitado" : "Pendente"
    ),
    escapeCsv(d.ai_analysis),
    escapeCsv(d.verified_at ? format(new Date(d.verified_at), "dd/MM/yyyy HH:mm") : ""),
    escapeCsv(format(new Date(d.created_at), "dd/MM/yyyy HH:mm")),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  downloadCsv(`depositos_${format(new Date(), "yyyy-MM-dd")}.csv`, csv);
}
