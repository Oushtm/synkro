"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, type: "spring" as const, stiffness: 320, damping: 28 },
  }),
} satisfies Variants;

const reveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 240, damping: 28 } },
} satisfies Variants;

function GlowOrb({ className, color }: { className: string; color: string }) {
  return (
    <motion.div
      aria-hidden
      className={className}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${color}, transparent 60%)`,
        filter: "blur(10px)",
      }}
      initial={{ opacity: 0.7, scale: 0.9 }}
      animate={{ opacity: [0.65, 0.95, 0.7], scale: [0.95, 1.05, 0.98] }}
      transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function Icon({ name }: { name: "shield" | "search" | "spark" | "timeline" }) {
  const common = "h-4 w-4";
  if (name === "shield")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
          stroke="rgba(0,212,255,0.9)"
          strokeWidth="1.6"
        />
        <path
          d="M8.5 12.2l2.1 2.1 5-5"
          stroke="rgba(108,92,231,0.95)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (name === "search")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path
          d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
          stroke="rgba(108,92,231,0.95)"
          strokeWidth="1.6"
        />
        <path
          d="M16.3 16.3L21 21"
          stroke="rgba(0,212,255,0.9)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  if (name === "timeline")
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none">
        <path d="M5 7h10" stroke="rgba(233,231,255,0.9)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 12h14" stroke="rgba(0,212,255,0.9)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 17h8" stroke="rgba(108,92,231,0.95)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="18" cy="7" r="1.6" fill="rgba(0,212,255,0.9)" />
      </svg>
    );
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l2.8 6.2L21 9l-4.7 4.2L17.7 21 12 17.8 6.3 21l1.4-7.8L3 9l6.2-.8L12 2z"
        stroke="rgba(108,92,231,0.95)"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ParticleField() {
  const dots = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: (i * 37) % 100,
    top: (i * 53) % 100,
    s: 1 + ((i * 19) % 10) / 10,
    o: 0.25 + ((i * 13) % 40) / 100,
    d: 4 + ((i * 7) % 10),
  }));
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {dots.map((p) => (
        <motion.span
          key={p.id}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: "rgba(255,255,255,0.35)",
            opacity: p.o,
            filter: "blur(0.2px)",
          }}
          initial={{ y: 0, x: 0 }}
          animate={{ y: [0, -8 * p.s, 0], x: [0, 6 * p.s, 0] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function LandingClient() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <nav
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          scrolled
            ? "bg-[rgba(10,15,30,0.75)] backdrop-blur-[16px] border-b border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <header
          className={[
            "mx-auto flex w-full max-w-[1200px] items-center justify-between px-6 transition-all duration-500 ease-in-out",
            scrolled ? "h-14" : "h-[72px]",
          ].join(" ")}
        >
          <Link href="/" className="flex items-center gap-3 group transition-all duration-200">
            <div
              className={[
                "relative transition-all duration-500 ease-in-out group-hover:scale-105",
                scrolled ? "h-7 w-7" : "h-9 w-9",
              ].join(" ")}
              style={{
                filter: scrolled
                  ? "drop-shadow(0 0 8px rgba(108,92,231,0.4))"
                  : "drop-shadow(0 0 12px rgba(108,92,231,0.3))",
              }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00d4ff] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50" />
              <Image src="/logo.svg" alt="Synkro Logo" fill className="object-contain relative z-10" />
            </div>
            <div className="leading-tight">
              <div
                className={[
                  "font-semibold tracking-tight transition-all duration-500 text-white/90",
                  scrolled ? "text-sm" : "text-base",
                ].join(" ")}
                style={{ fontFamily: "Inter, 'SF Pro Display', sans-serif" }}
              >
                Synkro
              </div>
              <div
                className={[
                  "text-xs text-[color:var(--muted)] transition-all duration-500 overflow-hidden",
                  scrolled ? "h-0 opacity-0" : "h-4 opacity-100",
                ].join(" ")}
              >
                Conflict-free scheduling
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="#features"
              className={[
                "hidden rounded-2xl px-3 py-2 text-[color:var(--muted)] hover:text-[color:var(--foreground)] sm:inline-flex transition-all duration-500",
                scrolled ? "text-xs" : "text-sm",
              ].join(" ")}
            >
              Features
            </Link>
            <Link
              href="/search"
              className={[
                "hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-[color:var(--muted)] hover:bg-white/[0.06] hover:text-[color:var(--foreground)] sm:inline-flex transition-all duration-500",
                scrolled ? "text-xs px-3 py-1.5" : "text-sm",
              ].join(" ")}
            >
              View Demo
            </Link>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Link
                href="/dashboard"
                className={[
                  "inline-flex items-center justify-center rounded-2xl font-medium text-black transition-all duration-500",
                  scrolled ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
                ].join(" ")}
                style={{
                  background: "linear-gradient(135deg, rgba(108,92,231,1) 0%, rgba(0,212,255,1) 100%)",
                  boxShadow: scrolled
                    ? "0 0 40px rgba(108,92,231,0.15)"
                    : "0 0 70px rgba(108,92,231,0.22), 0 0 70px rgba(0,212,255,0.12)",
                }}
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </header>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 animated-hero-bg">
          <ParticleField />
          <div className="noise-overlay" />
          <GlowOrb className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full" color="rgba(108,92,231,0.55)" />
          <GlowOrb className="absolute -right-28 top-0 h-[520px] w-[520px] rounded-full" color="rgba(0,212,255,0.40)" />
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[520px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 35%), radial-gradient(900px 500px at 50% 10%, rgba(108,92,231,0.22), transparent 60%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          />
        </div>

        <div className="mx-auto w-full max-w-[1200px] px-6 pb-16 pt-24 sm:pt-32">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.05}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[color:var(--muted)]"
              >
                <span className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                Precision scheduling. Zero overlap.
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.12}
                className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl leading-[1.02]"
              >
                <span className="gradient-text">Synkro</span>
                <br />
                <span className="text-white">Manager</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.18}
                className="mt-5 text-lg leading-8 text-[color:var(--muted)] max-w-xl"
              >
                Manage your time with precision and zero conflicts. Built with strict validation, smart search, and
                automatic ordering—powered by the exact rules of your original C program.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.24}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-black transition hover:shadow-[0_0_90px_rgba(108,92,231,0.28)]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(108,92,231,1) 0%, rgba(0,212,255,1) 100%)",
                      boxShadow: "0 0 90px rgba(108,92,231,0.22), 0 0 90px rgba(0,212,255,0.12)",
                    }}
                  >
                    Get Started
                  </Link>
                </motion.div>
                <motion.div whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/search"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-sm text-white hover:bg-white/[0.08] transition"
                  >
                    View Demo
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.3}
                className="mt-8 grid grid-cols-3 gap-3"
              >
                {[
                  { k: "No overlap", v: "Conflict-free engine" },
                  { k: "Fast search", v: "ID, date, time, place" },
                  { k: "Sorted", v: "Date → start time" },
                ].map((x) => (
                  <div key={x.k} className="shine-border rounded-2xl bg-white/[0.03] p-3">
                    <div className="text-sm font-medium text-white">{x.k}</div>
                    <div className="mt-1 text-xs text-[color:var(--muted)]">{x.v}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Preview card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, type: "spring", stiffness: 260, damping: 26 }}
              className="relative"
            >
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="shine-border rounded-3xl bg-white/[0.04] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
                style={{ backdropFilter: "blur(14px)" }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[color:var(--muted)]">Dashboard preview</div>
                    <div className="text-base font-semibold tracking-tight text-white">Glass UI + smart timeline</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-[color:var(--muted)]">
                    Live
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    { t: "Total", v: "24", glow: "rgba(108,92,231,0.18)" },
                    { t: "Today", v: "3", glow: "rgba(0,212,255,0.14)" },
                    { t: "Upcoming", v: "11", glow: "rgba(233,231,255,0.10)" },
                  ].map((x) => (
                    <div
                      key={x.t}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-3"
                      style={{ boxShadow: `0 0 55px ${x.glow}` }}
                    >
                      <div className="text-xs text-[color:var(--muted)]">{x.t}</div>
                      <div className="mt-2 text-2xl font-semibold tracking-tight text-white">{x.v}</div>
                      <div className="mt-2 h-1 w-14 rounded-full" style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }} />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-white">Timeline</div>
                    <div className="text-xs text-[color:var(--muted)]">Sorted output</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {[
                      { id: "A-108", t: "09:00 → 10:00", d: "bureau • professionnel" },
                      { id: "A-109", t: "10:30 → 11:15", d: "cabinet • medical" },
                      { id: "A-110", t: "13:00 → 14:00", d: "cafe • personnel" },
                      { id: "A-111", t: "16:00 → 16:30", d: "bureau • professionnel" },
                    ].map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.05 }}
                        className="rounded-2xl border border-white/10 bg-white/[0.02] px-3 py-3 hover:bg-white/[0.04] transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-[color:var(--muted)]">{c.id}</div>
                          <div className="text-xs text-white">{c.t}</div>
                        </div>
                        <div className="mt-1 text-xs text-[color:var(--muted)]">{c.d}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto w-full max-w-[1200px] px-6 py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs text-[color:var(--muted)]">Features</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">Premium scheduling, engineered for rules</div>
          </div>
          <div className="hidden text-sm text-[color:var(--muted)] sm:block">Glass cards • Glow hover • Smooth motion</div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Conflict-free scheduling",
              desc: "Strict overlap checks on the same day—no cheating, no edge-case drift.",
              glow: "rgba(108,92,231,0.18)",
              icon: "shield" as const,
            },
            {
              title: "Smart search",
              desc: "Search by ID, date, start time, location, or category—exact match behavior.",
              glow: "rgba(0,212,255,0.14)",
              icon: "search" as const,
            },
            {
              title: "Real-time dashboard",
              desc: "Stats for total, today, and upcoming. Timeline preview always stays ordered.",
              glow: "rgba(233,231,255,0.10)",
              icon: "spark" as const,
            },
            {
              title: "Clean timeline",
              desc: "Automatic ordering by date then start time, matching the C program’s display order.",
              glow: "rgba(0,212,255,0.10)",
              icon: "timeline" as const,
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
              className="shine-border rounded-3xl bg-white/[0.04] p-5"
              style={{ boxShadow: `0 0 60px ${f.glow}` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    <Icon name={f.icon} />
                  </span>
                  <div className="text-base font-semibold tracking-tight text-white">{f.title}</div>
                </div>
              </div>
              <div className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{f.desc}</div>
              <motion.div
                className="mt-4 h-1 w-20 rounded-full"
                style={{ background: "linear-gradient(90deg, var(--primary), var(--accent))" }}
                initial={{ width: 42, opacity: 0.65 }}
                whileInView={{ width: 84, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
          className="shine-border rounded-[28px] bg-white/[0.04] p-6 sm:p-8"
        >
          <div className="text-xs text-[color:var(--muted)]">How it works</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-white">Three steps. Zero ambiguity.</div>

          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { n: "01", t: "Add your appointments", d: "Enter date, start/end time, location, and category." },
              { n: "02", t: "Validate & organize", d: "Dates and times are validated, conflicts are rejected, ordering is automatic." },
              { n: "03", t: "Manage in one place", d: "Modify (one field at a time like the C menu), search instantly, browse by calendar." },
            ].map((s) => (
              <motion.div
                key={s.n}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="text-xs text-[color:var(--muted)]">{s.n}</div>
                <div className="mt-2 text-base font-semibold tracking-tight text-white">{s.t}</div>
                <div className="mt-2 text-sm leading-7 text-[color:var(--muted)]">{s.d}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-20">
        <motion.div
          variants={reveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="shine-border rounded-[32px] p-8 sm:p-10 bg-white/[0.04]"
          style={{ boxShadow: "0 0 110px rgba(108,92,231,0.22), 0 0 110px rgba(0,212,255,0.12)" }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs text-[color:var(--muted)]">Call to action</div>
              <div className="mt-2 text-3xl font-semibold tracking-tight text-white">Start managing your time now</div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">Start managing your time like a pro.</div>
            </div>
            <div className="flex items-center gap-3">
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl px-7 py-4 text-sm font-semibold text-black transition hover:shadow-[0_0_110px_rgba(108,92,231,0.28)]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(108,92,231,1) 0%, rgba(0,212,255,1) 100%)",
                    boxShadow: "0 0 90px rgba(108,92,231,0.22), 0 0 90px rgba(0,212,255,0.12)",
                  }}
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Link
                  href="/calendar"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm text-white hover:bg-white/[0.08] transition"
                >
                  View Demo
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <footer className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-[color:var(--muted)] sm:flex-row">
          <div>© {new Date().getFullYear()} Synkro</div>
          <div className="flex items-center gap-3">
            <Link className="hover:text-[color:var(--foreground)]" href="/dashboard">
              App
            </Link>
            <Link className="hover:text-[color:var(--foreground)]" href="/search">
              Demo
            </Link>
            <Link className="hover:text-[color:var(--foreground)]" href="/calendar">
              Calendar
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}

