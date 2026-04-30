"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RDV } from "@/lib/rdv/types";
import { apiSearch, apiDeleteAppointment } from "@/lib/api";
import { AppointmentDrawer } from "@/components/ui/AppointmentDrawer";
import { useToast } from "@/components/ui/Toast";

const catColor: Record<string, string> = {
  professionnel: "var(--cat-professionnel)",
  personnel: "var(--cat-personnel)",
  medical: "var(--cat-medical)",
};

function pad(n: number) { return String(n).padStart(2, "0"); }
function formatTime(h: number, m: number) { return `${pad(h)}:${pad(m)}`; }
function formatDate(j: number, m: number, a: number) { return `${pad(j)}/${pad(m)}/${a}`; }

type SearchType = "id" | "date" | "heure" | "lieu" | "categorie";

const filterChips: { type: SearchType; label: string; icon: string }[] = [
  { type: "id", label: "ID", icon: "#️⃣" },
  { type: "date", label: "Date", icon: "📅" },
  { type: "heure", label: "Time", icon: "🕐" },
  { type: "lieu", label: "Location", icon: "📍" },
  { type: "categorie", label: "Category", icon: "🏷️" },
];

export default function SearchPage() {
  const [searchType, setSearchType] = useState<SearchType>("id");
  const [results, setResults] = useState<RDV[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRdv, setEditRdv] = useState<RDV | null>(null);
  const { toast } = useToast();

  // Search fields
  const [searchId, setSearchId] = useState("");
  const [searchJour, setSearchJour] = useState("");
  const [searchMois, setSearchMois] = useState("");
  const [searchAnnee, setSearchAnnee] = useState("");
  const [searchHeure, setSearchHeure] = useState("");
  const [searchMinute, setSearchMinute] = useState("");
  const [searchLieu, setSearchLieu] = useState("");
  const [searchCategorie, setSearchCategorie] = useState("professionnel");

  const handleSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | undefined> = { type: searchType };
      if (searchType === "id") params.id = Number(searchId);
      if (searchType === "date") { params.jour = Number(searchJour); params.mois = Number(searchMois); params.annee = Number(searchAnnee); }
      if (searchType === "heure") { params.heureDebut = Number(searchHeure); params.minuteDebut = Number(searchMinute); }
      if (searchType === "lieu") params.lieu = searchLieu;
      if (searchType === "categorie") params.categorie = searchCategorie;
      const data = await apiSearch(params);
      setResults(data);
      if (data.length === 0) toast("Aucun rendez-vous trouvé.", "info");
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur de recherche", "error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchType, searchId, searchJour, searchMois, searchAnnee, searchHeure, searchMinute, searchLieu, searchCategorie, toast]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await apiDeleteAppointment(id);
      toast("Rendez-vous supprimé.", "success");
      // Re-search
      handleSearch();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    }
  }, [handleSearch, toast]);

  const inputCls = "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--primary)]/40 focus:ring-1 focus:ring-[color:var(--primary)]/20 placeholder:text-[color:var(--muted)]/60";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Find appointments by ID, date, time, location, or category.</p>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filterChips.map((f) => (
          <button
            key={f.type}
            onClick={() => { setSearchType(f.type); setResults(null); }}
            className={[
              "inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium transition",
              searchType === f.type
                ? "border-[color:var(--primary)]/40 bg-[color:var(--primary)]/15 text-[color:var(--primary)]"
                : "border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:bg-white/[0.04] hover:text-[color:var(--foreground)]",
            ].join(" ")}
          >
            <span>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {/* Search input area */}
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchType}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {searchType === "id" && (
              <div>
                <label className="block text-xs text-[color:var(--muted)] mb-1.5">Appointment ID</label>
                <input
                  type="number"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter appointment ID..."
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            )}

            {searchType === "date" && (
              <div>
                <label className="block text-xs text-[color:var(--muted)] mb-1.5">Date</label>
                <div className="grid grid-cols-3 gap-2">
                  <input type="number" value={searchJour} onChange={(e) => setSearchJour(e.target.value)} placeholder="Day" className={inputCls} min={1} max={31} />
                  <input type="number" value={searchMois} onChange={(e) => setSearchMois(e.target.value)} placeholder="Month" className={inputCls} min={1} max={12} />
                  <input type="number" value={searchAnnee} onChange={(e) => setSearchAnnee(e.target.value)} placeholder="Year" className={inputCls} min={1900} max={2100} />
                </div>
              </div>
            )}

            {searchType === "heure" && (
              <div>
                <label className="block text-xs text-[color:var(--muted)] mb-1.5">Start Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" value={searchHeure} onChange={(e) => setSearchHeure(e.target.value)} placeholder="Hour (0-23)" className={inputCls} min={0} max={23} />
                  <input type="number" value={searchMinute} onChange={(e) => setSearchMinute(e.target.value)} placeholder="Minute (0-59)" className={inputCls} min={0} max={59} />
                </div>
              </div>
            )}

            {searchType === "lieu" && (
              <div>
                <label className="block text-xs text-[color:var(--muted)] mb-1.5">Location</label>
                <input
                  type="text"
                  value={searchLieu}
                  onChange={(e) => setSearchLieu(e.target.value)}
                  placeholder="bureau, cafe, cabinet..."
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            )}

            {searchType === "categorie" && (
              <div>
                <label className="block text-xs text-[color:var(--muted)] mb-1.5">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["professionnel", "personnel", "medical"] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSearchCategorie(c)}
                      className={[
                        "rounded-xl border py-2.5 text-xs font-medium transition",
                        searchCategorie === c
                          ? `cat-bg-${c} cat-${c} border-current`
                          : "border-white/[0.08] bg-white/[0.03] text-[color:var(--muted)] hover:bg-white/[0.06]",
                      ].join(" ")}
                    >
                      <span className={`inline-block h-2 w-2 rounded-full mr-1.5 cat-dot-${c}`} />
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="mt-4 w-full rounded-xl py-2.5 text-sm font-semibold text-black transition disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-black/30 border-t-black animate-spin" />
              Searching...
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </span>
          )}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-wider">
                Results ({results.length})
              </div>
              {results.length > 0 && (
                <button onClick={() => setResults(null)} className="text-xs text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition">
                  Clear
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-14 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <div className="text-sm font-medium">No results found</div>
                <div className="text-xs text-[color:var(--muted)] mt-1">Try a different search term or filter.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04] hover:border-white/[0.10] cat-glow-${r.categorie}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: catColor[r.categorie] }} />
                        <span className={`text-xs font-medium cat-${r.categorie}`}>{r.categorie}</span>
                        <span className="text-xs font-mono text-[color:var(--muted)]/50">#{r.id}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => { setEditRdv(r); setDrawerOpen(true); }}
                          className="h-6 w-6 flex items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition"
                        >
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="h-6 w-6 flex items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-red-400 transition"
                        >
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="text-lg font-semibold tracking-tight">
                      {formatTime(r.heureDebut, r.minuteDebut)} → {formatTime(r.heureFin, r.minuteFin)}
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--muted)]">
                      {formatDate(r.jour, r.mois, r.annee)} • {r.lieu}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AppointmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSearch}
        editingRdv={editRdv}
      />
    </div>
  );
}
