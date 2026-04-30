"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
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

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month - 1, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [rdvs, setRdvs] = useState<RDV[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRdv, setEditRdv] = useState<RDV | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    try { setRdvs(await apiListAppointments()); }
    catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth() + 1;

  // Map: day -> appointments
  const dayMap = useMemo(() => {
    const map = new Map<number, RDV[]>();
    for (const r of rdvs) {
      if (r.annee === year && r.mois === month) {
        if (!map.has(r.jour)) map.set(r.jour, []);
        map.get(r.jour)!.push(r);
      }
    }
    return map;
  }, [rdvs, year, month]);

  const selectedRdvs = selectedDay ? (dayMap.get(selectedDay) ?? []) : [];

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
    setSelectedDay(null);
  };

  const goToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
  };

  const handleDelete = useCallback(async (id: number) => {
    try {
      await apiDeleteAppointment(id);
      toast("Rendez-vous supprimé.", "success");
      load();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    }
  }, [load, toast]);

  // Calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[color:var(--accent)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Monthly view of your schedule.</p>
        </div>
        <button
          onClick={() => { setEditRdv(null); setDrawerOpen(true); }}
          className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black"
          style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <div className="xl:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextMonth} className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <h2 className="text-lg font-semibold tracking-tight">{MONTHS[month - 1]} {year}</h2>
            <button onClick={goToday} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition">
              Today
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-center text-[10px] font-medium uppercase tracking-wider text-[color:var(--muted)]/60 py-2">{w}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const isToday = isCurrentMonth && day === today.getDate();
              const isSelected = selectedDay === day;
              const hasAppts = dayMap.has(day);
              const appts = dayMap.get(day) ?? [];
              const uniqueCats = [...new Set(appts.map((r) => r.categorie))];

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={[
                    "relative flex flex-col items-center rounded-xl py-2.5 sm:py-3 transition-all duration-200",
                    isSelected
                      ? "bg-white/[0.08] border border-[color:var(--primary)]/40 shadow-[0_0_20px_rgba(108,92,231,0.15)]"
                      : isToday
                        ? "bg-white/[0.04] border border-[color:var(--accent)]/30"
                        : "border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06]",
                  ].join(" ")}
                >
                  <span className={[
                    "text-sm font-medium",
                    isToday ? "text-[color:var(--accent)]" : isSelected ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]",
                  ].join(" ")}>{day}</span>
                  {hasAppts && (
                    <div className="flex gap-0.5 mt-1">
                      {uniqueCats.slice(0, 3).map((cat) => (
                        <span key={cat} className="h-1 w-1 rounded-full" style={{ background: catColor[cat] }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side panel — selected day's appointments */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-wider">Selected Day</div>
                    <div className="text-lg font-semibold tracking-tight mt-0.5">
                      {MONTHS[month - 1]} {selectedDay}, {year}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {selectedRdvs.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="text-3xl mb-2">📭</div>
                    <div className="text-sm text-[color:var(--muted)]">No appointments this day.</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedRdvs.map((r, i) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:bg-white/[0.04]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="h-2 w-2 rounded-full" style={{ background: catColor[r.categorie] }} />
                          <span className="text-sm font-semibold">{formatTime(r.heureDebut, r.minuteDebut)} → {formatTime(r.heureFin, r.minuteFin)}</span>
                        </div>
                        <div className="text-xs text-[color:var(--muted)]">📍 {r.lieu} • {r.categorie}</div>
                        <div className="text-[10px] text-[color:var(--muted)]/50 mt-1">ID {r.id}</div>
                        <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            onClick={() => { setEditRdv(r); setDrawerOpen(true); }}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition"
                          >Edit</button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] text-[color:var(--muted)] hover:text-red-400 transition"
                          >Delete</button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <div className="text-4xl mb-3">📅</div>
                <div className="text-sm font-medium">Select a day</div>
                <div className="text-xs text-[color:var(--muted)] mt-1">Click on a date to view its appointments.</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AppointmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={load}
        editingRdv={editRdv}
      />
    </div>
  );
}
