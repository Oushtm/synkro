# Synkro

Web app for managing appointments (**rendez-vous**): calendar, dashboard, search, and timeline. Persistence uses **Supabase** (PostgreSQL) via Next.js API routes.

**Repository:** [github.com/Oushtm/synkro](https://github.com/Oushtm/synkro)

## Stack

- **Next.js** 16 (App Router), **React** 19
- **TypeScript**, **Tailwind CSS** 4
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) for PostgreSQL, **Google Sign-In**, and cookie sessions
- **Zod** for request validation

## Prerequisites

- Node.js 20+ (recommended)
- A [Supabase](https://supabase.com) project

## Local setup

```bash
git clone https://github.com/Oushtm/synkro.git
cd synkro
npm install
```

1. Copy environment template and fill in your Supabase project values:

   ```bash
   cp .env.example .env.local
   ```

   - `NEXT_PUBLIC_SUPABASE_URL`: project URL (e.g. `https://<ref>.supabase.co`, **not** the `/rest/v1/` URL).
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: **anon** key from Supabase **Settings > API** (never commit the `service_role` key or put it in `NEXT_PUBLIC_*`).

2. Run SQL migrations in order in the Supabase **SQL Editor** (new query, paste, run):
   - `supabase/migrations/001_appointments.sql` - creates `appointments`.
   - `supabase/migrations/002_appointments_rls_anon.sql` - optional if you previously used anon-only RLS; safe to run (drops/recreates anon policies).
   - `supabase/migrations/003_appointments_user_rls.sql` - adds `user_id`, **per-user RLS** for signed-in users (required for the current app). This deletes orphan rows without an owner.

3. **Authentication (Google)**  
   In Supabase: **Authentication > Providers > Google**: enable and add Client ID / Secret from [Google Cloud Console](https://console.cloud.google.com/) (OAuth 2.0 Web client).  
   Under **Authentication > URL Configuration**, add redirect URLs, for example:
   - `http://localhost:3000/auth/callback`
   - `https://<your-vercel-app>.vercel.app/auth/callback`  
   Set **Site URL** to your public origin (e.g. Vercel URL).

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The marketing site is public; **Dashboard**, **Timeline**, **Calendar**, and **Search** require Google sign-in (`/login`).

## Scripts

| Command         | Description           |
| --------------- | --------------------- |
| `npm run dev`   | Development server    |
| `npm run build` | Production build      |
| `npm run start` | Run production build  |
| `npm run lint`  | ESLint                |

## Project layout

| Path | Role |
| ---- | ---- |
| `src/app/` | App Router pages and layouts |
| `src/app/api/appointments/` | CRUD API backed by Supabase |
| `src/app/api/search/` | Search API |
| `src/lib/rdv/` | Domain logic (validation, conflicts, sorting) |
| `src/lib/supabase/` | Env helpers, browser/server/route Supabase clients |
| `middleware.ts` | Refreshes session cookies; protects `/dashboard`, `/timeline`, `/calendar`, `/search` |
| `src/app/login/` | Sign-in page (Google) |
| `src/app/auth/callback/` | OAuth redirect handler |
| `supabase/migrations/` | SQL to run in the Supabase dashboard |

## Deploy on Vercel

1. Import the GitHub repo in [Vercel](https://vercel.com).
2. Use the **repository root** (where `package.json` lives).
3. Add the same two environment variables as in `.env.example` for **Production** (and **Preview** if needed).
4. Deploy. Ensure the Supabase migration has been applied so API routes can read/write `appointments`.

## Legacy

- `legacy-c/`: original C reference implementation
- `docs/Rapport_Projet_Rendez_Vous.md`: project report (French)

## License

Private / course project unless otherwise stated by the authors.
