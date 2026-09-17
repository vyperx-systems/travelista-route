import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as Headphones, a as ShieldCheck, f as MapPinned, o as Search, p as MapPin } from "../_libs/lucide-react.mjs";
import { n as inr } from "./format-CRihJgk0.mjs";
import { i as fetchPackages } from "./travel-Bp2uVIGn.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PackageCard } from "./PackageCard-OdqWvPoK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BP7MgyTD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK = [
	{
		id: "",
		name: "Kashmir Valley",
		destination: "Srinagar · Gulmarg",
		cover_image: "/images/kashmir.jpg",
		price_inr: 0,
		summary: "Chinar-lined lakes, shikara mornings and meadow drives."
	},
	{
		id: "",
		name: "Royal Rajasthan",
		destination: "Jaipur · Jodhpur",
		cover_image: "/images/rajasthan.jpg",
		price_inr: 0,
		summary: "Forts, stepwells and desert light across the pink cities."
	},
	{
		id: "",
		name: "Bali Escape",
		destination: "Ubud · Seminyak",
		cover_image: "/images/bali.jpg",
		price_inr: 0,
		summary: "Rice terraces, temple mornings and slow beach evenings."
	}
];
function HeroSlider({ packages, eyebrow, headline, children }) {
	const slides = (0, import_react.useMemo)(() => {
		const list = (packages ?? []).slice(0, 6).map((p) => ({
			id: p.id,
			name: p.name,
			destination: `${p.destination} · ${p.days}D/${p.nights}N`,
			cover_image: p.cover_image || "/images/hero.jpg",
			price_inr: p.price_inr,
			summary: p.summary
		}));
		return list.length > 0 ? list : FALLBACK;
	}, [packages]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const timer = (0, import_react.useRef)(null);
	const key = slides.map((s) => s.id || s.name).join("|");
	(0, import_react.useEffect)(() => {
		if (paused || slides.length < 2) return;
		timer.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4e3);
		return () => {
			if (timer.current) clearInterval(timer.current);
		};
	}, [
		paused,
		slides.length,
		key
	]);
	(0, import_react.useEffect)(() => {
		setIndex(0);
	}, [key]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		"aria-label": "Featured destinations",
		className: "relative w-full overflow-hidden",
		onMouseEnter: () => setPaused(true),
		onMouseLeave: () => setPaused(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-[78vh] min-h-130 w-full",
			children: [
				slides.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: s.cover_image,
					alt: `${s.name} — ${s.destination}`,
					loading: i === 0 ? "eager" : "lazy",
					className: `absolute inset-0 size-full object-cover transition-all duration-1200 ease-soft ${i === index ? "scale-100 opacity-100" : "scale-105 opacity-0"}`
				}, `${s.id}-${i}`)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/25" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex flex-col justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto w-full max-w-310 px-5 pb-12 md:px-8 md:pb-16",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-[62ch] text-hero-ink",
							children: [
								eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "label-mono text-hero-ink/75",
									children: eyebrow
								}),
								headline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-[38px] leading-[1.02] text-hero-ink sm:text-[56px]",
									children: headline
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 animate-in fade-in slide-in-from-bottom-3 duration-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "label-mono flex items-center gap-1.5 text-hero-ink/80",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3" }),
												" ",
												slides[index]?.destination
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "mt-2 max-w-[24ch] text-[26px] leading-[1.1] text-hero-ink sm:text-[34px]",
											children: slides[index]?.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 max-w-[52ch] text-[14px] text-hero-ink/80",
											children: slides[index]?.summary
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 flex flex-wrap items-center gap-3",
											children: [(slides[index]?.price_inr ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[12px] text-hero-ink/85",
												children: [
													"From ",
													inr(slides[index].price_inr),
													" per person"
												]
											}), slides[index]?.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/packages/$id",
												params: { id: slides[index].id },
												className: "rounded-full bg-primary px-6 py-3 text-[13px] font-medium text-primary-foreground transition-[filter] hover:brightness-105",
												children: "View details"
											})]
										})
									]
								}, slides[index]?.id ?? index),
								children && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8",
									children
								})
							]
						})
					})
				})
			]
		})
	});
}
function Home() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("domestic");
	const navigate = useNavigate();
	const { data: featured, isLoading } = useQuery({
		queryKey: ["packages", "featured-home"],
		queryFn: () => fetchPackages({ featured: true })
	});
	const { data: heroPackages } = useQuery({
		queryKey: [
			"packages",
			"hero",
			category
		],
		queryFn: () => fetchPackages({ category })
	});
	useReveal(featured?.length);
	const explore = () => {
		navigate({
			to: category === "domestic" ? "/domestic" : "/international",
			search: query.trim() ? { q: query.trim() } : {}
		});
	};
	const top3 = (featured ?? []).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSlider, {
			packages: heroPackages,
			eyebrow: "Curated journeys · est. 2016",
			headline: "Explore the world. Create memories.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:max-w-140",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: ["domestic", "international"].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCategory(c),
						className: `chip transition-all duration-300 ${category === c ? "chip-on" : "bg-background/70 backdrop-blur"}`,
						children: c === "domestic" ? "Domestic" : "International"
					}, c))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-2xl border border-cream/25 bg-background/90 p-1.5 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 items-center gap-2 px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && explore(),
							placeholder: "Kashmir, Kerala, Dubai, Bali…",
							className: "w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: explore,
						className: "rounded-xl bg-primary px-5 py-2.5 text-[13px] font-medium text-primary-foreground transition-all duration-300 ease-soft hover:brightness-105 active:scale-[0.98]",
						children: "Explore"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-310 px-5 py-8 md:px-8 md:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono text-primary",
					children: "Featured departures"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-[26px]",
					children: "Signature itineraries"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/domestic",
					className: "chip",
					children: "Explore domestic"
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-105 rounded-3xl" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: top3.map((pkg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCard, {
					pkg,
					delay: i * 80
				}, pkg.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-310 gap-6 px-5 py-14 md:grid-cols-3 md:px-8",
				children: [
					{
						icon: MapPinned,
						title: "Itineraries, not lists",
						copy: "Every package is planned day by day, with real stays, transfers and rest built in."
					},
					{
						icon: ShieldCheck,
						title: "Clear INR pricing",
						copy: "Per-person rupee pricing, written inclusions and a cancellation policy on every page."
					},
					{
						icon: Headphones,
						title: "Talk to a human",
						copy: "Enquire on WhatsApp about any package and get a reply from the team that planned it."
					}
				].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					"data-reveal": true,
					style: { transitionDelay: `${i * 80}ms` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
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
		})
	] });
}
//#endregion
export { Home as component };
