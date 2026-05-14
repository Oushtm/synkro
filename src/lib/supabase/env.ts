/** Accepts project URL or a pasted REST base ending in `/rest/v1/`. */
export function normalizeSupabaseUrl(raw: string | undefined): string {
  if (!raw) return "";
  let url = raw.trim().replace(/\/$/, "");
  url = url.replace(/\/rest\/v1\/?$/i, "");
  return url;
}

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.example to .env.local or set them on Vercel.",
    );
  }
  return { url, anonKey };
}

export type SupabaseCookiePair = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};
