-- Run after 001. Replaces 002 (anon) with per-user RLS for authenticated sessions (Google OAuth).
-- Deletes legacy rows with no owner.

alter table public.appointments add column if not exists user_id uuid references auth.users(id) on delete cascade;

drop policy if exists "appointments_select_anon" on public.appointments;
drop policy if exists "appointments_insert_anon" on public.appointments;
drop policy if exists "appointments_update_anon" on public.appointments;
drop policy if exists "appointments_delete_anon" on public.appointments;

drop policy if exists "appointments_select_own" on public.appointments;
drop policy if exists "appointments_insert_own" on public.appointments;
drop policy if exists "appointments_update_own" on public.appointments;
drop policy if exists "appointments_delete_own" on public.appointments;

delete from public.appointments where user_id is null;

alter table public.appointments alter column user_id set not null;

alter table public.appointments enable row level security;

create policy "appointments_select_own"
  on public.appointments for select to authenticated using (auth.uid() = user_id);

create policy "appointments_insert_own"
  on public.appointments for insert to authenticated with check (auth.uid() = user_id);

create policy "appointments_update_own"
  on public.appointments for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "appointments_delete_own"
  on public.appointments for delete to authenticated using (auth.uid() = user_id);
