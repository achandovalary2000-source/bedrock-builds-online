import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/components/auth/AuthProvider";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Sign In — Meridian Builders" }] }),
});

function AuthPage() {
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin" });
  }, [user, loading, navigate]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");
    if (password.length < 8) return toast.error("Password must be at least 8 characters");
    setBusy(true);
    const fn = mode === "in" ? signIn : signUp;
    const { error } = await fn(email, password);
    setBusy(false);
    if (error) return toast.error(error);
    if (mode === "up") toast.success("Check your email to confirm your account.");
    else navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="w-full max-w-md px-6">
          <div className="eyebrow mb-4 text-center">Staff Access</div>
          <h1 className="font-display text-4xl text-center mb-10">{mode === "in" ? "Sign in" : "Create account"}</h1>
          <form onSubmit={onSubmit} className="space-y-5 border border-border p-8 bg-surface/40 rounded-sm">
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Email</label>
              <input name="email" type="email" required className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Password</label>
              <input name="password" type="password" required minLength={8} className="w-full bg-background border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold" />
            </div>
            <button type="submit" disabled={busy} className="w-full py-3 bg-gold text-gold-foreground rounded-sm text-sm font-medium hover:opacity-90 disabled:opacity-50">
              {busy ? "Working…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
            <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-xs text-muted-foreground hover:text-foreground">
              {mode === "in" ? "Need an account? Sign up" : "Have an account? Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-gold">← Back to site</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
