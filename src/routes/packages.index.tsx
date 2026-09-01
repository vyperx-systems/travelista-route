import { createFileRoute } from "@tanstack/react-router";
import { PackageBrowser } from "@/components/PackageBrowser";

export const Route = createFileRoute("/packages/")({
  head: () => ({
    meta: [
      { title: "All Tour Packages — Saffron Atlas" },
      {
        name: "description",
        content:
          "Browse every domestic and international tour package: durations, INR pricing, ratings and day-wise itineraries.",
      },
      { property: "og:title", content: "All Tour Packages — Saffron Atlas" },
      {
        property: "og:description",
        content: "Search and filter curated travel packages by destination, price, duration and rating.",
      },
    ],
  }),
  component: () => (
    <PackageBrowser
      title="Every journey we run"
      intro="Search by destination or country, filter by budget and duration, and open any package for the full day-by-day plan."
    />
  ),
});
