import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginClient } from "./LoginClient";

export const metadata: Metadata = {
  title: "Sign in · Synkro",
  description: "Sign in or create an account with email and password.",
};

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center saas-bg">
      <div className="h-10 w-10 rounded-full border-2 border-white/10 border-t-[color:var(--accent)] animate-spin" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  );
}
