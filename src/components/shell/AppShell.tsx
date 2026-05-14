"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { ToastProvider } from "@/components/ui/Toast";
import Image from "next/image";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

/* ── Consistent spacing tokens ──
 * Sidebar outer:       px-4 (16px each side)  → 256 - 32 = 224px content width
 * All inner elements:  px-0 (flush to content edge)
 * Nav items:           px-3 py-2.5 (internal padding within the item)
 * Section label:       px-3 (aligns text with nav item text, offset by icon width)
 * Section gaps:        gap of 24px between logo → nav → widgets
 * Widget internal:     p-4 (consistent internal padding)
 */

const navItems = [
  {
    href: "/dashboard",
    label: "Command Center",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/timeline",
    label: "Timeline",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
];

function NavItem({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={[
        "group relative flex items-center gap-3 rounded-xl pl-4 pr-3 py-2.5 text-[13px] transition-all duration-300",
        active
          ? "bg-white/[0.07] text-white"
          : "text-white/40 hover:text-white/70 hover:bg-white/[0.03]",
      ].join(" ")}
    >
      {/* Active background glow */}
      {active && (
        <motion.div
          layoutId="nav-bg-glow"
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(108,92,231,0.08), rgba(0,212,255,0.04))",
            boxShadow: "0 0 20px rgba(108,92,231,0.06), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
      {/* Active pill indicator — flush to sidebar left edge (compensate for parent px-4) */}
      {active && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full"
          style={{
            background: "linear-gradient(180deg, var(--primary), var(--accent))",
            boxShadow: "0 0 8px rgba(108,92,231,0.5), 0 0 16px rgba(0,212,255,0.3)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        />
      )}
      <motion.span
        className={`relative z-10 flex-shrink-0 transition-colors duration-200 ${
          active ? "text-[color:var(--accent)]" : "text-white/30 group-hover:text-white/60"
        }`}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 500, damping: 22 }}
        style={active ? { filter: "drop-shadow(0 0 4px rgba(0,212,255,0.4))" } : undefined}
      >
        {icon}
      </motion.span>
      <span className="relative z-10 font-medium tracking-tight">{label}</span>
      {/* Hover glow */}
      {!active && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "inset 0 0 20px rgba(108,92,231,0.04)" }} />
      )}
    </Link>
  );
}

