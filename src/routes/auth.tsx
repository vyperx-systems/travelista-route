import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { signupSchema } from "@/lib/travel";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Saffron Atlas" },
      {
        name: "description",
        content:
          "Sign in to save packages, book curated tours and track your booking status with Saffron Atlas.",
      },
      { property: "og:title", content: "Sign in — Saffron Atlas" },
      {
        property: "og:description",
        content: "Access saved trips, bookings and reviews on your Saffron Atlas account.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) navigate({ to: "/", replace: true });
  }, [loading, user, navigate]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const signIn = async () => {
    setBusy(true);
    setErrors({});
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/", replace: true });
  };

  const signUp = async () => {
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        if (i.path[0]) map[String(i.path[0])] = i.message;
      });
      setErrors(map);
      return;
    }
    setBusy(true);
    setErrors({});
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: parsed.data.fullName, mobile: parsed.data.mobile },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created. If email confirmation is on, check your inbox.");
    navigate({ to: "/", replace: true });
  };

  return (
    <section className="mx-auto grid max-w-[1240px] gap-10 px-5 py-14 md:px-8 lg:grid-cols-2">
      <div>
        <div className="label-mono text-primary">Traveller account</div>
        <h1 className="mt-3 text-[38px] leading-[1.05]">
          {mode === "signin" ? "Welcome back." : "Start planning."}
        </h1>
        <p className="mt-4 max-w-[46ch] text-[15px] text-muted-foreground">
          One account for saved packages, bookings with a unique reference, and reviews once you are
          back home.
        </p>
        <div className="mt-8 hidden overflow-hidden rounded-3xl lg:block">
          <img
            src="/images/kashmir.jpg"
            alt="Snow-lined valley in Kashmir"
            className="aspect-4/3 size-full object-cover"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("signin")}
            className={`chip ${mode === "signin" ? "chip-on" : ""}`}
          >
            Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`chip ${mode === "signup" ? "chip-on" : ""}`}
          >
            Create account
          </button>
        </div>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void (mode === "signin" ? signIn() : signUp());
          }}
        >
          {mode === "signup" && (
            <>
              <Field label="Full name" error={errors["fullName"]}>
                <input className="field" value={form.fullName} onChange={set("fullName")} />
              </Field>
              <Field label="Mobile number" error={errors["mobile"]}>
                <input className="field" value={form.mobile} onChange={set("mobile")} />
              </Field>
            </>
          )}
          <Field label="Email" error={errors["email"]}>
            <input
              className="field"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
            />
          </Field>
          <Field label="Password" error={errors["password"]}>
            <input
              className="field"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={form.password}
              onChange={set("password")}
            />
          </Field>
          {mode === "signup" && (
            <Field label="Confirm password" error={errors["confirmPassword"]}>
              <input
                className="field"
                type="password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
              />
            </Field>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-[12px] text-muted-foreground">
          By continuing you agree to our terms. Need help?{" "}
          <Link to="/contact" className="text-primary underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="mt-1 block text-[12px] text-destructive">{error}</span>}
    </label>
  );
}
