import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Star, Check, X, MessageCircle, CalendarDays } from "lucide-react";
import {
  bookingSchema,
  fetchApprovedReviews,
  fetchPackageById,
  itineraryOf,
  listOf,
} from "@/lib/travel";
import { inr, whatsappEnquiryUrl } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SaveButton } from "@/components/SaveButton";
import { useReveal } from "@/hooks/useReveal";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageSlider } from "@/components/ImageSlider";
import { galleryOf } from "@/lib/gallery";

export const Route = createFileRoute("/packages/$id")({
  head: () => ({
    meta: [
      { title: "Tour package details & itinerary — Saffron Atlas" },
      {
        name: "description",
        content:
          "Day-wise itinerary, inclusions, exclusions, cancellation policy and INR pricing for this curated tour package.",
      },
      { property: "og:title", content: "Tour package details — Saffron Atlas" },
      {
        property: "og:description",
        content: "See the full plan, what's included and book this trip in minutes.",
      },
    ],
  }),
  component: PackageDetail,
});

function PackageDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pkg, isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: () => fetchPackageById(id),
  });
  const { data: reviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchApprovedReviews(id),
  });

  useReveal(pkg?.id);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_mobile: "",
    travelers: "2",
    travel_date: "",
    special_requirements: "",
  });
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8">
        <Skeleton className="h-[380px] rounded-3xl" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="mx-auto max-w-[1240px] px-5 py-20 text-center md:px-8">
        <h1 className="text-[28px]">Package not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This package may have been removed by our team.
        </p>
        <Link to="/packages" className="chip mt-6 inline-flex">
          Browse all packages
        </Link>
      </div>
    );
  }

  const days = itineraryOf(pkg);
  const inclusions = listOf(pkg.inclusions);
  const exclusions = listOf(pkg.exclusions);
  const travelers = Math.max(1, Number(form.travelers) || 1);
  const total = travelers * pkg.price_inr;

  const book = async () => {
    if (!user) {
      toast.info("Sign in to book this package");
      navigate({ to: "/auth" });
      return;
    }
    const parsed = bookingSchema.safeParse({ ...form, notes: "" });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the booking details");
      return;
    }
    if (parsed.data.travelers > pkg.max_travelers) {
      toast.error(`This departure takes up to ${pkg.max_travelers} travellers`);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        package_id: pkg.id,
        package_name: pkg.name,
        destination: pkg.destination,
        reference: "",
        customer_name: parsed.data.customer_name,
        customer_email: parsed.data.customer_email,
        customer_mobile: parsed.data.customer_mobile,
        travelers: parsed.data.travelers,
        travel_date: parsed.data.travel_date,
        special_requirements: parsed.data.special_requirements ?? "",
        total_amount_inr: parsed.data.travelers * pkg.price_inr,
      })
      .select("reference")
      .maybeSingle();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await supabase.from("notifications").insert({
      user_id: user.id,
      channel: "email",
      recipient: parsed.data.customer_email,
      subject: `Booking ${data?.reference ?? ""} received`,
      body: `Thanks ${parsed.data.customer_name}, your booking for ${pkg.name} is pending confirmation.`,
    });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
    toast.success(`Booking created — ${data?.reference ?? "reference pending"}`);
    navigate({ to: "/bookings" });
  };

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-10 md:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ImageSlider
              images={galleryOf(pkg)}
              alt={`${pkg.name} in ${pkg.destination}`}
              interval={4000}
            />
          </div>
          <div className="lg:col-span-4">
            <div className="label-mono text-primary">{pkg.code}</div>
            <h1 className="mt-2 text-[34px] leading-[1.05]">{pkg.name}</h1>
            <p className="mt-3 text-[14px] text-muted-foreground">{pkg.summary}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="chip">
                {pkg.days} days / {pkg.nights} nights
              </span>
              <span className="chip">{pkg.locations_count} destinations</span>
              <span className="chip">
                <Star className="size-3 fill-current text-primary" /> {pkg.rating} (
                {pkg.reviews_count})
              </span>
              <span className="chip">{pkg.country}</span>
            </div>
            <div className="mt-5 flex items-end gap-3">
              <div>
                <span className="label-mono">Per person</span>
                <div className="text-[26px] font-bold">{inr(pkg.price_inr)}</div>
              </div>
              <SaveButton packageId={pkg.id} />
            </div>
            <a
              href={whatsappEnquiryUrl(pkg)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-foreground hover:text-cream"
            >
              <MessageCircle className="size-4" /> Enquire on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-8 px-5 py-12 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-[24px]">About this trip</h2>
          <p className="mt-3 whitespace-pre-line text-[14px] text-muted-foreground">
            {pkg.description}
          </p>

          <h2 className="mt-10 text-[24px]">Day-wise itinerary</h2>
          <ol className="mt-4 grid gap-3">
            {days.map((d, i) => (
              <li
                key={`${d.day}-${i}`}
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <div className="label-mono text-primary">Day {d.day}</div>
                <h3 className="mt-1.5 text-[18px]">{d.title}</h3>
                <ul className="mt-2 grid gap-1 text-[13px] text-muted-foreground">
                  {(d.items ?? []).map((item, j) => (
                    <li key={j}>· {item}</li>
                  ))}
                </ul>
              </li>
            ))}
            {days.length === 0 && (
              <li className="text-sm text-muted-foreground">Itinerary coming soon.</li>
            )}
          </ol>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="text-[18px]">Inclusions</h3>
              <ul className="mt-3 grid gap-1.5 text-[13px] text-muted-foreground">
                {inclusions.map((x, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-primary" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-5">
              <h3 className="text-[18px]">Exclusions</h3>
              <ul className="mt-3 grid gap-1.5 text-[13px] text-muted-foreground">
                {exclusions.map((x, i) => (
                  <li key={i} className="flex gap-2">
                    <X className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-[18px]">Terms</h3>
              <p className="mt-2 whitespace-pre-line text-[13px] text-muted-foreground">
                {pkg.terms}
              </p>
            </div>
            <div>
              <h3 className="text-[18px]">Cancellation policy</h3>
              <p className="mt-2 whitespace-pre-line text-[13px] text-muted-foreground">
                {pkg.cancellation_policy}
              </p>
            </div>
          </div>

          <h2 className="mt-10 text-[24px]">Traveller reviews</h2>
          <div className="mt-4 grid gap-3">
            {(reviews ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews yet for this package.{" "}
                <Link to="/reviews" className="text-primary underline">
                  Write the first one
                </Link>
                .
              </p>
            ) : (
              (reviews ?? []).map((r) => (
                <blockquote key={r.id} className="rounded-3xl border border-border bg-card p-5">
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-2 text-[14px] text-muted-foreground">{r.body}</p>
                  <footer className="mt-3 font-mono text-[11px] text-muted-foreground">
                    {r.author_name || "Traveller"}
                  </footer>
                </blockquote>
              ))
            )}
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 text-primary">
              <CalendarDays className="size-4" />
              <span className="label-mono">Book this trip</span>
            </div>
            <form
              className="mt-4 grid gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void book();
              }}
            >
              <input
                className="field"
                placeholder="Full name"
                value={form.customer_name}
                onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))}
              />
              <input
                className="field"
                type="email"
                placeholder="Email"
                value={form.customer_email}
                onChange={(e) => setForm((f) => ({ ...f, customer_email: e.target.value }))}
              />
              <input
                className="field"
                placeholder="Mobile number"
                value={form.customer_mobile}
                onChange={(e) => setForm((f) => ({ ...f, customer_mobile: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="label-mono">Travellers</span>
                  <input
                    className="field mt-1.5"
                    type="number"
                    min={1}
                    max={pkg.max_travelers}
                    value={form.travelers}
                    onChange={(e) => setForm((f) => ({ ...f, travelers: e.target.value }))}
                  />
                </label>
                <label className="block">
                  <span className="label-mono">Travel date</span>
                  <input
                    className="field mt-1.5"
                    type="date"
                    value={form.travel_date}
                    onChange={(e) => setForm((f) => ({ ...f, travel_date: e.target.value }))}
                  />
                </label>
              </div>
              <textarea
                className="field min-h-[86px]"
                placeholder="Special requirements (optional)"
                value={form.special_requirements}
                onChange={(e) => setForm((f) => ({ ...f, special_requirements: e.target.value }))}
              />
              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="label-mono">Total</span>
                <span className="text-[20px] font-bold">{inr(total)}</span>
              </div>
              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {busy ? "Creating booking…" : user ? "Confirm booking" : "Sign in to book"}
              </button>
            </form>
          </div>
        </aside>
      </section>
    </>
  );
}
