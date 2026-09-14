import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { signupSchema } from "@/lib/travel";
import { useAuth } from "@/hooks/useAuth";
import { TextField, SubmitButton } from "@/components/form";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Tour & Travels" },
      {
        name: "description",
        content:
          "Sign in to save packages, book curated tours and track your booking status with Tour & Travels.",
      },
      { property: "og:title", content: "Sign in — Tour & Travels" },
      {
        property: "og:description",
        content: "Access saved trips, bookings and reviews on your Tour & Travels account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const PERKS = [
  "Save packages and compare them later",
  "Book with a unique booking reference",
  "Track booking and payment status",
  "Review trips once you are back home",
];

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

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const later = () => {
    if (typeof window !== "undefined") window.localStorage.setItem("sa_auth_skipped", "1");
    navigate({ to: "/", replace: true });
  };

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
    if (typeof window !== "undefined") window.localStorage.setItem("sa_auth_skipped", "1");
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
    window.localStorage.setItem("sa_auth_skipped", "1");
    toast.success(`Welcome, ${parsed.data.fullName.split(" ")[0]}`);
    navigate({ to: "/", replace: true });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[520px] rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -right-32 size-[460px] rounded-full bg-lagoon/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-[1fr_480px] lg:gap-16">
        <div>
          <div className="label-mono text-primary">Traveller account</div>
          <h1 className="mt-3 text-[40px] leading-[1.02] sm:text-[52px]">
            {mode === "signin" ? "Welcome back." : "Start planning."}
          </h1>
          <p className="mt-4 max-w-[46ch] text-[15px] text-muted-foreground">
            One account for saved packages, bookings with a unique reference, and reviews once you
            are back home. You can always browse first and sign in later.
          </p>

          <ul className="mt-7 grid gap-2.5">
            {PERKS.map((p, i) => (
              <li
                key={p}
                style={{ animationDelay: `${i * 70}ms` }}
                className="flex animate-in items-center gap-2.5 text-[14px] text-muted-foreground fade-in slide-in-from-bottom-2 duration-700"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                  <Check className="size-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-8 hidden overflow-hidden rounded-3xl lg:block">
            <img
              src="/images/kashmir.jpg"
              alt="Snow-lined valley in Kashmir"
              width={1600}
              height={1200}
              className="aspect-16/9 size-full object-cover"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-[0_24px_60px_-30px_oklch(0.262_0.029_55_/_35%)] backdrop-blur md:p-8">
          <div className="relative grid grid-cols-2 gap-1 rounded-full border border-border bg-background p-1">
            <span
              aria-hidden
              className="absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-400 ease-soft"
              style={{ transform: `translateX(${mode === "signin" ? "0.25rem" : "calc(100% + 0.25rem)"})` }}
            />
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`relative z-10 rounded-full py-2.5 text-[13px] font-medium transition-colors duration-300 ${
                  mode === m ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form
            key={mode}
            className="mt-6 grid animate-in gap-4 fade-in slide-in-from-bottom-2 duration-500"
            onSubmit={(e) => {
              e.preventDefault();
              void (mode === "signin" ? signIn() : signUp());
            }}
          >
            {mode === "signup" && (
              <>
                <TextField
                  label="Full name"
                  value={form.fullName}
                  onChange={set("fullName")}
                  error={errors["fullName"]}
                  placeholder="Ananya Sharma"
                />
                <TextField
                  label="Mobile number"
                  value={form.mobile}
                  onChange={set("mobile")}
                  error={errors["mobile"]}
                  placeholder="+91 98765 43210"
                />
              </>
            )}
            <TextField
              label="Email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={set("email")}
              error={errors["email"]}
              placeholder="you@example.com"
            />
            <TextField
              label="Password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={form.password}
              onChange={set("password")}
              error={errors["password"]}
              {...(mode === "signup" ? { hint: "At least 8 characters." } : {})}
            />
            {mode === "signup" && (
              <TextField
                label="Confirm password"
                type="password"
                value={form.confirmPassword}
                onChange={set("confirmPassword")}
                error={errors["confirmPassword"]}
              />
            )}

            <SubmitButton busy={busy} className="mt-1 w-full">
              {mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="size-4" />
            </SubmitButton>
          </form>

          <button
            type="button"
            onClick={later}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-300 ease-soft hover:border-foreground hover:text-foreground active:scale-[0.98]"
          >
            <Sparkles className="size-4" /> I will do it later
          </button>

          <p className="mt-5 flex items-start gap-2 text-[12px] text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>
              Your details stay private and are only used for bookings. Need help?{" "}
              <Link to="/contact" className="text-primary underline">
                Contact us
              </Link>
              .
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
