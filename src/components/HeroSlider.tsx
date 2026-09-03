import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { inr } from "@/lib/format";
import type { Package } from "@/lib/travel";

const FALLBACK: Slide[] = [
  {
    id: "",
    name: "Kashmir Valley",
    destination: "Srinagar · Gulmarg",
    cover_image: "/images/kashmir.jpg",
    price_inr: 0,
    summary: "Chinar-lined lakes, shikara mornings and meadow drives.",
  },
  {
    id: "",
    name: "Royal Rajasthan",
    destination: "Jaipur · Jodhpur",
    cover_image: "/images/rajasthan.jpg",
    price_inr: 0,
    summary: "Forts, stepwells and desert light across the pink cities.",
  },
  {
    id: "",
    name: "Bali Escape",
    destination: "Ubud · Seminyak",
    cover_image: "/images/bali.jpg",
    price_inr: 0,
    summary: "Rice terraces, temple mornings and slow beach evenings.",
  },
];

type Slide = {
  id: string;
  name: string;
  destination: string;
  cover_image: string;
  price_inr: number;
  summary: string;
};

export function HeroSlider({
  packages,
  eyebrow,
  headline,
  children,
}: {
  packages: Package[] | undefined;
  eyebrow?: string;
  headline?: string;
  children?: ReactNode;
}) {
  const slides: Slide[] = useMemo(() => {
    const list = (packages ?? []).slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      destination: `${p.destination} · ${p.days}D/${p.nights}N`,
      cover_image: p.cover_image || "/images/hero.jpg",
      price_inr: p.price_inr,
      summary: p.summary,
    }));
    return list.length > 0 ? list : FALLBACK;
  }, [packages]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const key = slides.map((s) => s.id || s.name).join("|");

  useEffect(() => {
    if (paused || slides.length < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, slides.length, key]);

  useEffect(() => {
    setIndex(0);
  }, [key]);

  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section
      aria-label="Featured destinations"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[78vh] min-h-[520px] w-full">
        {slides.map((s, i) => (
          <img
            key={`${s.id}-${i}`}
            src={s.cover_image}
            alt={`${s.name} — ${s.destination}`}
            loading={i === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 size-full object-cover transition-all duration-[1200ms] ease-soft ${
              i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-[1240px] px-5 pb-12 md:px-8 md:pb-16">
            <div className="max-w-[62ch] text-cream">
              {eyebrow && <div className="label-mono text-cream/75">{eyebrow}</div>}
              {headline && (
                <h1 className="mt-3 text-[38px] leading-[1.02] text-cream sm:text-[56px]">
                  {headline}
                </h1>
              )}

              <div key={slides[index]?.id ?? index} className="mt-7 animate-in fade-in slide-in-from-bottom-3 duration-700">
                <div className="label-mono flex items-center gap-1.5 text-cream/80">
                  <MapPin className="size-3" /> {slides[index]?.destination}
                </div>
                <h2 className="mt-2 max-w-[24ch] text-[26px] leading-[1.1] text-cream sm:text-[34px]">
                  {slides[index]?.name}
                </h2>
                <p className="mt-2 max-w-[52ch] text-[14px] text-cream/80">
                  {slides[index]?.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {(slides[index]?.price_inr ?? 0) > 0 && (
                    <span className="font-mono text-[12px] text-cream/85">
                      From {inr(slides[index]!.price_inr)} per person
                    </span>
                  )}
                  {slides[index]?.id && (
                    <Link
                      to="/packages/$id"
                      params={{ id: slides[index]!.id }}
                      className="rounded-full bg-primary px-6 py-3 text-[13px] font-medium text-primary-foreground transition-[filter] hover:brightness-105"
                    >
                      View details
                    </Link>
                  )}
                </div>
              </div>

              {children && <div className="mt-8">{children}</div>}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              aria-label="Previous slide"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-opacity hover:opacity-80 md:left-6"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-opacity hover:opacity-80 md:right-6"
            >
              <ChevronRight className="size-4" />
            </button>

            <div className="absolute inset-x-0 top-5 mx-auto flex max-w-[1240px] justify-center gap-1.5 px-5">
              {slides.map((s, i) => (
                <button
                  key={`dot-${s.id}-${i}`}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === index ? "w-10 bg-cream" : "w-4 bg-cream/45"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
