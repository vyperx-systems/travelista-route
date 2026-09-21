import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DQtMKDSl.mjs";
import { n as useAuth } from "./useAuth-DwHnDKK-.mjs";
import { n as inr, r as titleCase, t as formatDate } from "./format-CRihJgk0.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bookings-DeF-O86T.js
var import_jsx_runtime = require_jsx_runtime();
var statusTone = {
	pending: "bg-muted text-foreground",
	confirmed: "bg-primary text-primary-foreground",
	cancelled: "bg-destructive text-destructive-foreground",
	completed: "bg-foreground text-cream"
};
function BookingsPage() {
	const { user, loading } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["bookings", user?.id],
		enabled: Boolean(user),
		queryFn: async () => {
			const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	if (!loading && !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-310 px-5 py-20 text-center md:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-[30px]",
			children: "Sign in to view your bookings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth",
			className: "chip chip-on mt-6 inline-flex",
			children: "Sign in"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-310 px-5 py-12 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono text-primary",
				children: "Trip desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-[34px]",
				children: "My bookings"
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3",
				children: [0, 1].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 rounded-3xl" }, i))
			}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-3xl border border-border bg-card p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"No bookings yet.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/domestic",
							className: "text-primary underline",
							children: "Find a trip"
						}),
						"."
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3",
				children: (data ?? []).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-3xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-[11px] text-muted-foreground",
									children: b.reference
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 text-[20px]",
									children: b.package_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[13px] text-muted-foreground",
									children: b.destination
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-3 py-1 text-[11px] font-medium ${statusTone[b.status] ?? "bg-muted"}`,
								children: titleCase(b.status ?? "In Progress")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid gap-3 border-t border-border pt-4 text-[13px] sm:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-mono",
									children: "Travel date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1",
									children: formatDate(b.travel_date)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-mono",
									children: "Travellers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1",
									children: b.travelers
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-mono",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1 font-bold",
									children: inr(b.total_amount_inr)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-mono",
									children: "Payment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1",
									children: titleCase(b.payment_status ?? "To be paid")
								})] })
							]
						}),
						b.special_requirements && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[13px] text-muted-foreground",
							children: ["Notes: ", b.special_requirements]
						})
					]
				}, b.id))
			})
		]
	});
}
//#endregion
export { BookingsPage as component };
