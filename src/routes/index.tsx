import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Star, ShieldCheck, MapPinned, Headphones } from "lucide-react";
import { fetchApprovedReviews, fetchPackages } from "@/lib/travel";
import { PackageCard } from "@/components/PackageCard";
import { useReveal } from "@/hooks/useReveal";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saffron Atlas — Curated Tours & Travel Packages in INR" },
      {
        name: "description",
        content:
          "Discover hand-built domestic and international tour packages with day-wise itineraries, transparent INR pricing, saved trips and instant booking.",
      },
      { property: "og:title", content: "Saffron Atlas — Curated Tours & Travel Packages" },
      {
        property: "og:description",
        content:
          "Slow, story-first itineraries across India and the world. Browse packages, save favourites and book in minutes.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"domestic" | "international">("domestic");
  const navigate = useNavigate();

  const { data: featured, isLoading } = useQuery({
    queryKey: ["packages", "featured-home"],
    queryFn: () => fetchPackages({ featured: true }),
  });
  const { data: reviews } = useQuery({
    queryKey: ["reviews", "home"],
    queryFn: () => fetchApprovedReviews(),
  });

  useReveal(featured?.length);

  const explore = () => {
    navigate({
      to: category === "domestic" ? "/domestic" : "/international",
      search: query.trim() ? { q: query.trim() } : {},
    });
  };

  const top3 = (featured ?? []).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-[1240px] px-5 pb-10 pt-12 md:px-8 md:pt-16">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="label-mono mb-5 text-primary">Curated journeys · est. 2016</div>
            <h1 className="text-[40px] leading-[1.02] sm:text-[54px]">
              Explore the world. Create memories.
            </h1>
            <p className="mt-5 max-w-[42ch] text-[15px] text-muted-foreground">
              Slow, story-first itineraries across India and the world — hand-built by people who
              have walked every mile. Every fare shown in rupees, per person.
            </p>
            <div className="mt-7 flex items-center gap-3">
              <button
                onClick={() => setCategory("domestic")}
                className={`chip ${category === "domestic" ? "chip-on" : ""}`}
              >
                Domestic
              </button>
              <button
                onClick={() => setCategory("international")}
                className={`chip ${category === "international" ? "chip-on" : ""}`}
              >
                International
              </button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-16/10 overflow-hidden rounded-3xl">
              <img
                src="/images/hero.jpg"
                alt="Golden sunrise over Himalayan ridges"
                width={1920}
                height={1080}
                className="size-full object-cover"
              />
            </div>

            <div className="mt-4 rounded-3xl border border-border bg-card p-4 md:p-5">
              <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto]">
                <label className="block">
                  <span className="label-mono">Search</span>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5">
                    <Search className="size-4 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && explore()}
                      placeholder="Kashmir, Kerala, Dubai, Bali…"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </label>
                <button
                  onClick={explore}
                  className="h-[46px] rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-[filter] hover:brightness-105"
                >
                  Explore packages
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-[1240px] px-5 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono text-primary">Featured departures</div>
            <h2 className="mt-2 text-[26px]">Signature itineraries</h2>
          </div>
          <Link to="/packages" className="chip">
            View all packages
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-3xl" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {top3.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} delay={i * 80} />
            ))}
          </div>
        )}
      </section>

      {/* WHY */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 md:grid-cols-3 md:px-8">
          {[
            {
              icon: MapPinned,
              title: "Itineraries, not lists",
              copy: "Every package is planned day by day, with real stays, transfers and rest built in.",
            },
            {
              icon: ShieldCheck,
              title: "Clear INR pricing",
              copy: "Per-person rupee pricing, written inclusions and a cancellation policy on every page.",
            },
            {
              icon: Headphones,
              title: "Talk to a human",
              copy: "Enquire on WhatsApp about any package and get a reply from the team that planned it.",
            },
          ].map((item, i) => (
            <div key={item.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <item.icon className="size-5 text-primary" />
              <h3 className="mt-4 text-[20px]">{item.title}</h3>
              <p className="mt-2 text-[14px] text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-[1240px] px-5 py-14 md:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono text-primary">Traveller stories</div>
            <h2 className="mt-2 text-[26px]">What our travellers say</h2>
          </div>
          <Link to="/reviews" className="chip">
            All reviews
          </Link>
        </div>

        {(reviews ?? []).length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-8">
            <p className="text-sm text-muted-foreground">
              Approved traveller reviews will appear here. Completed a trip with us?{" "}
              <Link to="/reviews" className="text-primary underline">
                Share your experience
              </Link>
              .
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {(reviews ?? []).slice(0, 3).map((r, i) => (
              <blockquote
                key={r.id}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="rounded-3xl border border-border bg-card p-5"
              >
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: r.rating }).map((_, s) => (
                    <Star key={s} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-[14px] text-muted-foreground">{r.body}</p>
                <footer className="mt-4 font-mono text-[11px] text-muted-foreground">
                  {r.author_name || "Traveller"} · {r.package_name}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
