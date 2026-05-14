# Synkro

Web app for managing appointments (**rendez-vous**): calendar, dashboard, search, and timeline. Persistence uses **Supabase** (PostgreSQL) via Next.js API routes.

**Repository:** [github.com/Oushtm/synkro](https://github.com/Oushtm/synkro)

## Stack

- **Next.js** 16 (App Router), **React** 19
- **TypeScript**, **Tailwind CSS** 4
- **Supabase** (`@supabase/supabase-js`) for the `appointments` table
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

2. Create the database table. In Supabase: open **SQL Editor**, create a new query, paste `supabase/migrations/001_appointments.sql`, then **Run**.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

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
| `src/lib/supabase.ts` | Supabase client |
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
