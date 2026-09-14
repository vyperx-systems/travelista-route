import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Mail, Phone, MapPin, Clock } from "lucide-react";
import { whatsappUrl } from "@/lib/format";
import { useReveal } from "@/hooks/useReveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Tour & Travels — Plan your trip on WhatsApp" },
      {
        name: "description",
        content:
          "Talk to the team that plans our itineraries. Send an enquiry on WhatsApp and get trip ideas, dates and INR pricing within a day.",
      },
      { property: "og:title", content: "Contact Tour & Travels" },
      {
        property: "og:description",
        content: "Enquire on WhatsApp for custom itineraries, group trips and honeymoon plans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const INTERESTS = [
  "Domestic package",
  "International package",
  "Honeymoon",
  "Family group",
  "Custom itinerary",
] as const;

function ContactPage() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState<string>(INTERESTS[0]);
  const [travellers, setTravellers] = useState("2");
  const [month, setMonth] = useState("");
  const [notes, setNotes] = useState("");

  useReveal(1);

  const message = [
    `Hello Tour & Travels, I would like to enquire about a trip.`,
    `Name: ${name || "—"}`,
    `Interest: ${interest}`,
    `Travellers: ${travellers || "—"}`,
    month ? `Preferred month: ${month}` : "",
    notes ? `Notes: ${notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-14 md:px-8">
        <div className="label-mono text-primary">Contact</div>
        <h1 className="mt-3 max-w-[24ch] text-[40px] leading-[1.03]">
          Tell us where you want to go.
        </h1>
        <p className="mt-4 max-w-[54ch] text-[15px] text-muted-foreground">
          Fill in a few details and press <strong>Enquire now</strong> — it opens WhatsApp with your
          trip brief ready to send. A planner replies with options and INR pricing, usually the same
          day.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-10 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-6 md:p-8" data-reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="label-mono">Your name</span>
                <input
                  className="field mt-1.5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ananya Sharma"
                />
              </label>

              <div className="sm:col-span-2">
                <span className="label-mono">I am interested in</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTERESTS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInterest(i)}
                      className={`chip ${interest === i ? "chip-on" : ""}`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="label-mono">Travellers</span>
                <input
                  className="field mt-1.5"
                  type="number"
                  min={1}
                  value={travellers}
                  onChange={(e) => setTravellers(e.target.value)}
                />
              </label>
              <label className="block">
                <span className="label-mono">Preferred month</span>
                <input
                  className="field mt-1.5"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="November 2026"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="label-mono">Anything else</span>
                <textarea
                  className="field mt-1.5 min-h-[110px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Flights from Kolkata, prefer boutique stays, one rest day…"
                />
              </label>
            </div>

            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-[filter] hover:brightness-105"
            >
              <MessageCircle className="size-4" /> Enquire now on WhatsApp
            </a>
            <p className="mt-3 text-[12px] text-muted-foreground">
              No form submissions, no waiting — the chat opens with your brief pre-filled.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="grid gap-4">
            {[
              { icon: Phone, label: "Phone", value: "+91 90000 00000" },
              { icon: Mail, label: "Email", value: "hello@saffronatlas.in" },
              { icon: MapPin, label: "Studio", value: "2nd Floor, Park Street, Kolkata 700016" },
              { icon: Clock, label: "Hours", value: "Mon–Sat, 10:00–19:00 IST" },
            ].map((item, i) => (
              <div
                key={item.label}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className="flex items-start gap-3 rounded-3xl border border-border bg-card p-5"
              >
                <item.icon className="mt-0.5 size-4 text-primary" />
                <div>
                  <div className="label-mono">{item.label}</div>
                  <div className="mt-1 text-[14px]">{item.value}</div>
                </div>
              </div>
            ))}
            <div className="overflow-hidden rounded-3xl" data-reveal>
              <img
                src="/images/journey.jpg"
                alt="Van on an open road at dawn"
                width={1600}
                height={1000}
                loading="lazy"
                className="aspect-4/3 size-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
