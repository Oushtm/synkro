import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Accepts project URL or a pasted REST base ending in `/rest/v1/`. */
function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return "";
  let url = raw.trim().replace(/\/$/, "");
  url = url.replace(/\/rest\/v1\/?$/i, "");
  return url;
}

let cached: SupabaseClient | null = null;

/** Lazy client so `next build` does not require env vars at module load time. Set vars on Vercel or in `.env.local`. */
export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local and set both, or add them in the Vercel project settings.",
    );
  }

  cached = createClient(supabaseUrl, supabaseAnonKey);
  return cached;
}
