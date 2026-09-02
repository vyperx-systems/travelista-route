import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { inr } from "@/lib/format";
import type { Package } from "@/lib/travel";

const FALLBACK = [
  { id: "", name: "Kashmir Valley", destination: "Srinagar · Gulmarg", cover_image: "/images/kashmir.jpg", price_inr: 0 },
  { id: "", name: "Rajasthan Forts", destination: "Jaipur · Jodhpur", cover_image: "/images/rajasthan.jpg", price_inr: 0 },
  { id: "", name: "Bali Escape", destination: "Ubud · Seminyak", cover_image: "/images/bali.jpg", price_inr: 0 },
];

type Slide = {
  id: string;
  name: string;
  destination: string;
  cover_image: string;
  price_inr: number;
};

export function HeroSlider({ packages }: { packages: Package[] | undefined }) {
  const slides: Slide[] = useMemo(() => {
    const list = (packages ?? []).slice(0, 6).map((p) => ({
      id: p.id,
      name: p.name,
      destination: `${p.destination} · ${p.days}D/${p.nights}N`,
      cover_image: p.cover_image || "/images/hero.jpg",
      price_inr: p.price_inr,
    }));
    return list.length > 0 ? list : FALLBACK;
  }, [packages]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, slides.length]);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  const go = (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length);

  return (
    <section
      aria-label="Featured destinations"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-700 ease-soft"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={`${s.id}-${i}`} className="relative min-w-full">
            <div className="relative h-[58vh] min-h-[380px] w-full md:h-[66vh]">
              <img
                src={s.cover_image}
                alt={`${s.name} — ${s.destination}`}
                loading={i === 0 ? "eager" : "lazy"}
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
              <div className="absolute inset-x-0 bottom-0">
                <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-4 px-5 pb-10 md:px-8 md:pb-14">
                  <div className="text-cream">
                    <div className="label-mono flex items-center gap-1.5 text-cream/80">
                      <MapPin className="size-3" /> {s.destination}
                    </div>
                    <h2 className="mt-2 max-w-[22ch] text-[32px] leading-[1.05] text-cream sm:text-[44px]">
                      {s.name}
                    </h2>
                    {s.price_inr > 0 && (
                      <p className="mt-2 font-mono text-[12px] text-cream/80">
                        From {inr(s.price_inr)} per person
                      </p>
                    )}
                  </div>
                  {s.id && (
                    <Link
                      to="/packages/$id"
                      params={{ id: s.id }}
                      className="rounded-full bg-primary px-6 py-3 text-[13px] font-medium text-primary-foreground transition-[filter] hover:brightness-105"
                    >
                      View details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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

      <div className="absolute inset-x-0 top-4 mx-auto flex max-w-[1240px] justify-center gap-1.5 px-5">
        {slides.map((s, i) => (
          <button
            key={`dot-${s.id}-${i}`}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 bg-cream" : "w-4 bg-cream/45"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
