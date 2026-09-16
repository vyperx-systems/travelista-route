import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as HeartHandshake, s as Route, v as Compass } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CRJenGUY.js
var import_jsx_runtime = require_jsx_runtime();
function AboutPage() {
	useReveal(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1240px] px-5 pt-14 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono text-primary",
					children: "About us"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 max-w-[26ch] text-[40px] leading-[1.03]",
					children: "We build journeys we would take ourselves."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-[58ch] text-[15px] text-muted-foreground",
					children: "Tour & Travels started in 2016 with three planners, a shared notebook and a dislike of rushed tours. Every package on this site is walked, timed and rewritten until it has room to breathe — real stays, sensible transfers and at least one slow morning."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-[1240px] px-5 py-10 md:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-3xl",
				"data-reveal": true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/hero.jpg",
					alt: "Sunrise over Himalayan ridges",
					width: 1920,
					height: 1080,
					className: "aspect-21/9 size-full object-cover"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-[1240px] gap-6 px-5 py-14 md:grid-cols-3 md:px-8",
				children: [
					{
						icon: Route,
						title: "Planned day by day",
						copy: "No vague day plans. Each package lists what happens each morning and evening."
					},
					{
						icon: Compass,
						title: "Tested on the ground",
						copy: "Our planners travel the route before it is published, and again every season."
					},
					{
						icon: HeartHandshake,
						title: "Honest INR pricing",
						copy: "Per-person rupee pricing with written inclusions, exclusions and cancellation terms."
					}
				].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-reveal": true,
					style: { transitionDelay: `${i * 80}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-[20px]",
							children: item.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-[14px] text-muted-foreground",
							children: item.copy
						})
					]
				}, item.title))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-[1240px] px-5 py-14 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					{
						k: "9 years",
						v: "planning trips"
					},
					{
						k: "12,000+",
						v: "travellers hosted"
					},
					{
						k: "40+",
						v: "destinations covered"
					}
				].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-reveal": true,
					style: { transitionDelay: `${i * 70}ms` },
					className: "rounded-3xl border border-border bg-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[30px] font-bold",
						children: s.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "label-mono mt-1",
						children: s.v
					})]
				}, s.k))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/domestic",
					className: "rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
					children: "Browse tours"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/contact",
					className: "chip",
					children: "Talk to a planner"
				})]
			})]
		})
	] });
}
//#endregion
export { AboutPage as component };
