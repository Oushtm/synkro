import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv, type SupabaseCookiePair } from "./env";

/** Supabase client bound to the caller's cookies (JWT session). Use in Route Handlers. */
export async function createSupabaseRouteHandler() {
  const { url, anonKey } = getSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: SupabaseCookiePair[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* set from Server Component without mutable cookies — ignored */
        }
      },
    },
  });
}
