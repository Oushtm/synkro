import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AppShell user={user}>{children}</AppShell>;
}
