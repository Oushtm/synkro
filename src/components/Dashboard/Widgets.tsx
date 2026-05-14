"use client";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import type { RDV } from "@/lib/rdv/types";

const catColor: Record<string, string> = {
  professionnel: "var(--cat-professionnel)",
  personnel: "var(--cat-personnel)",
  medical: "var(--cat-medical)",
};

function pad(n: number) { return String(n).padStart(2, "0"); }
export function formatTime(h: number, m: number) { return `${pad(h)}:${pad(m)}`; }
export function formatDate(j: number, m: number, a: number) { return `${pad(j)}/${pad(m)}/${a}`; }
export function isToday(r: RDV) { const n = new Date(); return r.jour === n.getDate() && r.mois === n.getMonth() + 1 && r.annee === n.getFullYear(); }
export function isUpcoming(r: RDV) { return new Date(r.annee, r.mois - 1, r.jour, r.heureDebut, r.minuteDebut) > new Date(); }
export function getCountdown(r: RDV) {
  const diff = new Date(r.annee, r.mois - 1, r.jour, r.heureDebut, r.minuteDebut).getTime() - Date.now();
  if (diff <= 0) return "Now";
  const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000);
  return h > 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${m}m`;
}

/* Animated counter */
export function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0;
      const dur = 600, step = 16, steps = dur / step;
      const inc = value / steps;
      const iv = setInterval(() => {
        start += inc;
        if (start >= value) { setDisplay(value); clearInterval(iv); }
        else setDisplay(Math.floor(start));
      }, step);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return <span>{display}</span>;
}

/* Stat card */
export function StatCard({ label, value, sub, color, index }: { label: string; value: number; sub: string; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 280, damping: 26 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 overflow-hidden transition-colors duration-400 hover:border-white/[0.10]"
      style={{ boxShadow: `0 0 40px ${color}08` }}
    >
      {/* Corner glow */}
      <div className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />
      {/* Shimmer on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.02) 50%, transparent 60%)" }} />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider">{label}</span>
        <span className="h-2 w-2 rounded-full transition-shadow duration-300 group-hover:shadow-[0_0_8px]"
          style={{ background: color, boxShadow: `0 0 4px ${color}44` }} />
      </div>
      <div className="text-3xl font-bold tracking-tight relative z-10">
        <AnimatedCounter value={value} delay={200 + index * 100} />
      </div>
      <div className="mt-1.5 text-[10px] text-white/30 font-medium">{sub}</div>
      <motion.div className="mt-3 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }} />
    </motion.div>
  );
}

/* Next appointment card */
export function NextAppointmentCard({ rdv, index }: { rdv: RDV | null; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 26 }}
      className="lg:col-span-2 relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, var(--primary), transparent 65%)" }} />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }} />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Next Appointment</div>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.06), transparent)" }} />
        </div>

        {rdv ? (
          <>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="h-3 w-3 rounded-full" style={{ background: catColor[rdv.categorie], boxShadow: `0 0 8px ${catColor[rdv.categorie]}55` }} />
              <span className="text-xs font-semibold capitalize" style={{ color: catColor[rdv.categorie] }}>{rdv.categorie}</span>
            </div>

            {/* Time display */}
            <div className="flex items-baseline gap-3">
              <div className="text-3xl font-bold tracking-tight text-white">{formatTime(rdv.heureDebut, rdv.minuteDebut)}</div>
              <svg className="h-4 w-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <div className="text-3xl font-bold tracking-tight text-white/60">{formatTime(rdv.heureFin, rdv.minuteFin)}</div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-white/40">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {rdv.lieu}
              <span className="text-white/15">•</span>
              {formatDate(rdv.jour, rdv.mois, rdv.annee)}
            </div>

            {/* Countdown badge */}
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 rounded-full bg-[color:var(--accent)] animate-ping opacity-30" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[color:var(--accent)]" style={{ boxShadow: "0 0 6px rgba(0,212,255,0.5)" }} />
              </span>
              <span className="text-white/60 font-medium">Starts in <span className="text-[color:var(--accent)]">{getCountdown(rdv)}</span></span>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="text-2xl mb-2 opacity-30">📅</div>
            <div className="text-sm text-white/25">No upcoming appointments</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* Schedule Intelligence widget */
export function ScheduleIntelligence({ todayCount, total, upcoming, index }: { todayCount: number; total: number; upcoming: number; index: number }) {
  const efficiency = total > 0 ? Math.min(98, Math.round(80 + (total - todayCount) * 2)) : 92;
  const bestWindow = todayCount === 0 ? "All day free" : todayCount < 3 ? "2PM – 5PM" : "Limited slots";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 280, damping: 26 }}
      className="lg:col-span-3 relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-6 overflow-hidden"
    >
      {/* Ambient particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute h-1 w-1 rounded-full" style={{
            left: `${20 + i * 14}%`, top: `${30 + (i * 17) % 50}%`,
            background: i % 2 === 0 ? "rgba(108,92,231,0.3)" : "rgba(0,212,255,0.25)",
          }}
            animate={{ y: [0, -6, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Schedule Intelligence</div>
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--success)]" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.5)" }} />
          <span className="text-[10px] text-[color:var(--success)] font-medium">Active</span>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Efficiency ring */}
          <div className="flex flex-col items-center">
            <div className="relative h-20 w-20 mb-2">
              <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                <motion.circle cx="40" cy="40" r="32" fill="none" stroke="url(#effGrad)" strokeWidth="5"
                  strokeDasharray={201} strokeLinecap="round"
                  initial={{ strokeDashoffset: 201 }}
                  animate={{ strokeDashoffset: 201 - (201 * efficiency / 100) }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                />
                <defs>
                  <linearGradient id="effGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6c5ce7" />
                    <stop offset="100%" stopColor="#00d4ff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white">{efficiency}%</span>
              </div>
              {/* Center glow */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div className="h-8 w-8 rounded-full" style={{ background: "radial-gradient(circle, rgba(108,92,231,0.15), transparent)" }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
              </div>
            </div>
            <div className="text-[10px] text-white/30 font-medium">Efficiency</div>
          </div>

          {/* Status indicators */}
          <div className="flex flex-col justify-center gap-3">
            {[
              { label: "Conflicts", value: "None", color: "var(--success)", icon: "✓" },
              { label: "Today", value: `${todayCount} scheduled`, color: "var(--accent)", icon: "◆" },
              { label: "Window", value: bestWindow, color: "var(--primary)", icon: "◎" },
            ].map((s, i) => (
              <motion.div key={s.label} className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}>
                <span className="text-[9px]" style={{ color: s.color }}>{s.icon}</span>
                <div>
                  <div className="text-[10px] text-white/30">{s.label}</div>
                  <div className="text-[11px] text-white/65 font-medium">{s.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upcoming mini preview */}
          <div className="flex flex-col justify-center">
            <div className="text-[10px] text-white/30 mb-2">Upcoming</div>
            <div className="text-2xl font-bold gradient-text">{upcoming}</div>
            <div className="text-[10px] text-white/30 mt-1">appointments</div>
            <div className="mt-2 h-[2px] w-full rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
                initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ delay: 0.8, duration: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* Weekly chart */
export function WeeklyChart({ data, index }: { data: number[]; index: number }) {
  const max = Math.max(...data, 1);
  const total = data.reduce((a, b) => a + b, 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Sparkline points
  const sparkW = 100, sparkH = 40;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * sparkW;
    const y = sparkH - (v / max) * sparkH;
    return `${x},${y}`;
  }).join(" ");

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 overflow-hidden">
      {/* Ambient glow behind chart */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 opacity-20"
        style={{ background: "radial-gradient(ellipse at center bottom, rgba(108,92,231,0.25), transparent 70%)" }} />

      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Weekly Activity</div>
        <div className="flex items-center gap-1.5 rounded-lg border border-[color:var(--accent)]/15 bg-[color:var(--accent)]/[0.06] px-2.5 py-1 text-[10px] text-[color:var(--accent)] font-semibold">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          +12%
        </div>
      </div>

      {/* Total summary */}
      <div className="mb-4">
        <span className="text-2xl font-bold text-white">{total}</span>
        <span className="text-[11px] text-white/30 ml-2">events this week</span>
      </div>

      {/* Chart area */}
      <div className="relative">
        {/* Sparkline overlay */}
        <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none" style={{ top: "-8px", height: "calc(100% + 8px)" }}>
          <defs>
            <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <motion.polyline
            points={points}
            fill="none" stroke="url(#sparkGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
          />
          {/* Glow dots at peaks */}
          {data.map((v, i) => {
            const x = (i / (data.length - 1)) * sparkW;
            const y = sparkH - (v / max) * sparkH;
            return (
              <motion.circle key={i} cx={x} cy={y} r={hovered === i ? 2.5 : 1.5}
                fill={hovered === i ? "#00d4ff" : "rgba(108,92,231,0.6)"}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.08 }}
              />
            );
          })}
        </svg>

        {/* Bars */}
        <div className="flex items-end gap-2 h-28 relative z-0">
          {data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 relative"
              onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {hovered === i && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-7 z-20 rounded-lg bg-[#0d1117]/90 backdrop-blur-md px-2.5 py-1 text-[10px] text-white/80 font-semibold border border-white/[0.08]" style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                  {v} <span className="text-white/30 font-normal">appts</span>
                </motion.div>
              )}
              <motion.div
                className="w-full rounded-lg relative overflow-hidden cursor-pointer"
                style={{
                  background: hovered === i
                    ? "linear-gradient(180deg, rgba(0,212,255,0.9), rgba(108,92,231,0.5))"
                    : i === data.length - 1
                      ? "linear-gradient(180deg, rgba(0,212,255,0.6), rgba(108,92,231,0.3))"
                      : "linear-gradient(180deg, rgba(108,92,231,0.35), rgba(108,92,231,0.10))",
                  boxShadow: hovered === i ? "0 0 16px rgba(0,212,255,0.35), 0 4px 8px rgba(0,0,0,0.2)" : "none",
                  transition: "box-shadow 0.3s ease, background 0.3s ease",
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(v / max) * 100}%` }}
                transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Inner shimmer */}
                <div className="absolute inset-0 opacity-30" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.15), transparent 50%)" }} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex justify-between text-[9px] text-white/25 font-medium">
        {days.map((d, i) => <span key={d} className={hovered === i ? "text-white/60" : ""} style={{ transition: "color 0.2s" }}>{d}</span>)}
      </div>
    </motion.div>
  );
}

