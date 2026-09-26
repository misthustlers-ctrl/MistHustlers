import type { ReactNode } from "react";
import SEO from "@/components/SEO";
import SchemaMarkup from "@/components/SchemaMarkup";
import { useAuth } from "@/auth/AuthProvider";
import { AlertCircle, Loader2, LockKeyhole, ShieldCheck } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5 shrink-0">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.2 4 9.5 8.5 6.3 14.7Z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.3 39.6 16.1 44 24 44Z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C37 39.1 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
    </svg>
  );
}

function AuthShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SEO page="seoAudit" />
      <SchemaMarkup page="seoAudit" />
      <main id="main-content" className="min-h-screen overflow-x-hidden bg-basalt-canvas pt-24 pb-16 font-body">
        <section className="mx-auto grid max-w-[1120px] gap-6 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-digital-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-digital-orange">
              <ShieldCheck className="h-3.5 w-3.5" /> Free Website Audit Studio
            </span>
            <h1 className="mt-4 font-display text-[clamp(36px,6vw,68px)] font-bold leading-[1.02] text-abyssal-ink">
              Free SEO Audit
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-abyssal-ink/60 sm:text-lg">
              Discover what's stopping your website from ranking and converting better.
            </p>
          </div>
          {children}
        </section>
      </main>
    </>
  );
}

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { loading, user, error, configured, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <AuthShell>
        <div className="rounded-3xl border border-abyssal-ink/10 bg-white p-6 shadow-xl shadow-abyssal-ink/5 sm:p-8">
          <div className="flex items-center gap-3 text-abyssal-ink">
            <Loader2 className="h-5 w-5 animate-spin text-digital-orange" />
            <p className="font-bold">Checking authentication...</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-abyssal-ink/55">
            Hold on while we confirm your Google session.
          </p>
        </div>
      </AuthShell>
    );
  }

  if (!user) {
    return (
      <AuthShell>
        <div className="rounded-3xl border border-digital-orange/20 bg-white p-6 shadow-xl shadow-digital-orange/5 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-digital-orange/10 text-digital-orange">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-abyssal-ink">
            Sign in to access your SEO Audit.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-abyssal-ink/60">
            The rest of MistHustlers stays public. Only the audit tool requires Google authentication.
          </p>
          <button
            type="button"
            onClick={() => void signInWithGoogle()}
            disabled={!configured}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-abyssal-ink/15 bg-white px-6 py-3 text-sm font-bold text-abyssal-ink shadow-sm transition hover:border-digital-orange/45 hover:bg-ash-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          {!configured && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Google sign-in needs Supabase environment variables before it can run.</span>
            </div>
          )}
          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </AuthShell>
    );
  }

  return <>{children}</>;
}
