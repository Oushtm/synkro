"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { ToastProvider } from "@/components/ui/Toast";
import Image from "next/image";

const navItems = [
  {
    href: "/dashboard",
    label: "Command Center",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: "/timeline",
    label: "Timeline",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: "/search",
    label: "Search",
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
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
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
        active
          ? "bg-white/[0.06] text-[color:var(--foreground)]"
          : "text-[color:var(--muted)] hover:text-[color:var(--foreground)] hover:bg-white/[0.03]",
      ].join(" ")}
    >
      <span className={active ? "text-[color:var(--accent)]" : "text-[color:var(--muted)] group-hover:text-[color:var(--foreground)]"}>{icon}</span>
      <span className="font-medium tracking-tight">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-active-pill"
          className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full"
          style={{ background: "linear-gradient(180deg, var(--primary), var(--accent))" }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen w-full">
        {/* Mobile top bar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#06080f]/90 backdrop-blur-xl px-4 py-3">
          <Link href="/" className="flex items-center gap-2.5 group transition-all duration-200">
            <div className="relative h-8 w-8 transition-all duration-200 group-hover:scale-105" style={{ filter: "drop-shadow(0 0 8px rgba(108,92,231,0.4))" }}>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00d4ff] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
              <Image src="/logo.svg" alt="Synkro Logo" fill className="object-contain relative z-10" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-white/90 font-sans">Synkro</span>
          </Link>
          <button
            onClick={() => setMobileNav(!mobileNav)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]"
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

        {/* Mobile nav overlay */}
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
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-white/[0.04] px-3 py-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 px-3 mb-8 group transition-all duration-200 p-2">
              <div className="relative h-9 w-9 transition-all duration-200 group-hover:scale-105" style={{ filter: "drop-shadow(0 0 12px rgba(108,92,231,0.3))" }}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6c5ce7] to-[#00d4ff] opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-50" />
                <Image src="/logo.svg" alt="Synkro Logo" fill className="object-contain relative z-10" />
              </div>
              <div className="leading-tight">
                <div className="text-base font-semibold tracking-tight text-white/90" style={{ fontFamily: "Inter, 'SF Pro Display', sans-serif" }}>Synkro</div>
              </div>
            </Link>

            {/* Navigation */}
            <div className="px-3 mb-3">
              <div className="text-[10px] font-medium uppercase tracking-widest text-[color:var(--muted)]/60">Navigation</div>
            </div>
            <nav className="flex flex-col gap-0.5">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>

            {/* Categories info */}
            <div className="mt-auto px-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[10px] font-medium uppercase tracking-widest text-[color:var(--muted)]/60 mb-2.5">Categories</div>
                <div className="flex flex-col gap-2">
                  {[
                    { c: "professionnel", color: "var(--cat-professionnel)" },
                    { c: "personnel", color: "var(--cat-personnel)" },
                    { c: "medical", color: "var(--cat-medical)" },
                  ].map((x) => (
                    <div key={x.c} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: x.color }} />
                      <span className="text-xs text-[color:var(--muted)]">{x.c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Back to landing */}
              <Link
                href="/"
                className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-[color:var(--muted)] transition hover:text-[color:var(--foreground)] hover:bg-white/[0.03]"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </aside>

          {/* Main content area */}
          <div className="flex min-w-0 flex-1 flex-col pt-14 lg:pt-0">
            <motion.main
              className="min-w-0 flex-1 px-4 py-6 lg:px-8 lg:py-8"
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
