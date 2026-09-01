import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { inr } from "@/lib/format";
import type { Package } from "@/lib/travel";
import { SaveButton } from "@/components/SaveButton";

export function PackageCard({ pkg, delay = 0 }: { pkg: Package; delay?: number }) {
  return (
    <article
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="overflow-hidden rounded-3xl border border-border bg-card"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={pkg.cover_image || "/images/hero.jpg"}
          alt={`${pkg.destination} — ${pkg.name}`}
          loading="lazy"
          width={1280}
          height={960}
          className="size-full object-cover transition-transform duration-700 ease-soft hover:scale-105"
        />
        <span className="chip absolute left-3 top-3">
          {pkg.category === "domestic" ? "Domestic" : "International"}
        </span>
        <div className="absolute right-2.5 top-2.5">
          <SaveButton packageId={pkg.id} />
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[20px] leading-tight">{pkg.name}</h3>
          <span className="font-mono text-[11px] text-muted-foreground">{pkg.days} days</span>
        </div>
        <p className="mt-1.5 line-clamp-2 text-[13px] text-muted-foreground">{pkg.summary}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="chip">{pkg.locations_count} destinations</span>
          <span className="chip">
            <Star className="size-3 fill-current text-primary" /> {pkg.rating}
          </span>
          <span className="chip">{pkg.destination}</span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <span className="label-mono">From</span>
            <div className="text-[19px] font-bold">{inr(pkg.price_inr)}</div>
          </div>
          <Link
            to="/packages/$id"
            params={{ id: pkg.id }}
            className="rounded-full border border-foreground px-4 py-2 text-[13px] font-medium transition-colors hover:bg-foreground hover:text-cream"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
