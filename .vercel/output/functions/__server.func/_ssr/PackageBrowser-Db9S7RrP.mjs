import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { o as Search } from "../_libs/lucide-react.mjs";
import { i as fetchPackages } from "./travel-DQsPuvJN.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PackageCard } from "./PackageCard-BwS8mDY5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PackageBrowser-Db9S7RrP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var priceFilters = [
	{
		label: "All prices",
		value: 0
	},
	{
		label: "Under ₹50,000",
		value: 5e4
	},
	{
		label: "Under ₹75,000",
		value: 75e3
	},
	{
		label: "Under ₹1,00,000",
		value: 1e5
	}
];
function PackageBrowser({ category, title, intro }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const [debounced, setDebounced] = (0, import_react.useState)("");
	const [maxPrice, setMaxPrice] = (0, import_react.useState)(0);
	const [minRating, setMinRating] = (0, import_react.useState)(0);
	const [maxDays, setMaxDays] = (0, import_react.useState)(0);
	const [featured, setFeatured] = (0, import_react.useState)(false);
	const [sort, setSort] = (0, import_react.useState)("featured");
	(0, import_react.useMemo)(() => {
		const t = setTimeout(() => setDebounced(search), 300);
		return () => clearTimeout(t);
	}, [search]);
	const { data, isLoading } = useQuery({
		queryKey: [
			"packages",
			category,
			debounced,
			maxPrice,
			minRating,
			maxDays,
			featured
		],
		queryFn: () => fetchPackages({
			category,
			search: debounced,
			maxPrice: maxPrice || void 0,
			minRating: minRating || void 0,
			maxDays: maxDays || void 0,
			featured: featured || void 0
		})
	});
	const packages = (0, import_react.useMemo)(() => {
		const list = [...data ?? []];
		switch (sort) {
			case "price_low": return list.sort((a, b) => a.price_inr - b.price_inr);
			case "price_high": return list.sort((a, b) => b.price_inr - a.price_inr);
			case "rating": return list.sort((a, b) => Number(b.rating) - Number(a.rating));
			case "duration": return list.sort((a, b) => a.days - b.days);
			default: return list;
		}
	}, [data, sort]);
	useReveal(packages.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-310 px-5 py-12 md:px-8 md:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono text-primary",
				children: "Browse the collection"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-[30px] md:text-[38px]",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-[62ch] text-[15px] text-muted-foreground",
				children: intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-3xl border border-border bg-card p-4 md:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search destination, country or package",
							className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (e) => setSort(e.target.value),
						className: "rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "featured",
								children: "Popularity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price_low",
								children: "Price: low to high"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "price_high",
								children: "Price: high to low"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rating",
								children: "Highest rated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "duration",
								children: "Shortest trip"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [
						priceFilters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMaxPrice(f.value),
							className: `chip ${maxPrice === f.value ? "chip-on" : ""}`,
							children: f.label
						}, f.value)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMinRating(minRating === 4.8 ? 0 : 4.8),
							className: `chip ${minRating ? "chip-on" : ""}`,
							children: "4.8+ rated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMaxDays(maxDays === 6 ? 0 : 6),
							className: `chip ${maxDays ? "chip-on" : ""}`,
							children: "Under 7 days"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFeatured((v) => !v),
							className: `chip ${featured ? "chip-on" : ""}`,
							children: "Featured"
						})
					]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-105 rounded-3xl" }, i))
			}) : packages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-3xl border border-border bg-card p-10 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[22px]",
					children: "No packages match that search"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Try clearing a filter or searching for a different destination."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: packages.map((pkg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCard, {
					pkg,
					delay: i % 3 * 80
				}, pkg.id))
			})
		]
	});
}
//#endregion
export { PackageBrowser as t };
