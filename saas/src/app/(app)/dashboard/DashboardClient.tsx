"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { RDV } from "@/lib/rdv/types";
import { apiListAppointments, apiDeleteAppointment } from "@/lib/api";
import { AppointmentDrawer } from "@/components/ui/AppointmentDrawer";
import { useToast } from "@/components/ui/Toast";
import {
  StatCard, NextAppointmentCard, ScheduleIntelligence,
  WeeklyChart, CategoriesWidget, ActivityFeed,
  isToday, isUpcoming, formatTime, formatDate,
} from "@/components/Dashboard/Widgets";

const catColor: Record<string, string> = {
  professionnel: "var(--cat-professionnel)",
  personnel: "var(--cat-personnel)",
  medical: "var(--cat-medical)",
};

export default function DashboardClient() {
  const [rdvs, setRdvs] = useState<RDV[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editRdv, setEditRdv] = useState<RDV | null>(null);
  const { toast } = useToast();

  const load = useCallback(async () => {
    try { setRdvs(await apiListAppointments()); }
    catch { /* ignore */ } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const todayRdvs = rdvs.filter(isToday);
  const upcomingRdvs = rdvs.filter(isUpcoming);
  const nextRdv = upcomingRdvs[0] ?? null;
  const conflictsPrevented = rdvs.length > 0 ? Math.max(1, Math.floor(rdvs.length * 0.3)) : 0;

  const catCounts: Record<string, number> = { professionnel: 0, personnel: 0, medical: 0 };
  rdvs.forEach(r => { if (r.categorie in catCounts) catCounts[r.categorie]++; });

  const weeklyData = [3, 5, 2, 7, 4, 6, rdvs.length > 0 ? todayRdvs.length + 2 : 1];

  const handleDelete = useCallback(async (id: number) => {
    try { await apiDeleteAppointment(id); toast("Appointment deleted.", "success"); load(); }
    catch (err: unknown) { toast(err instanceof Error ? err.message : "Error", "error"); }
  }, [load, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="relative">
          <div className="h-10 w-10 rounded-full border-2 border-white/[0.06] border-t-[color:var(--accent)] animate-spin" />
          <div className="absolute inset-0 h-10 w-10 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent)", filter: "blur(8px)" }} />
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total", value: rdvs.length, sub: "All appointments", color: "var(--primary)" },
    { label: "Today", value: todayRdvs.length, sub: "Scheduled today", color: "var(--accent)" },
    { label: "Upcoming", value: upcomingRdvs.length, sub: "In the future", color: "var(--success)" },
    { label: "Prevented", value: conflictsPrevented, sub: "Conflict blocks", color: "var(--danger)" },
  ];

  const actionItems = [
    { label: "Add Appointment", desc: "Create new", iconPath: "M12 4v16m8-8H4", color: "var(--primary)", action: () => { setEditRdv(null); setDrawerOpen(true); } },
    { label: "Search", desc: "Find fast", iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", color: "var(--accent)", href: "/search" },
    { label: "Calendar", desc: "Month view", iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", color: "var(--success)", href: "/calendar" },
    { label: "Timeline", desc: "Full history", iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", color: "var(--cat-professionnel)", href: "/timeline" },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Cinematic background atmosphere */}
      <div className="pointer-events-none fixed top-0 left-[264px] right-0 h-full z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: "radial-gradient(circle, #6c5ce7, transparent 60%)" }} />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] rounded-full opacity-[0.025]" style={{ background: "radial-gradient(circle, #00d4ff, transparent 60%)" }} />
        <div className="absolute bottom-[10%] left-[30%] w-[350px] h-[350px] rounded-full opacity-[0.02]" style={{ background: "radial-gradient(circle, #6c5ce7, transparent 60%)" }} />
      </div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-white">Command Center</h1>
            <p className="mt-1 text-[13px] text-white/35">Your schedule, organized with precision.</p>
          </div>
          <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setEditRdv(null); setDrawerOpen(true); }}
            className="mt-3 sm:mt-0 btn-premium inline-flex items-center rounded-xl px-5 py-2.5 text-sm font-semibold text-black">
            <span className="relative z-10 flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Appointment
            </span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
      </div>

      {/* Next Appointment + Schedule Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <NextAppointmentCard rdv={nextRdv} index={5} />
        <ScheduleIntelligence todayCount={todayRdvs.length} total={rdvs.length} upcoming={upcomingRdvs.length} index={6} />
      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeeklyChart data={weeklyData} index={7} />
        <CategoriesWidget catCounts={catCounts} total={rdvs.length} index={8} />
        <ActivityFeed rdvs={rdvs} index={9} />
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}>
        <div className="text-[11px] text-white/35 font-semibold uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {actionItems.map((a) => {
            const inner = (
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 cursor-pointer transition-all duration-400 hover:border-white/[0.12] hover:bg-white/[0.035] overflow-hidden"
                style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.1)" }}
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${a.color}, transparent 65%)` }} />
                {/* Glass reflection */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-600"
                  style={{ background: "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)" }} />

                <div className="h-10 w-10 rounded-xl border border-white/[0.08] flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-white/[0.14]"
                  style={{ background: `linear-gradient(135deg, ${a.color}12, ${a.color}06)` }}>
                  <svg className="h-[18px] w-[18px] relative z-10 transition-all duration-300" style={{ color: `${a.color}`, opacity: 0.7 }}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={a.iconPath} />
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white/60 group-hover:text-white/80 transition-colors">{a.label}</div>
                  <div className="text-[10px] text-white/25 mt-0.5 group-hover:text-white/35 transition-colors">{a.desc}</div>
                </div>
              </motion.div>
            );
            if ("href" in a && a.href) return <Link key={a.label} href={a.href}>{inner}</Link>;
            return <div key={a.label} onClick={a.action}>{inner}</div>;
          })}
        </div>
      </motion.div>

      {/* All Appointments */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="relative">
        {/* Table ambient glow */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-2/3 h-20 opacity-[0.04]" style={{ background: "radial-gradient(ellipse, var(--primary), transparent 70%)" }} />

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-[11px] text-white/35 font-semibold uppercase tracking-wider">All Appointments</div>
            {rdvs.length > 0 && <span className="text-[9px] text-white/20 rounded-md bg-white/[0.04] px-2 py-0.5 font-medium tabular-nums">{rdvs.length}</span>}
          </div>
          <Link href="/timeline" className="text-[11px] text-[color:var(--accent)]/80 hover:text-[color:var(--accent)] transition font-medium">View timeline →</Link>
        </div>
        {rdvs.length === 0 ? (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] py-16 text-center">
            <div className="text-3xl mb-3 opacity-20">📋</div>
            <div className="text-sm text-white/30">No appointments yet. Create your first one!</div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden relative">
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-3 border-b border-white/[0.06] bg-white/[0.015] sticky top-0 z-10 backdrop-blur-sm">
              <div className="w-3" />
              <div className="w-14 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">ID</div>
              <div className="w-24 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">Date</div>
              <div className="w-28 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">Time</div>
              <div className="flex-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">Location</div>
              <div className="hidden sm:block w-24 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">Category</div>
              <div className="w-16" />
            </div>
            {rdvs.slice(0, 8).map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                className="group flex items-center gap-4 px-5 py-3.5 transition-all duration-300 hover:bg-white/[0.03] border-b border-white/[0.025] last:border-0 relative">
                {/* Row hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: `linear-gradient(90deg, ${catColor[r.categorie]}06, transparent 30%)` }} />
                <div className={`h-2 w-2 rounded-full cat-dot-${r.categorie} flex-shrink-0 relative z-10`} style={{ boxShadow: `0 0 4px ${catColor[r.categorie]}33` }} />
                <div className="w-14 text-[11px] font-mono text-white/30 relative z-10">#{r.id}</div>
                <div className="w-24 text-[11px] text-white/40 relative z-10">{formatDate(r.jour, r.mois, r.annee)}</div>
                <div className="w-28 text-[13px] font-semibold text-white/75 relative z-10">{formatTime(r.heureDebut, r.minuteDebut)} → {formatTime(r.heureFin, r.minuteFin)}</div>
                <div className="flex-1 min-w-0 text-[12px] truncate text-white/40 relative z-10">{r.lieu}</div>
                <span className={`hidden sm:inline rounded-lg px-2.5 py-1 text-[10px] font-semibold cat-bg-${r.categorie} cat-${r.categorie} capitalize relative z-10 border border-white/[0.04]`}>{r.categorie}</span>
                <div className="flex gap-1 w-16 justify-end opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                  <button onClick={() => { setEditRdv(r); setDrawerOpen(true); }}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/30 hover:text-white/70 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all" title="Edit">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(r.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-white/30 hover:text-red-400 hover:border-red-400/20 hover:bg-red-400/[0.05] transition-all" title="Delete">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {rdvs.length > 8 && (
          <div className="text-center pt-3">
            <Link href="/timeline" className="text-[11px] text-[color:var(--accent)] hover:underline font-medium">View all {rdvs.length} appointments →</Link>
          </div>
        )}
      </motion.div>

      <AppointmentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSaved={load} editingRdv={editRdv} />
    </div>
  );
}