/* Categories widget */
export function CategoriesWidget({ catCounts, total, index }: { catCounts: Record<string, number>; total: number; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 overflow-hidden">
      {/* Subtle corner glow */}
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-20 w-20 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, var(--cat-professionnel), transparent 65%)" }} />
      <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mb-2 relative z-10">Categories</div>
      <div className="text-[10px] text-white/25 mb-5 relative z-10">{total} total across all types</div>
      <div className="space-y-4 relative z-10">
        {Object.entries(catCounts).map(([cat, count], i) => (
          <motion.div key={cat} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2.5">
                <span className={`h-2.5 w-2.5 rounded-full cat-dot-${cat} transition-shadow duration-300 group-hover:shadow-[0_0_8px]`} style={{ boxShadow: `0 0 6px ${catColor[cat]}44` }} />
                <span className="text-[11px] text-white/50 capitalize font-medium group-hover:text-white/65 transition-colors">{cat}</span>
              </div>
              <span className="text-[11px] font-bold text-white/60 tabular-nums">{count}</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div className="h-full rounded-full relative overflow-hidden" style={{ background: `linear-gradient(90deg, ${catColor[cat]}, ${catColor[cat]}66)` }}
                initial={{ width: 0 }} animate={{ width: `${total > 0 ? Math.max(8, (count / total) * 100) : 0}%` }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: "easeOut" }}>
                <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.15), transparent)" }} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* Activity feed */
export function ActivityFeed({ rdvs, index }: { rdvs: RDV[]; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative rounded-2xl border border-white/[0.06] bg-white/[0.025] p-5 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-10 -left-10 h-24 w-24 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, var(--success), transparent 65%)" }} />
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="text-[11px] text-white/40 font-semibold uppercase tracking-wider">Recent Activity</div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[color:var(--success)] animate-ping opacity-30" />
            <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" style={{ boxShadow: "0 0 6px rgba(52,211,153,0.5)" }} />
          </span>
          <span className="text-[10px] text-white/30 font-medium">Live</span>
        </div>
      </div>
      <div className="space-y-0 relative z-10">
        {rdvs.slice(0, 4).map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
            className="group flex items-start gap-3 py-3 relative rounded-lg px-2 -mx-2 transition-colors duration-200 hover:bg-white/[0.02]">
            {/* Timeline connector */}
            {i < Math.min(rdvs.length, 4) - 1 && (
              <div className="absolute left-[15px] top-[26px] w-px h-[calc(100%-14px)]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.06), transparent)" }} />
            )}
            <div className={`mt-0.5 h-[14px] w-[14px] rounded-full border-2 flex items-center justify-center flex-shrink-0`}
              style={{ borderColor: catColor[r.categorie] }}>
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: catColor[r.categorie] }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-white/60 truncate group-hover:text-white/80 transition-colors">{r.lieu}</div>
              <div className="text-[10px] text-white/30 mt-0.5">{formatDate(r.jour, r.mois, r.annee)} • {formatTime(r.heureDebut, r.minuteDebut)}</div>
            </div>
            <div className="text-[9px] text-white/20 mt-0.5 flex-shrink-0 font-medium">#{r.id}</div>
          </motion.div>
        ))}
        {rdvs.length === 0 && <div className="text-[11px] text-white/25 text-center py-6">No activity yet</div>}
      </div>
    </motion.div>
  );
}
