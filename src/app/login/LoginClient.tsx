"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

function safeRedirect(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = safeRedirect(searchParams.get("redirect"));
  const urlError = searchParams.get("error");

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setInfo(null);
    const em = email.trim();
    if (!em || !password) {
      setLocalError("Email and password are required.");
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email: em, password });
    setBusy(false);
    if (error) {
      setLocalError(error.message);
      return;
    }
    router.push(redirect);
    router.refresh();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    setInfo(null);
    const name = username.trim();
    const em = email.trim();
    if (!name || !em || !password) {
      setLocalError("Username, email, and password are required.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setLocalError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const supabase = createSupabaseBrowser();
    const origin = window.location.origin;
    const { data, error } = await supabase.auth.signUp({
      email: em,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        data: { username: name },
      },
    });
    setBusy(false);
    if (error) {
      setLocalError(error.message);
      return;
    }
    if (data.session) {
      router.push(redirect);
      router.refresh();
      return;
    }
    setInfo(
      "If email confirmation is enabled in Supabase, check your inbox. Otherwise turn off “Confirm email” under Authentication > Providers > Email for instant sign-in while testing.",
    );
  }

  const bannerError =
    urlError && urlError !== "missing_code" ? decodeURIComponent(urlError) : urlError === "missing_code"
      ? "That link is incomplete. Sign in below or use the link from your email again."
      : null;

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
            Simple account,
            <br />
            <span className="text-shimmer">your schedule</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 }}
            className="mt-5 text-[color:var(--muted)] text-base leading-relaxed"
          >
            Sign in with email and password, or create an account with a username. Your appointments stay private to
            your login.
          </motion.p>
          <ul className="mt-10 space-y-4 text-sm text-white/55">
            {[
              "Email + password — no third-party login required",
              "Dashboard, timeline, calendar, and smart search",
              "Validation and conflict checks built into the app",
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
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-4">Account</div>
          <div className="flex rounded-xl border border-white/[0.08] p-1 bg-black/20">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setLocalError(null);
                setInfo(null);
              }}
              className={[
                "flex-1 rounded-lg py-2 text-sm font-medium transition",
                mode === "signin" ? "bg-white/[0.1] text-white" : "text-white/40 hover:text-white/60",
              ].join(" ")}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setLocalError(null);
                setInfo(null);
              }}
              className={[
                "flex-1 rounded-lg py-2 text-sm font-medium transition",
                mode === "signup" ? "bg-white/[0.1] text-white" : "text-white/40 hover:text-white/60",
              ].join(" ")}
            >
              Create account
            </button>
          </div>

          <p className="mt-4 text-sm text-white/45">
            {mode === "signin"
              ? "Enter the email and password you used when you registered."
              : "Pick a username, email, and password (min. 6 characters)."}
          </p>

          {(bannerError || localError) && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200/90"
            >
              {localError ?? bannerError}
            </div>
          )}

          {info && (
            <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100/90">
              {info}
            </div>
          )}

          <form
            className="mt-6 space-y-4"
            onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
            noValidate
          >
            {mode === "signup" && (
              <div>
                <label htmlFor="username" className="block text-[11px] font-medium uppercase tracking-wider text-white/35 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[color:var(--primary)]/50 transition"
                  placeholder="e.g. oussama"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-wider text-white/35 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[color:var(--primary)]/50 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-wider text-white/35 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/[0.1] bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[color:var(--primary)]/50 transition"
                placeholder="••••••••"
              />
            </div>
            {mode === "signup" && (
              <div>
                <label htmlFor="confirm" className="block text-[11px] font-medium uppercase tracking-wider text-white/35 mb-1.5">
                  Confirm password
                </label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full rounded-xl border border-white/[0.1] bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-[color:var(--primary)]/50 transition"
                  placeholder="••••••••"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-black disabled:opacity-50 btn-premium btn-glow relative"
            >
              <span className="relative z-10">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}</span>
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-white/30 leading-relaxed">
            <Link href="/" className="text-[color:var(--accent)]/80 hover:text-[color:var(--accent)]">
              Back to marketing site
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
