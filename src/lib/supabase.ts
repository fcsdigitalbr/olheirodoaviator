import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ppfiftedenoossdpdxaa.supabase.co";
// TODO: Replace with your actual anon key
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type User = {
  whatsapp_number: string;
  name: string;
  status: "pending_deposit" | "active";
  created_at: string;
  activated_at: string | null;
  follow_up_sent: boolean;
  updated_at: string;
};

export type DepositVerification = {
  id: number;
  whatsapp_number: string;
  image_url: string | null;
  verification_status: "pending" | "approved" | "rejected";
  ai_analysis: string | null;
  verified_at: string | null;
  created_at: string;
};

export type ConversationLog = {
  id: number;
  whatsapp_number: string;
  message_type: "user_text" | "user_image" | "ai_response";
  content: string | null;
  image_url: string | null;
  created_at: string;
};
