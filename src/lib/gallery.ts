import type { Package } from "@/lib/travel";

const FILLERS = ["/images/stay.jpg", "/images/journey.jpg", "/images/cuisine.jpg", "/images/sunset.jpg"];

/**
 * Gallery images for a package. Admin-managed `gallery` values win; when the
 * admin has not uploaded extra frames yet we build a small, sensible set from
 * the cover image plus curated travel frames so the slider always has depth.
 */
export function galleryOf(pkg: Pick<Package, "cover_image" | "gallery">): string[] {
  const raw = Array.isArray(pkg.gallery) ? (pkg.gallery as unknown[]) : [];
  const managed = raw.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
  const cover = pkg.cover_image || "/images/hero.jpg";
  const list = [cover, ...managed, ...FILLERS];
  return Array.from(new Set(list)).slice(0, 5);
}
