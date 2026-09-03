import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, HeartHandshake, Route as RouteIcon } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Saffron Atlas — Slow, hand-built travel since 2016" },
      {
        name: "description",
        content:
          "We plan story-first itineraries across India and the world, walked and tested by our own planners, with transparent per-person INR pricing.",
      },
      { property: "og:title", content: "About Saffron Atlas" },
      {
        property: "og:description",
        content: "A small planning studio building slow, well-paced journeys since 2016.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  useReveal(1);
  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-14 md:px-8">
        <div className="label-mono text-primary">About us</div>
        <h1 className="mt-3 max-w-[26ch] text-[40px] leading-[1.03]">
          We build journeys we would take ourselves.
        </h1>
        <p className="mt-5 max-w-[58ch] text-[15px] text-muted-foreground">
          Saffron Atlas started in 2016 with three planners, a shared notebook and a dislike of
          rushed tours. Every package on this site is walked, timed and rewritten until it has room
          to breathe — real stays, sensible transfers and at least one slow morning.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-10 md:px-8">
        <div className="overflow-hidden rounded-3xl" data-reveal>
          <img
            src="/images/hero.jpg"
            alt="Sunrise over Himalayan ridges"
            width={1920}
            height={1080}
            className="aspect-21/9 size-full object-cover"
          />
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-[1240px] gap-6 px-5 py-14 md:grid-cols-3 md:px-8">
          {[
            {
              icon: RouteIcon,
              title: "Planned day by day",
              copy: "No vague day plans. Each package lists what happens each morning and evening.",
            },
            {
              icon: Compass,
              title: "Tested on the ground",
              copy: "Our planners travel the route before it is published, and again every season.",
            },
            {
              icon: HeartHandshake,
              title: "Honest INR pricing",
              copy: "Per-person rupee pricing with written inclusions, exclusions and cancellation terms.",
            },
          ].map((item, i) => (
            <div key={item.title} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <item.icon className="size-5 text-primary" />
              <h2 className="mt-4 text-[20px]">{item.title}</h2>
              <p className="mt-2 text-[14px] text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 md:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { k: "9 years", v: "planning trips" },
            { k: "12,000+", v: "travellers hosted" },
            { k: "40+", v: "destinations covered" },
          ].map((s, i) => (
            <div
              key={s.k}
              data-reveal
              style={{ transitionDelay: `${i * 70}ms` }}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <div className="text-[30px] font-bold">{s.k}</div>
              <div className="label-mono mt-1">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/packages"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Browse packages
          </Link>
          <Link to="/contact" className="chip">
            Talk to a planner
          </Link>
        </div>
      </section>
    </>
  );
}
