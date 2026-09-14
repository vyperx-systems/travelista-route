import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  interval?: number;
  className?: string;
};

export function ImageSlider({ images, alt, interval = 5000, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = images.length;

  useEffect(() => {
    if (paused || count < 2) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, count, interval]);

  useEffect(() => setIndex(0), [count]);

  if (count === 0) return null;
  const go = (dir: number) => setIndex((i) => (i + dir + count) % count);

  return (
    <div className={className}>
      <div
        className="group relative overflow-hidden rounded-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex transition-transform duration-700 ease-soft"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, i) => (
            <div key={`${src}-${i}`} className="min-w-full">
              <img
                src={src}
                alt={`${alt} — image ${i + 1}`}
                width={1600}
                height={1000}
                loading={i === 0 ? "eager" : "lazy"}
                className="aspect-16/10 size-full object-cover"
              />
            </div>
          ))}
        </div>

        {count > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Next image"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((src, i) => (
                <button
                  key={`dot-${src}-${i}`}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-1 rounded-full transition-all ${i === index ? "w-7 bg-cream" : "w-3 bg-cream/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={`thumb-${src}-${i}`}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`overflow-hidden rounded-xl border transition-opacity ${
                i === index ? "border-primary" : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                className="aspect-4/3 size-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
