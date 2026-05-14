import { createClient } from "@supabase/supabase-js";

/** Accepts project URL or a pasted REST base ending in `/rest/v1/`. */
function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return "";
  let url = raw.trim().replace(/\/$/, "");
  url = url.replace(/\/rest\/v1\/?$/i, "");
  return url;
}

const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and set both.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
