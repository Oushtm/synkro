"use client";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 220, damping: 26 } },
} satisfies Variants;

const stats = [
  { value: "3.2x", label: "Faster scheduling", desc: "Compared to manual calendar management" },
  { value: "0", label: "Conflicts", desc: "Intelligent overlap prevention engine" },
  { value: "99.9%", label: "Uptime", desc: "Enterprise-grade reliability guarantee" },
  { value: "< 50ms", label: "Response time", desc: "Instant search across all entries" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Product Lead at Vercel", text: "Synkro replaced three separate tools for us. The conflict-free engine alone saves hours per week.", avatar: "SC" },
  { name: "Marc Dubois", role: "Freelance Consultant", text: "The precision of the scheduling validation is unreal. Zero overlap, zero stress. My clients are impressed.", avatar: "MD" },
  { name: "Aisha Patel", role: "CTO at Streamline", text: "We integrated Synkro for our entire team. The real-time timeline view is exactly what we needed.", avatar: "AP" },
];

const integrations = [
  { name: "Google Calendar", icon: "📅", color: "rgba(66,133,244,0.15)" },
  { name: "Slack", icon: "💬", color: "rgba(74,21,75,0.2)" },
  { name: "Notion", icon: "📝", color: "rgba(255,255,255,0.06)" },
  { name: "Zoom", icon: "🎥", color: "rgba(45,140,255,0.15)" },
  { name: "Teams", icon: "👥", color: "rgba(80,80,200,0.15)" },
  { name: "Zapier", icon: "⚡", color: "rgba(255,109,0,0.12)" },
];

export function StatsSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 section-glow">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-widest">Productivity</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">Numbers that speak for themselves</div>
      </motion.div>
      <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 260, damping: 24 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 text-center premium-card"
          >
            <div className="text-3xl font-bold tracking-tight gradient-text">{s.value}</div>
            <div className="mt-2 text-sm font-medium text-white">{s.label}</div>
            <div className="mt-1 text-xs text-[color:var(--muted)] leading-relaxed">{s.desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 section-glow">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-widest">Testimonials</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">Loved by teams worldwide</div>
      </motion.div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -4 }}
            className="shine-border rounded-2xl bg-white/[0.03] p-6 premium-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}>
                {t.avatar}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-[color:var(--muted)]">{t.role}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[color:var(--muted)]">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-4 flex gap-1">
              {[1,2,3,4,5].map(s => <span key={s} className="text-xs" style={{ color: "#fbbf24" }}>★</span>)}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function IntegrationsSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 section-glow">
      <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="text-center">
        <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-widest">Integrations</div>
        <div className="mt-2 text-3xl font-semibold tracking-tight">Works with your favorite tools</div>
        <div className="mt-2 text-sm text-[color:var(--muted)] max-w-lg mx-auto">Connect Synkro with the tools you already use. Seamless two-way sync keeps everything in harmony.</div>
      </motion.div>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {integrations.map((int, i) => (
          <motion.div
            key={int.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, scale: 1.04 }}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] p-5 transition-all duration-300 hover:border-white/[0.12] cursor-default"
            style={{ background: int.color }}
          >
            <span className="text-2xl">{int.icon}</span>
            <span className="text-xs font-medium text-white/80">{int.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function CalendarPreviewSection() {
  const days = Array.from({ length: 35 }, (_, i) => {
    const day = i - 3;
    const hasEvent = [3, 7, 12, 15, 18, 22, 25, 28].includes(day);
    const isToday = day === 15;
    return { day, hasEvent, isToday, valid: day >= 1 && day <= 31 };
  });

  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 section-glow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-widest">Calendar View</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">Your month at a glance</div>
          <div className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] max-w-md">
            Navigate through months with a beautiful, interactive calendar. Appointments are color-coded by category and displayed inline for instant context.
          </div>
          <div className="mt-6 flex flex-col gap-3">
            {["Color-coded categories", "Instant day-view drill down", "Conflict warnings at a glance"].map((f, i) => (
              <motion.div key={f} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                {f}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="shine-border rounded-2xl bg-white/[0.03] p-5 glass-reflection">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">May 2026</div>
            <div className="flex gap-2">
              <div className="h-6 w-6 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-xs text-[color:var(--muted)]">‹</div>
              <div className="h-6 w-6 rounded-lg border border-white/10 bg-white/[0.03] flex items-center justify-center text-xs text-[color:var(--muted)]">›</div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => <div key={d} className="text-[10px] text-[color:var(--muted)] py-1">{d}</div>)}
            {days.map((d, i) => (
              <div key={i} className={`relative h-8 rounded-lg flex items-center justify-center text-xs transition-all ${
                !d.valid ? "text-transparent" : d.isToday ? "bg-gradient-to-br from-[#6c5ce7] to-[#00d4ff] text-white font-bold" : "text-[color:var(--muted)] hover:bg-white/[0.04]"
              }`}>
                {d.valid ? d.day : ""}
                {d.hasEvent && d.valid && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full" style={{ background: d.day % 3 === 0 ? "var(--cat-professionnel)" : d.day % 3 === 1 ? "var(--cat-personnel)" : "var(--cat-medical)" }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-20 section-glow">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="shine-border rounded-2xl bg-white/[0.03] p-6 order-2 lg:order-1">
          <div className="flex items-center gap-3 mb-5">
            <div className="text-sm font-semibold text-white">Team Activity</div>
            <span className="h-2 w-2 rounded-full bg-[color:var(--success)] pulse-soft" />
            <span className="text-xs text-[color:var(--muted)]">Live</span>
          </div>
          <div className="space-y-3">
            {[
              { user: "AK", action: "Created appointment", time: "2 min ago", color: "#6c5ce7" },
              { user: "SM", action: "Modified schedule", time: "5 min ago", color: "#00d4ff" },
              { user: "JD", action: "Resolved conflict", time: "12 min ago", color: "#34d399" },
              { user: "LP", action: "Added to calendar", time: "18 min ago", color: "#a78bfa" },
            ].map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ background: a.color }}>{a.user}</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-white">{a.action}</div>
                  <div className="text-[10px] text-[color:var(--muted)]">{a.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="order-1 lg:order-2">
          <div className="text-xs text-[color:var(--muted)] font-medium uppercase tracking-widest">Collaboration</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">Built for teams</div>
          <div className="mt-4 text-sm leading-relaxed text-[color:var(--muted)] max-w-md">
            Real-time collaboration with your team. See who&apos;s scheduling what, resolve conflicts instantly, and keep everyone in sync.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
