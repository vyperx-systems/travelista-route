import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, ShieldCheck, MapPinned, Headphones } from "lucide-react";
import { fetchPackages } from "@/lib/travel";
import { PackageCard } from "@/components/PackageCard";
import { HeroSlider } from "@/components/HeroSlider";
import { useReveal } from "@/hooks/useReveal";
import { Skeleton } from "@/components/ui/skeleton";
import { Analytics } from "@vercel/analytics/react"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tour & Travels — Curated Tours & Travel Packages in INR" },
      {
        name: "description",
        content:
          "Discover hand-built domestic and international tour packages with day-wise itineraries, transparent INR pricing, saved trips and instant booking.",
      },
      { property: "og:title", content: "Tour & Travels — Curated Tours & Travel Packages" },
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
  const { data: heroPackages } = useQuery({
    queryKey: ["packages", "hero", category],
    queryFn: () => fetchPackages({ category }),
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
    <Analytics/>
      <HeroSlider
        packages={heroPackages}
        eyebrow="Curated journeys · est. 2016"
        headline="Explore the world. Create memories."
      >
        <div className="grid gap-3 sm:max-w-140">
          <div className="flex items-center gap-2">
            {(["domestic", "international"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`chip transition-all duration-300 ${
                  category === c ? "chip-on" : "bg-background/70 backdrop-blur"
                }`}
              >
                {c === "domestic" ? "Domestic" : "International"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-cream/25 bg-background/90 p-1.5 backdrop-blur">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && explore()}
                placeholder="Kashmir, Kerala, Dubai, Bali…"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              onClick={explore}
              className="rounded-xl bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground transition-all duration-300 ease-soft hover:brightness-105 active:scale-[0.98]"
            >
              Explore
            </button>
          </div>
        </div>
      </HeroSlider>


      {/* FEATURED */}
      <section className="mx-auto max-w-310 px-5 py-8 md:px-8 md:py-12">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="label-mono text-primary">Featured departures</div>
            <h2 className="mt-2 text-[26px]">Signature itineraries</h2>
          </div>
          <Link to="/domestic" className="chip">
            Explore domestic
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-105 rounded-3xl" />
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
        <div className="mx-auto grid max-w-310 gap-6 px-5 py-14 md:grid-cols-3 md:px-8">
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

    </>
  );
}
