import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchPackages, type Package } from "@/lib/travel";
import { PackageCard } from "@/components/PackageCard";
import { useReveal } from "@/hooks/useReveal";
import { Skeleton } from "@/components/ui/skeleton";

type Sort = "featured" | "price_low" | "price_high" | "rating" | "duration";

const priceFilters = [
  { label: "All prices", value: 0 },
  { label: "Under ₹50,000", value: 50000 },
  { label: "Under ₹75,000", value: 75000 },
  { label: "Under ₹1,00,000", value: 100000 },
];

export function PackageBrowser({
  category,
  title,
  intro,
}: {
  category?: "domestic" | "international";
  title: string;
  intro: string;
}) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [maxDays, setMaxDays] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");

  useMemo(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["packages", category, debounced, maxPrice, minRating, maxDays, featured],
    queryFn: () =>
      fetchPackages({
        category,
        search: debounced,
        maxPrice: maxPrice || undefined,
        minRating: minRating || undefined,
        maxDays: maxDays || undefined,
        featured: featured || undefined,
      }),
  });

  const packages = useMemo(() => {
    const list: Package[] = [...(data ?? [])];
    switch (sort) {
      case "price_low":
        return list.sort((a, b) => a.price_inr - b.price_inr);
      case "price_high":
        return list.sort((a, b) => b.price_inr - a.price_inr);
      case "rating":
        return list.sort((a, b) => Number(b.rating) - Number(a.rating));
      case "duration":
        return list.sort((a, b) => a.days - b.days);
      default:
        return list;
    }
  }, [data, sort]);

  useReveal(packages.length);

  return (
    <div className="mx-auto max-w-[1240px] px-5 py-12 md:px-8 md:py-16">
      <div className="label-mono text-primary">Browse the collection</div>
      <h1 className="mt-2 text-[30px] md:text-[38px]">{title}</h1>
      <p className="mt-3 max-w-[62ch] text-[15px] text-muted-foreground">{intro}</p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, country or package"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm"
          >
            <option value="featured">Popularity</option>
            <option value="price_low">Price: low to high</option>
            <option value="price_high">Price: high to low</option>
            <option value="rating">Highest rated</option>
            <option value="duration">Shortest trip</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {priceFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setMaxPrice(f.value)}
              className={`chip ${maxPrice === f.value ? "chip-on" : ""}`}
            >
              {f.label}
            </button>
          ))}
          <button
            onClick={() => setMinRating(minRating === 4.8 ? 0 : 4.8)}
            className={`chip ${minRating ? "chip-on" : ""}`}
          >
            4.8+ rated
          </button>
          <button
            onClick={() => setMaxDays(maxDays === 6 ? 0 : 6)}
            className={`chip ${maxDays ? "chip-on" : ""}`}
          >
            Under 7 days
          </button>
          <button
            onClick={() => setFeatured((v) => !v)}
            className={`chip ${featured ? "chip-on" : ""}`}
          >
            Featured
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[420px] rounded-3xl" />
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-border bg-card p-10 text-center">
          <h2 className="text-[22px]">No packages match that search</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try clearing a filter or searching for a different destination.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} delay={(i % 3) * 80} />
          ))}
        </div>
      )}
    </div>
  );
}
