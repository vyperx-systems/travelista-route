import { createFileRoute } from "@tanstack/react-router";
import { PackageBrowser } from "@/components/PackageBrowser";

export const Route = createFileRoute("/domestic")({
  head: () => ({
    meta: [
      { title: "Domestic Tour Packages in India — Saffron Atlas" },
      {
        name: "description",
        content:
          "Kashmir, Kerala, Rajasthan, Himachal and Goa tour packages with day-wise itineraries and per-person INR pricing.",
      },
      { property: "og:title", content: "Domestic Tour Packages in India" },
      {
        property: "og:description",
        content: "Curated India trips — houseboats, forts, hill stations and beaches.",
      },
    ],
  }),
  component: () => (
    <PackageBrowser
      category="domestic"
      title="India, unhurried"
      intro="Houseboats on the Dal, tea slopes in Munnar, desert forts in Rajasthan and pine valleys in Himachal — all planned end to end."
    />
  ),
});
