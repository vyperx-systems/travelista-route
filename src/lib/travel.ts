import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Package = Database["public"]["Tables"]["packages"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type ItineraryDay = { day: number; title: string; items: string[] };

export function itineraryOf(pkg: Package): ItineraryDay[] {
  const raw = pkg.itinerary as unknown;
  if (!Array.isArray(raw)) return [];
  return raw as ItineraryDay[];
}

export function listOf(value: unknown): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export const PACKAGE_SELECT =
  "id, code, name, destination, country, category, summary, description, cover_image, days, nights, price_inr, max_travelers, locations_count, rating, reviews_count, is_featured, status, itinerary, inclusions, exclusions, terms, cancellation_policy, created_at";

export async function fetchPackages(filters?: {
  category?: "domestic" | "international" | undefined;
  search?: string | undefined;
  maxPrice?: number | undefined;
  minRating?: number | undefined;
  featured?: boolean | undefined;
  maxDays?: number | undefined;
}) {
  let query = supabase
    .from("packages")
    .select(PACKAGE_SELECT)
    .eq("status", "active")
    .is("deleted_at", null);

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.featured) query = query.eq("is_featured", true);
  if (filters?.maxPrice) query = query.lte("price_inr", filters.maxPrice);
  if (filters?.minRating) query = query.gte("rating", filters.minRating);
  if (filters?.maxDays) query = query.lte("days", filters.maxDays);
  if (filters?.search?.trim()) {
    const term = filters.search.trim().replace(/[%,()]/g, "");
    query = query.or(
      `name.ilike.%${term}%,destination.ilike.%${term}%,country.ilike.%${term}%,summary.ilike.%${term}%`,
    );
  }

  const { data, error } = await query.order("is_featured", { ascending: false }).order("rating", {
    ascending: false,
  });
  if (error) throw error;
  return (data ?? []) as Package[];
}

export async function fetchPackageById(id: string) {
  const { data, error } = await supabase.from("packages").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Package | null;
}

export async function fetchApprovedReviews(packageId?: string) {
  let query = supabase.from("reviews").select("*").eq("status", "approved");
  if (packageId) query = query.eq("package_id", packageId);
  const { data, error } = await query.order("created_at", { ascending: false }).limit(30);
  if (error) throw error;
  return (data ?? []) as Review[];
}

export const signupSchema = z
  .object({
    fullName: z.string().trim().min(2, "Enter your full name").max(80),
    email: z.string().trim().email("Enter a valid email").max(160),
    mobile: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid mobile number"),
    password: z.string().min(8, "Use at least 8 characters").max(72),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const bookingSchema = z.object({
  customer_name: z.string().trim().min(2, "Enter your name").max(80),
  customer_email: z.string().trim().email("Enter a valid email").max(160),
  customer_mobile: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid mobile number"),
  travelers: z.coerce.number().int().min(1, "At least 1 traveller").max(40),
  travel_date: z.string().min(1, "Choose a travel date"),
  special_requirements: z.string().trim().max(500).optional().default(""),
  notes: z.string().trim().max(500).optional().default(""),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(12, "Tell us a little more").max(1200),
  package_id: z.string().uuid("Choose a package"),
});

export const packageFormSchema = z.object({
  code: z.string().trim().min(3).max(24),
  name: z.string().trim().min(3).max(120),
  destination: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  category: z.enum(["domestic", "international"]),
  summary: z.string().trim().max(300),
  description: z.string().trim().max(4000),
  cover_image: z.string().trim().max(500),
  days: z.coerce.number().int().min(1).max(60),
  nights: z.coerce.number().int().min(0).max(60),
  price_inr: z.coerce.number().int().min(0).max(100000000),
  max_travelers: z.coerce.number().int().min(1).max(200),
  locations_count: z.coerce.number().int().min(1).max(50),
  terms: z.string().trim().max(2000),
  cancellation_policy: z.string().trim().max(2000),
  is_featured: z.boolean(),
  status: z.enum(["active", "inactive", "sold_out", "draft"]),
});
