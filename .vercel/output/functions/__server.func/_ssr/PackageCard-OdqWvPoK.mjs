import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Star } from "../_libs/lucide-react.mjs";
import { n as inr } from "./format-CRihJgk0.mjs";
import { n as galleryOf, t as SaveButton } from "./SaveButton-CBA33Apr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PackageCard-OdqWvPoK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PackageCard({ pkg, delay = 0 }) {
	const images = galleryOf(pkg);
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (images.length < 2) return;
		const t = setInterval(() => setIndex((i) => (i + 1) % images.length), 4e3);
		return () => clearInterval(t);
	}, [images.length]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		"data-reveal": true,
		style: { transitionDelay: `${delay}ms` },
		className: "group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_oklch(0.262_0.029_55_/_45%)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-4/3 overflow-hidden",
			children: [
				images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: `${pkg.destination} — ${pkg.name}`,
					loading: i === 0 ? "lazy" : "lazy",
					width: 1280,
					height: 960,
					className: `absolute inset-0 size-full object-cover transition-all duration-[1100ms] ease-soft ${i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}`
				}, `${src}-${i}`)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "chip absolute left-3 top-3",
					children: pkg.category === "domestic" ? "Domestic" : "International"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute right-2.5 top-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, { packageId: pkg.id })
				}),
				images.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-3 flex justify-center gap-1.5",
					children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": `Show image ${i + 1}`,
						onClick: () => setIndex(i),
						className: `h-1 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-cream" : "w-2.5 bg-cream/55"}`
					}, `dot-${src}-${i}`))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[20px] leading-tight",
						children: pkg.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[11px] text-muted-foreground",
						children: [pkg.days, " days"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 line-clamp-2 text-[13px] text-muted-foreground",
					children: pkg.summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip",
							children: [pkg.locations_count, " destinations"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "chip",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-current text-primary" }),
								" ",
								pkg.rating
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "chip",
							children: pkg.destination
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "From"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[19px] font-bold",
						children: inr(pkg.price_inr)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/packages/$id",
						params: { id: pkg.id },
						className: "rounded-full border border-foreground px-4 py-2 text-[13px] font-medium transition-colors hover:bg-foreground hover:text-cream",
						children: "View details"
					})]
				})
			]
		})]
	});
}
//#endregion
export { PackageCard as t };
