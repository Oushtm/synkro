# Supabase Migration Plan

This plan outlines the steps to replace the local JSON-based storage with Supabase for the Synkro Appointment Manager.

## 1. Database Configuration
- [x] Install `@supabase/supabase-js`
- [x] Configure `.env.local` with Supabase URL and Anon Key
- [x] Create Supabase client in `src/lib/supabase.ts`
- [ ] Provide SQL schema for the `appointments` table (User needs to run this in Supabase dashboard)

## 2. API Refactoring
- [ ] **`src/app/api/appointments/route.ts`**:
    - Update `GET` to fetch from `appointments` table.
    - Update `POST` to insert into `appointments` table.
- [ ] **`src/app/api/appointments/[id]/route.ts`**:
    - Update `DELETE` to remove from `appointments` table.
    - Update `PATCH` to update in `appointments` table.
- [ ] **`src/app/api/search/route.ts`**:
    - Update to use Supabase filters for searching.

## 3. Data Integrity
- Maintain existing C-style validation logic (conflit detection, period validation) while using Supabase for persistence.
- Ensure ID handling is consistent (PostgreSQL SERIAL will handle IDs).

## 4. Final Validation
- Test full CRUD flow in the UI.
- Verify data persistence across sessions.