function SidebarMouseGlow({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      setPos({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
    };
    const leave = () => setPos(p => ({ ...p, active: false }));
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); };
  }, [containerRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
      style={{
        opacity: pos.active ? 1 : 0,
        background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(108,92,231,0.06), transparent 60%)`,
      }}
    />
  );
}

export function AppShell({ children, user }: { children: ReactNode; user: User | null }) {
  const [mobileNav, setMobileNav] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  async function signOut() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const email = user?.email ?? "";
  const initial = email ? email[0]!.toUpperCase() : "?";

  return (
    <ToastProvider>
      <div className="min-h-screen w-full">
        {/* ── Mobile top bar ── */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#06080f]/90 backdrop-blur-xl px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 group transition-all duration-200">
            <div className="relative h-8 w-8 transition-all duration-200 group-hover:scale-105" style={{ filter: "drop-shadow(0 0 8px rgba(108,92,231,0.4))" }}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00d4ff] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
              <Image src="/logo.svg" alt="Synkro Logo" fill className="object-contain relative z-10" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white/90">Synkro</span>
          </Link>
          <button
            onClick={() => setMobileNav(!mobileNav)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] transition hover:bg-white/[0.06]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileNav ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* ── Mobile nav overlay ── */}
        <AnimatePresence>
          {mobileNav && (
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-[#06080f]/95 backdrop-blur-xl pt-16 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <nav className="flex flex-col gap-1 mt-4">
                {navItems.map((item) => (
                  <div key={item.href} onClick={() => setMobileNav(false)}>
                    <NavItem {...item} />
                  </div>
                ))}
                <div className="mt-6 pt-4 border-t border-white/[0.06] px-4">
                  <p className="text-[11px] text-white/35 truncate mb-2">{email || "Signed in"}</p>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-xs text-white/60 hover:bg-white/[0.07] hover:text-white/80 transition"
                  >
                    Sign out
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
          {/* ══════════════════════════════════════
               Desktop Sidebar — 260px, inset from edges
             ══════════════════════════════════════ */}
          <aside
            ref={sidebarRef}
            className="hidden lg:flex w-[264px] shrink-0 flex-col border-r border-white/[0.04] px-5 pt-10 pb-5 relative overflow-hidden"
            style={{ background: "linear-gradient(180deg, rgba(108,92,231,0.02) 0%, transparent 40%)" }}
          >
            <SidebarMouseGlow containerRef={sidebarRef} />

            {/* Top ambient glow */}
            <div className="pointer-events-none absolute top-0 left-0 w-full h-48 opacity-40 z-0"
              style={{ background: "radial-gradient(200px 160px at 50% 0%, rgba(108,92,231,0.10), transparent)" }} />

            {/* ── Logo ── 
                 Uses px-3 so the logo icon aligns with nav item icons (nav items have px-3 + gap-3 + 18px icon) */}
            <Link href="/" className="flex items-center gap-3 px-4 py-2 mb-8 group transition-all duration-300 relative z-10">
              <div className="relative h-8 w-8 flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ filter: "drop-shadow(0 0 10px rgba(108,92,231,0.25))" }}>
                <motion.div
                  animate={{ opacity: [0.25, 0.45, 0.25] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00d4ff] blur-lg"
                />
                <Image src="/logo.svg" alt="Synkro Logo" fill className="object-contain relative z-10" />
              </div>
              <div className="leading-none">
                <div className="text-[15px] font-semibold tracking-tight text-white/90">Synkro</div>
                <div className="text-[10px] text-white/25 font-medium mt-1">v1.0 • Pro</div>
              </div>
            </Link>

            {/* ── Section label ──
                 px-3 aligns label text with nav item icon left edge */}
            <div className="px-4 mb-2 relative z-10">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/20">Navigation</div>
            </div>

            {/* ── Nav items ──
                 Each item has px-3 internally, sitting flush within the px-4 aside */}
            <nav className="flex flex-col gap-0.5 relative z-10">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>

            {/* ── Gradient separator ── */}
            <div className="my-5 h-px relative z-10"
              style={{ background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 50%, transparent 95%)" }} />

            {/* ── Bottom widgets ──
                 Full width within the sidebar inset — no extra px wrapper */}
            <div className="mt-auto flex flex-col gap-3 relative z-10">

              {/* Account */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 mb-3">Account</div>
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold text-white/90 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, rgba(108,92,231,0.5), rgba(0,212,255,0.35))",
                      boxShadow: "0 0 12px rgba(108,92,231,0.25)",
                    }}
                  >
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={String(user.user_metadata.avatar_url)}
                        alt=""
                        className="h-9 w-9 object-cover"
                      />
                    ) : (
                      initial
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[12px] font-medium text-white/70 truncate">{email || "Workspace"}</div>
                    <div className="text-[10px] text-white/30">Google</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void signOut()}
                  className="mt-3 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 text-[11px] text-white/45 hover:bg-white/[0.06] hover:text-white/70 transition"
                >
                  Sign out
                </button>
              </div>

              {/* Schedule Health */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 relative overflow-hidden">
                <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-15"
                  style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }} />
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 mb-3">Schedule Health</div>
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="h-11 w-11 -rotate-90">
                      <circle cx="18" cy="18" r="14.5" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="14.5" fill="none" stroke="url(#sidebarGrad)" strokeWidth="3" strokeDasharray="91" strokeDashoffset="7" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="sidebarGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#6c5ce7" />
                          <stop offset="100%" stopColor="#00d4ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white/70">92</div>
                  </div>
                  <div className="leading-tight">
                    <div className="text-[12px] font-medium text-white/65">Excellent</div>
                    <div className="text-[10px] text-white/30 mt-0.5">0 conflicts</div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 mb-3">Categories</div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { c: "professionnel", color: "var(--cat-professionnel)" },
                    { c: "personnel", color: "var(--cat-personnel)" },
                    { c: "medical", color: "var(--cat-medical)" },
                  ].map((x) => (
                    <div key={x.c} className="flex items-center gap-2.5 group/cat">
                      <span className="h-2 w-2 rounded-full flex-shrink-0 transition-shadow duration-300"
                        style={{ background: x.color, boxShadow: `0 0 4px ${x.color}33` }} />
                      <span className="text-[11px] text-white/40 capitalize group-hover/cat:text-white/55 transition-colors">{x.c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back to landing — px-3 aligns with nav item text */}
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[11px] text-white/25 transition-all duration-300 hover:text-white/50 hover:bg-white/[0.03]"
              >
                <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </aside>

          {/* ── Main content area ── */}
          <div className="flex min-w-0 flex-1 flex-col pt-14 lg:pt-0 relative">
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-60 z-0"
              style={{ background: "radial-gradient(800px 300px at 30% 0%, rgba(108,92,231,0.05), transparent)" }} />
            <motion.main
              className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {children}
            </motion.main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
