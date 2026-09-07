import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Heart, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/domestic", label: "Domestic" },
  { to: "/international", label: "International" },
  { to: "/packages", label: "Packages" },
  { to: "/reviews", label: "Reviews" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, fullName } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="text-[17px] font-bold tracking-tight">
            Saffron<span className="font-medium text-muted-foreground"> Atlas</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] text-muted-foreground lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground font-medium" }}
              activeOptions={{ exact: l.to === "/" }}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/saved" className="hidden sm:inline-flex chip">
                <Heart className="size-3" /> Saved
              </Link>
              <Link to="/bookings" className="hidden md:inline-flex chip">
                My bookings
              </Link>
              <Link to="/profile" className="hidden md:inline-flex chip">
                {fullName.split(" ")[0] || "Profile"}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hidden md:inline-flex chip chip-on">
                  <ShieldCheck className="size-3" /> Admin
                </Link>
              )}
              <button
                onClick={signOut}
                className="hidden rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-cream transition-opacity hover:opacity-90 md:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-cream transition-opacity hover:opacity-90"
            >
              Sign in
            </Link>
          )}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full border border-border lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-5 py-4 lg:hidden">
          <nav className="grid gap-1 text-sm">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 transition-colors hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/saved"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 hover:bg-muted"
                >
                  Saved packages
                </Link>
                <Link
                  to="/bookings"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 hover:bg-muted"
                >
                  My bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2 hover:bg-muted"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-2 text-primary hover:bg-muted"
                  >
                    Admin portal
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="mt-1 rounded-xl bg-foreground px-3 py-2 text-left text-cream"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-foreground px-3 py-2 text-cream"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
