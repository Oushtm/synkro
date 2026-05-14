-- Run in Supabase: SQL Editor → New query → paste → Run
-- Matches src/lib/rdv/types.ts and API insert shape

create table if not exists public.appointments (
  id bigint generated always as identity primary key,
  jour smallint not null check (jour between 1 and 31),
  mois smallint not null check (mois between 1 and 12),
  annee smallint not null check (annee between 1900 and 2100),
  "heureDebut" smallint not null check ("heureDebut" between 0 and 23),
  "minuteDebut" smallint not null check ("minuteDebut" between 0 and 59),
  "heureFin" smallint not null check ("heureFin" between 0 and 23),
  "minuteFin" smallint not null check ("minuteFin" between 0 and 59),
  lieu text not null,
  categorie text not null check (categorie in ('professionnel', 'personnel', 'medical'))
);

comment on table public.appointments is 'Rendez-vous (Synkro appointment manager)';
