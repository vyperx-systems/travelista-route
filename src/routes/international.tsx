import { createFileRoute } from "@tanstack/react-router";
import { PackageBrowser } from "@/components/PackageBrowser";

export const Route = createFileRoute("/international")({
  head: () => ({
    meta: [
      { title: "International Tour Packages — Saffron Atlas" },
      {
        name: "description",
        content:
          "Dubai, Bali and Maldives holiday packages with visa assistance, transfers and transparent INR pricing.",
      },
      { property: "og:title", content: "International Tour Packages" },
      {
        property: "og:description",
        content: "Overseas journeys planned for Indian travellers, priced in rupees.",
      },
    ],
  }),
  component: () => (
    <PackageBrowser
      category="international"
      title="Beyond the border"
      intro="Skyline nights in Dubai, terraces in Bali and lagoons in the Maldives — visa guidance, transfers and stays handled."
    />
  ),
});
