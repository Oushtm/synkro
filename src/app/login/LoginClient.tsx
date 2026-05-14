"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export function LoginClient() {
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const err = searchParams.get("error");

  async function signInWithGoogle() {
    const supabase = createSupabaseBrowser();
    const origin = window.location.origin;
    const next = encodeURIComponent(redirect);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${next}`,
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="relative flex flex-1 flex-col justify-center px-6 py-16 lg:px-16 lg:py-24 border-b lg:border-b-0 lg:border-r border-white/[0.06] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(600px 400px at 20% 20%, rgba(108,92,231,0.25), transparent 55%), radial-gradient(500px 360px at 80% 60%, rgba(0,212,255,0.12), transparent 50%)",
          }}
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.12]" />
        <div className="relative z-10 max-w-lg">
          <Link href="/" className="inline-flex items-center gap-3 mb-12 group">
            <div className="relative h-10 w-10">
              <Image src="/logo.svg" alt="Synkro" fill className="object-contain" />
            </div>
            <span className="text-lg font-semibold text-white/90 tracking-tight">Synkro</span>
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-white leading-tight"
          >
            Professional scheduling,
            <br />
            <span className="text-shimmer">secured for your team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-5 text-[color:var(--muted)] text-base leading-relaxed"
          >
            Create a free account with Google to access your dashboard, calendar, and conflict-free appointment tools.
            Your data stays isolated to your workspace.
          </motion.p>
          <ul className="mt-10 space-y-4 text-sm text-white/55">
            {[
              "Google Sign-In — no separate password to manage",
              "Dashboard, timeline, calendar, and smart search",
              "Strict validation inspired by production-grade scheduling rules",
            ].map((t) => (
              <li key={t} className="flex gap-3 items-start">
                <span
                  className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                  style={{ background: "linear-gradient(135deg, var(--primary), var(--accent))" }}
                >
                  ✓
                </span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-12 bg-[#070a12]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 28 }}
          className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-[0_0_80px_rgba(108,92,231,0.08)]"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-2">Account</div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Sign in to continue</h2>
          <p className="mt-2 text-sm text-white/45">
            Use your Google workspace or personal account. After signing in you will be redirected to your app.
          </p>

          {err && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200/90"
            >
              {err === "missing_code"
                ? "Sign-in was cancelled or incomplete. Please try again."
                : decodeURIComponent(err)}
            </div>
          )}

          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            className="mt-8 w-full flex items-center justify-center gap-3 rounded-xl border border-white/[0.1] bg-white/[0.06] py-3.5 px-4 text-sm font-medium text-white/90 hover:bg-white/[0.1] hover:border-white/[0.14] transition-all duration-300"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="mt-8 text-center text-[11px] text-white/30 leading-relaxed">
            By continuing you agree to use Synkro according to your organisation&apos;s policies.
            <br />
            <Link href="/" className="text-[color:var(--accent)]/80 hover:text-[color:var(--accent)]">
              Back to marketing site
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
