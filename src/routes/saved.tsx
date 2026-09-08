import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { PACKAGE_SELECT, type Package } from "@/lib/travel";
import { PackageCard } from "@/components/PackageCard";
import { useReveal } from "@/hooks/useReveal";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved tour packages — Saffron Atlas" },
      {
        name: "description",
        content: "Your shortlisted domestic and international tour packages, ready to book.",
      },
      { property: "og:title", content: "Saved packages — Saffron Atlas" },
      { property: "og:description", content: "Everything you shortlisted, in one place." },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["saved-packages", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data: saved, error } = await supabase
        .from("saved_packages")
        .select("package_id")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const ids = (saved ?? []).map((s) => s.package_id);
      if (ids.length === 0) return [] as Package[];
      const { data: pkgs, error: pkgError } = await supabase
        .from("packages")
        .select(PACKAGE_SELECT)
        .in("id", ids);
      if (pkgError) throw pkgError;
      return (pkgs ?? []) as Package[];
    },
  });

  useReveal(data?.length);

  if (!loading && !user) {
    return <SignInPrompt />;
  }

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-12 md:px-8">
      <div className="label-mono text-primary">Your shortlist</div>
      <h1 className="mt-2 text-[34px]">Saved packages</h1>

      {isLoading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[420px] rounded-3xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            Nothing saved yet. Tap the heart on any package to keep it here.{" "}
            <Link to="/domestic" className="text-primary underline">
              Browse tours
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} delay={i * 70} />
          ))}
        </div>
      )}
    </section>
  );
}

function SignInPrompt() {
  return (
    <section className="mx-auto max-w-[1240px] px-5 py-20 text-center md:px-8">
      <h1 className="text-[30px]">Sign in to see your saved trips</h1>
      <Link to="/auth" className="chip mt-6 inline-flex chip-on">
        Sign in
      </Link>
    </section>
  );
}
