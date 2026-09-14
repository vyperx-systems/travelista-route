import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { inr } from "@/lib/format";
import type { Package } from "@/lib/travel";
import { galleryOf } from "@/lib/gallery";
import { SaveButton } from "@/components/SaveButton";

export function PackageCard({ pkg, delay = 0 }: { pkg: Package; delay?: number }) {
  const images = galleryOf(pkg);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <article
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_oklch(0.262_0.029_55_/_45%)]"
    >
      <div className="relative aspect-4/3 overflow-hidden">
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`${pkg.destination} — ${pkg.name}`}
            loading={i === 0 ? "lazy" : "lazy"}
            width={1280}
            height={960}
            className={`absolute inset-0 size-full object-cover transition-all duration-[1100ms] ease-soft ${
              i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}
        <span className="chip absolute left-3 top-3">
          {pkg.category === "domestic" ? "Domestic" : "International"}
        </span>
        <div className="absolute right-2.5 top-2.5">
          <SaveButton packageId={pkg.id} />
        </div>
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
            {images.map((src, i) => (
              <button
                key={`dot-${src}-${i}`}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === index ? "w-6 bg-cream" : "w-2.5 bg-cream/55"
                }`}
              />
            ))}
          </div>
        )}
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
