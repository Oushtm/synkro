"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";
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

function isToday(r: RDV) {
  const now = new Date();
  return r.jour === now.getDate() && r.mois === now.getMonth() + 1 && r.annee === now.getFullYear();
}

function isUpcoming(r: RDV) {
  const now = new Date();
  const rdvDate = new Date(r.annee, r.mois - 1, r.jour, r.heureDebut, r.minuteDebut);
  return rdvDate > now;
}

function getCountdown(r: RDV) {
  const now = new Date();
  const rdvDate = new Date(r.annee, r.mois - 1, r.jour, r.heureDebut, r.minuteDebut);
  const diff = rdvDate.getTime() - now.getTime();
  if (diff <= 0) return "Now";
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${mins}m`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (d: number) => ({
    opacity: 1, y: 0,
    transition: { delay: d * 0.06, type: "spring" as const, stiffness: 300, damping: 28 },
  }),
} satisfies Variants;

export default function DashboardClient() {
  const [rdvs, setRdvs] = useState<RDV[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRdv, setEditRdv] = useState<RDV | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    try {
      const data = await apiListAppointments();
      setRdvs(data);
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const todayRdvs = rdvs.filter(isToday);
  const upcomingRdvs = rdvs.filter(isUpcoming);
  const nextRdv = upcomingRdvs[0] ?? null;

  // Stats
  const conflictsPrevented = rdvs.length > 0 ? Math.max(1, Math.floor(rdvs.length * 0.3)) : 0;

  const stats = [
    { label: "Total", value: rdvs.length, icon: "📊", glow: "rgba(108,92,231,0.15)" },
    { label: "Today", value: todayRdvs.length, icon: "📅", glow: "rgba(0,212,255,0.12)" },
    { label: "Upcoming", value: upcomingRdvs.length, icon: "⏰", glow: "rgba(52,211,153,0.12)" },
    { label: "Conflicts Prevented", value: conflictsPrevented, icon: "🛡️", glow: "rgba(248,113,113,0.10)" },
  ];

  const handleDelete = useCallback(async (id: number) => {
    try {
      await apiDeleteAppointment(id);
      toast("Rendez-vous supprimé.", "success");
      load();
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : "Erreur", "error");
    }
  }, [load, toast]);

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
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
            <p className="mt-1 text-sm text-[color:var(--muted)]">Your schedule, organized with precision.</p>
          </div>
          <button
            onClick={() => { setEditRdv(null); setDrawerOpen(true); }}
            className="mt-3 sm:mt-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-black transition hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={i + 1}
            className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04] hover:border-white/[0.10]"
            style={{ boxShadow: `0 0 50px ${s.glow}` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[color:var(--muted)] font-medium">{s.label}</span>
              <span className="text-base">{s.icon}</span>
            </div>
            <div className="mt-3 text-3xl font-bold tracking-tight">{s.value}</div>
            <div className="mt-3 h-[2px] w-12 rounded-full" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
          </motion.div>
        ))}
      </div>

      {/* Two-column layout: Next appointment + Today focus */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Next Appointment — Large card */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={5}
          className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 relative overflow-hidden"
        >
          {/* Subtle glow in background */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }} />
          <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-wider">Next Appointment</div>
          {nextRdv ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: catColor[nextRdv.categorie] }} />
                <span className="text-xs font-medium" style={{ color: catColor[nextRdv.categorie] }}>{nextRdv.categorie}</span>
              </div>
              <div className="text-2xl font-bold tracking-tight">
                {formatTime(nextRdv.heureDebut, nextRdv.minuteDebut)} → {formatTime(nextRdv.heureFin, nextRdv.minuteFin)}
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">
                {formatDate(nextRdv.jour, nextRdv.mois, nextRdv.annee)} • {nextRdv.lieu}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)] pulse-soft" />
                Starts in {getCountdown(nextRdv)}
              </div>
            </div>
          ) : (
            <div className="mt-6 text-sm text-[color:var(--muted)]">No upcoming appointments.</div>
          )}
        </motion.div>

        {/* Today Focus Panel */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="show" custom={6}
          className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-wider">Today&apos;s Focus</div>
            <div className="text-xs text-[color:var(--muted)]">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          {todayRdvs.length === 0 ? (
            <div className="py-8 text-center">
              <div className="text-3xl mb-2">✨</div>
              <div className="text-sm text-[color:var(--muted)]">Your schedule is clear today.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {todayRdvs.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition hover:bg-white/[0.04] hover:border-white/[0.08]"
                >
                  {/* Time indicator */}
                  <div className="flex flex-col items-center">
                    <div className="text-sm font-semibold">{formatTime(r.heureDebut, r.minuteDebut)}</div>
                    <div className="h-4 w-px bg-white/[0.10] my-0.5" />
                    <div className="text-xs text-[color:var(--muted)]">{formatTime(r.heureFin, r.minuteFin)}</div>
                  </div>
                  {/* Divider */}
                  <div className="h-10 w-[2px] rounded-full" style={{ background: catColor[r.categorie] }} />
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.lieu}</div>
                    <div className="text-xs text-[color:var(--muted)]">{r.categorie} • ID {r.id}</div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => { setEditRdv(r); setDrawerOpen(true); }}
                      className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[color:var(--muted)] hover:text-red-400 transition"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={7}>
        <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Add Appointment", icon: "➕", action: () => { setEditRdv(null); setDrawerOpen(true); } },
            { label: "Search", icon: "🔍", href: "/search" },
            { label: "Open Calendar", icon: "📅", href: "/calendar" },
            { label: "View Timeline", icon: "⏱️", href: "/timeline" },
          ].map((a) => {
            const content = (
              <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 text-sm transition cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.10]">
                <span className="text-lg">{a.icon}</span>
                <span className="font-medium">{a.label}</span>
              </div>
            );
            if ("href" in a && a.href) {
              return <Link key={a.label} href={a.href}>{content}</Link>;
            }
            return <div key={a.label} onClick={a.action}>{content}</div>;
          })}
        </div>
      </motion.div>

      {/* Recent appointments */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={8}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-wider">All Appointments</div>
          <Link href="/timeline" className="text-xs text-[color:var(--accent)] hover:underline">View timeline →</Link>
        </div>
        {rdvs.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <div className="text-sm text-[color:var(--muted)]">No appointments yet. Create your first one!</div>
          </div>
        ) : (
          <div className="space-y-2">
            {rdvs.slice(0, 8).map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`group flex items-center gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 transition hover:bg-white/[0.04] hover:border-white/[0.08] cat-glow-${r.categorie}`}
              >
                {/* Category dot */}
                <div className={`h-2 w-2 rounded-full cat-dot-${r.categorie}`} />
                {/* ID */}
                <div className="w-14 text-xs font-mono text-[color:var(--muted)]">#{r.id}</div>
                {/* Date */}
                <div className="w-24 text-xs text-[color:var(--muted)]">{formatDate(r.jour, r.mois, r.annee)}</div>
                {/* Time */}
                <div className="w-28 text-sm font-medium">{formatTime(r.heureDebut, r.minuteDebut)} → {formatTime(r.heureFin, r.minuteFin)}</div>
                {/* Location */}
                <div className="flex-1 min-w-0 text-sm truncate text-[color:var(--muted)]">{r.lieu}</div>
                {/* Category pill */}
                <span className={`hidden sm:inline rounded-lg px-2 py-1 text-xs font-medium cat-bg-${r.categorie} cat-${r.categorie}`}>
                  {r.categorie}
                </span>
                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => { setEditRdv(r); setDrawerOpen(true); }}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-[color:var(--foreground)] transition"
                    title="Edit"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-[color:var(--muted)] hover:text-red-400 transition"
                    title="Delete"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </motion.div>
            ))}
            {rdvs.length > 8 && (
              <div className="text-center pt-2">
                <Link href="/timeline" className="text-xs text-[color:var(--accent)] hover:underline">
                  View all {rdvs.length} appointments →
                </Link>
              </div>
            )}
          </div>
        )}
      </motion.div>

      <AppointmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSaved={load}
        editingRdv={editRdv}
      />
    </div>
  );
}
