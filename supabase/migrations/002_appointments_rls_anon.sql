-- Run in Supabase: SQL Editor after 001_appointments.sql
-- Fixes: "new row violates row-level security policy for table appointments"
-- The app uses the anon key from API routes; these policies allow CRUD for role `anon`.
-- For production with real users, replace with stricter rules (e.g. auth.uid()).

alter table public.appointments enable row level security;

drop policy if exists "appointments_select_anon" on public.appointments;
drop policy if exists "appointments_insert_anon" on public.appointments;
drop policy if exists "appointments_update_anon" on public.appointments;
drop policy if exists "appointments_delete_anon" on public.appointments;

create policy "appointments_select_anon"
  on public.appointments for select
  to anon using (true);

create policy "appointments_insert_anon"
  on public.appointments for insert
  to anon with check (true);

create policy "appointments_update_anon"
  on public.appointments for update
  to anon using (true) with check (true);

create policy "appointments_delete_anon"
  on public.appointments for delete
  to anon using (true);
