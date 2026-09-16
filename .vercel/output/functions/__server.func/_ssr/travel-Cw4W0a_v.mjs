import { t as supabase } from "./client-DQtMKDSl.mjs";
import { a as stringType, i as objectType, n as coerce, r as enumType, t as booleanType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travel-Cw4W0a_v.js
function itineraryOf(pkg) {
	const raw = pkg.itinerary;
	if (!Array.isArray(raw)) return [];
	return raw;
}
function listOf(value) {
	return Array.isArray(value) ? value : [];
}
var PACKAGE_SELECT = "id, code, name, destination, country, category, summary, description, cover_image, days, nights, price_inr, max_travelers, locations_count, rating, reviews_count, is_featured, status, itinerary, inclusions, exclusions, terms, cancellation_policy, created_at";
async function fetchPackages(filters) {
	let query = supabase.from("packages").select(PACKAGE_SELECT).eq("status", "active").is("deleted_at", null);
	if (filters?.category) query = query.eq("category", filters.category);
	if (filters?.featured) query = query.eq("is_featured", true);
	if (filters?.maxPrice) query = query.lte("price_inr", filters.maxPrice);
	if (filters?.minRating) query = query.gte("rating", filters.minRating);
	if (filters?.maxDays) query = query.lte("days", filters.maxDays);
	if (filters?.search?.trim()) {
		const term = filters.search.trim().replace(/[%,()]/g, "");
		query = query.or(`name.ilike.%${term}%,destination.ilike.%${term}%,country.ilike.%${term}%,summary.ilike.%${term}%`);
	}
	const { data, error } = await query.order("is_featured", { ascending: false }).order("rating", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function fetchPackageById(id) {
	const { data, error } = await supabase.from("packages").select("*").eq("id", id).maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchApprovedReviews(packageId) {
	let query = supabase.from("reviews").select("*").eq("status", "approved");
	if (packageId) query = query.eq("package_id", packageId);
	const { data, error } = await query.order("created_at", { ascending: false }).limit(30);
	if (error) throw error;
	return data ?? [];
}
var signupSchema = objectType({
	fullName: stringType().trim().min(2, "Enter your full name").max(80),
	email: stringType().trim().email("Enter a valid email").max(160),
	mobile: stringType().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid mobile number"),
	password: stringType().min(8, "Use at least 8 characters").max(72),
	confirmPassword: stringType()
}).refine((v) => v.password === v.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
});
var bookingSchema = objectType({
	customer_name: stringType().trim().min(2, "Enter your name").max(80),
	customer_email: stringType().trim().email("Enter a valid email").max(160),
	customer_mobile: stringType().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid mobile number"),
	travelers: coerce.number().int().min(1, "At least 1 traveller").max(40),
	travel_date: stringType().min(1, "Choose a travel date"),
	special_requirements: stringType().trim().max(500).optional().default(""),
	notes: stringType().trim().max(500).optional().default("")
});
var reviewSchema = objectType({
	rating: coerce.number().int().min(1).max(5),
	body: stringType().trim().min(12, "Tell us a little more").max(1200),
	package_id: stringType().uuid("Choose a package")
});
objectType({
	code: stringType().trim().min(3).max(24),
	name: stringType().trim().min(3).max(120),
	destination: stringType().trim().min(2).max(80),
	country: stringType().trim().min(2).max(80),
	category: enumType(["domestic", "international"]),
	summary: stringType().trim().max(300),
	description: stringType().trim().max(4e3),
	cover_image: stringType().trim().max(500),
	days: coerce.number().int().min(1).max(60),
	nights: coerce.number().int().min(0).max(60),
	price_inr: coerce.number().int().min(0).max(1e8),
	max_travelers: coerce.number().int().min(1).max(200),
	locations_count: coerce.number().int().min(1).max(50),
	terms: stringType().trim().max(2e3),
	cancellation_policy: stringType().trim().max(2e3),
	is_featured: booleanType(),
	status: enumType([
		"active",
		"inactive",
		"sold_out",
		"draft"
	])
});
//#endregion
export { fetchPackages as a, reviewSchema as c, fetchPackageById as i, signupSchema as l, bookingSchema as n, itineraryOf as o, fetchApprovedReviews as r, listOf as s, PACKAGE_SELECT as t };
