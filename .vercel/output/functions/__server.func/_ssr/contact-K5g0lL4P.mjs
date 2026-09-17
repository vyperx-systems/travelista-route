import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { c as Phone, m as Mail, p as MapPin, u as MessageCircle, y as Clock } from "../_libs/lucide-react.mjs";
import { a as whatsappUrl } from "./format-CRihJgk0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-K5g0lL4P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INTERESTS = [
	"Domestic package",
	"International package",
	"Honeymoon",
	"Family group",
	"Custom itinerary"
];
function ContactPage() {
	const [name, setName] = (0, import_react.useState)("");
	const [interest, setInterest] = (0, import_react.useState)(INTERESTS[0]);
	const [travellers, setTravellers] = (0, import_react.useState)("2");
	const [month, setMonth] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	useReveal(1);
	const message = [
		`Hello Tour & Travels, I would like to enquire about a trip.`,
		`Name: ${name || "—"}`,
		`Interest: ${interest}`,
		`Travellers: ${travellers || "—"}`,
		month ? `Preferred month: ${month}` : "",
		notes ? `Notes: ${notes}` : ""
	].filter(Boolean).join("\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-310 px-5 pt-14 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono text-primary",
				children: "Contact"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-[24ch] text-[40px] leading-[1.03]",
				children: "Tell us where you want to go."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-[54ch] text-[15px] text-muted-foreground",
				children: [
					"Fill in a few details and press ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Enquire now" }),
					" — it opens WhatsApp with your trip brief ready to send. A planner replies with options and INR pricing, usually the same day."
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-310 gap-6 px-5 py-10 md:px-8 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-7",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border border-border bg-card p-6 md:p-8",
				"data-reveal": true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Your name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field mt-1.5",
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "Ananya Sharma"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "I am interested in"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex flex-wrap gap-2",
									children: INTERESTS.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setInterest(i),
										className: `chip ${interest === i ? "chip-on" : ""}`,
										children: i
									}, i))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Travellers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field mt-1.5",
									type: "number",
									min: 1,
									value: travellers,
									onChange: (e) => setTravellers(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Preferred month"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field mt-1.5",
									value: month,
									onChange: (e) => setMonth(e.target.value),
									placeholder: "November 2026"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Anything else"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "field mt-1.5 min-h-27.5",
									value: notes,
									onChange: (e) => setNotes(e.target.value),
									placeholder: "Flights from Kolkata, prefer boutique stays, one rest day…"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappUrl(message),
						target: "_blank",
						rel: "noopener noreferrer",
						className: "mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-[filter] hover:brightness-105",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " Enquire now on WhatsApp"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[12px] text-muted-foreground",
						children: "No form submissions, no waiting — the chat opens with your brief pre-filled."
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [[
					{
						icon: Phone,
						label: "Phone",
						value: "+91 93301 48654"
					},
					{
						icon: Mail,
						label: "Email",
						value: "mount.view@gmail.com"
					},
					{
						icon: MapPin,
						label: "Studio",
						value: "Somewhere in Kolkata, Kolkata 700016"
					},
					{
						icon: Clock,
						label: "Hours",
						value: "Mon–Sat, 10:00–19:00 IST"
					}
				].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-reveal": true,
					style: { transitionDelay: `${i * 70}ms` },
					className: "flex items-start gap-3 rounded-3xl border border-border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "mt-0.5 size-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "label-mono",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-[14px]",
						children: item.value
					})] })]
				}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-3xl",
					"data-reveal": true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/journey.jpg",
						alt: "Van on an open road at dawn",
						width: 1600,
						height: 1e3,
						loading: "lazy",
						className: "aspect-4/3 size-full object-cover"
					})
				})]
			})
		})]
	})] });
}
//#endregion
export { ContactPage as component };
