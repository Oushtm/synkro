"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { RDV } from "@/lib/rdv/types";
import { apiListAppointments, apiDeleteAppointment } from "@/lib/api";
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
function dateKey(r: RDV) { return `${r.annee}-${pad(r.mois)}-${pad(r.jour)}`; }

function groupByDate(rdvs: RDV[]): { date: string; label: string; items: RDV[] }[] {
  const map = new Map<string, RDV[]>();
  for (const r of rdvs) {
    const key = dateKey(r);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  const groups: { date: string; label: string; items: RDV[] }[] = [];
  for (const [key, items] of map) {
    const first = items[0]!;
    const d = new Date(first.annee, first.mois - 1, first.jour);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const tmrw = new Date(today); tmrw.setDate(tmrw.getDate() + 1);
    const isTomorrow = d.toDateString() === tmrw.toDateString();
    const label = isToday ? "Today" : isTomorrow ? "Tomorrow" : d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    groups.push({ date: key, label, items });
  }
  return groups;
}

export default function TimelinePage() {
  const [rdvs, setRdvs] = useState<RDV[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRdv, setEditRdv] = useState<RDV | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    try { setRdvs(await apiListAppointments()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await apiDeleteAppointment(id);
      toast("Rendez-vous supprimé.", "success");
      load();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    }
  }, [load, toast]);

  const groups = groupByDate(rdvs);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[color:var(--accent)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timeline</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Visual schedule sorted by date and time.</p>
        </div>
        <button
          onClick={() => { setEditRdv(null); setDrawerOpen(true); }}
          className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      {rdvs.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
          <div className="text-5xl mb-4">🕐</div>
          <div className="text-lg font-semibold mb-1">No appointments yet</div>
          <div className="text-sm text-[color:var(--muted)]">Your timeline will appear here once you create appointments.</div>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((g, gi) => (
            <motion.div
              key={g.date}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.06 }}
            >
              {/* Date header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }} />
                <h2 className="text-sm font-semibold tracking-tight">{g.label}</h2>
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="text-xs text-[color:var(--muted)]">{g.items.length} appointment{g.items.length > 1 ? "s" : ""}</span>
              </div>

              {/* Timeline items */}
              <div className="relative ml-[18px] border-l border-white/[0.06] pl-6 space-y-3">
                {g.items.map((r, ri) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.06 + ri * 0.04 }}
                    className="relative group"
                    onMouseEnter={() => setHoveredId(r.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[31px] top-4 h-3 w-3 rounded-full border-2 border-[color:var(--background)] transition"
                      style={{ background: catColor[r.categorie] }}
                    />

                    {/* Card */}
                    <div
                      className={[
                        "rounded-xl border p-4 transition-all duration-200",
                        hoveredId === r.id
                          ? "bg-white/[0.05] border-white/[0.12]"
                          : "bg-white/[0.02] border-white/[0.06]",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          {/* Time badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-base font-semibold">
                              {formatTime(r.heureDebut, r.minuteDebut)}
                            </div>
                            <svg className="h-3 w-3 text-[color:var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                            <div className="text-base font-semibold">
                              {formatTime(r.heureFin, r.minuteFin)}
                            </div>
                            <span className="text-xs text-[color:var(--muted)] ml-1">
                              ({(r.heureFin * 60 + r.minuteFin) - (r.heureDebut * 60 + r.minuteDebut)}min)
                            </span>
                          </div>

                          {/* Info row */}
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-[color:var(--muted)]">📍 {r.lieu}</span>
                            <span className={`rounded-lg px-2 py-0.5 text-xs font-medium cat-bg-${r.categorie} cat-${r.categorie}`}>
                              {r.categorie}
                            </span>
                            <span className="text-xs font-mono text-[color:var(--muted)]/60">ID {r.id}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                          <button
                            onClick={() => { setEditRdv(r); setDrawerOpen(true); }}
                            className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-red-400 transition"
                          >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>

                      {/* Hover preview - time bar */}
                      <AnimatePresence>
                        {hoveredId === r.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 pt-3 border-t border-white/[0.06]">
                              <div className="flex items-center gap-2">
                                <div className="text-[10px] text-[color:var(--muted)] w-10">00:00</div>
                                <div className="flex-1 relative h-2 rounded-full bg-white/[0.04]">
                                  <div
                                    className="absolute h-full rounded-full transition-all"
                                    style={{
                                      left: `${((r.heureDebut * 60 + r.minuteDebut) / 1440) * 100}%`,
                                      width: `${(((r.heureFin * 60 + r.minuteFin) - (r.heureDebut * 60 + r.minuteDebut)) / 1440) * 100}%`,
                                      background: catColor[r.categorie],
                                      opacity: 0.7,
                                    }}
                                  />
                                </div>
                                <div className="text-[10px] text-[color:var(--muted)] w-10 text-right">24:00</div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AppointmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={load}
        editingRdv={editRdv}
      />
    </div>
  );
}
