import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function getSessionUser(supabase: SupabaseClient): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}
