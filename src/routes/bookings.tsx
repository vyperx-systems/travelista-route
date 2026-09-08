import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Booking } from "@/lib/travel";
import { formatDate, inr, titleCase } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — Tour & Travels" },
      {
        name: "description",
        content:
          "Track your Tour & Travels tour bookings: reference number, travel date, travellers and status.",
      },
      { property: "og:title", content: "My bookings — Tour & Travels" },
      { property: "og:description", content: "Every booking and its live status in one view." },
    ],
  }),
  component: BookingsPage,
});

const statusTone: Record<string, string> = {
  pending: "bg-muted text-foreground",
  confirmed: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
  completed: "bg-foreground text-cream",
};

function BookingsPage() {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  if (!loading && !user) {
    return (
      <section className="mx-auto max-w-[1240px] px-5 py-20 text-center md:px-8">
        <h1 className="text-[30px]">Sign in to view your bookings</h1>
        <Link to="/auth" className="chip chip-on mt-6 inline-flex">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1240px] px-5 py-12 md:px-8">
      <div className="label-mono text-primary">Trip desk</div>
      <h1 className="mt-2 text-[34px]">My bookings</h1>

      {isLoading ? (
        <div className="mt-8 grid gap-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            No bookings yet.{" "}
            <Link to="/domestic" className="text-primary underline">
              Find a trip
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {(data ?? []).map((b) => (
            <article key={b.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] text-muted-foreground">{b.reference}</div>
                  <h2 className="mt-1 text-[20px]">{b.package_name}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{b.destination}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    statusTone[b.status] ?? "bg-muted"
                  }`}
                >
                  {titleCase(b.status)}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-[13px] sm:grid-cols-4">
                <div>
                  <dt className="label-mono">Travel date</dt>
                  <dd className="mt-1">{formatDate(b.travel_date)}</dd>
                </div>
                <div>
                  <dt className="label-mono">Travellers</dt>
                  <dd className="mt-1">{b.travelers}</dd>
                </div>
                <div>
                  <dt className="label-mono">Total</dt>
                  <dd className="mt-1 font-bold">{inr(b.total_amount_inr)}</dd>
                </div>
                <div>
                  <dt className="label-mono">Payment</dt>
                  <dd className="mt-1">{titleCase(b.payment_status)}</dd>
                </div>
              </dl>
              {b.special_requirements && (
                <p className="mt-3 text-[13px] text-muted-foreground">
                  Notes: {b.special_requirements}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
