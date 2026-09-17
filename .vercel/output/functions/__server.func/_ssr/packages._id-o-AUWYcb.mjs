import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as CalendarDays, S as Check, b as ChevronRight, r as Star, t as X, u as MessageCircle, x as ChevronLeft } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-DQtMKDSl.mjs";
import { n as useAuth } from "./useAuth-DwHnDKK-.mjs";
import { i as whatsappEnquiryUrl, n as inr } from "./format-CRihJgk0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as itineraryOf, n as bookingSchema, o as listOf, r as fetchPackageById } from "./travel-DQsPuvJN.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as galleryOf, t as SaveButton } from "./SaveButton-4Vw5oWq4.mjs";
import { t as Route } from "./packages._id-D5LiatJu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/packages._id-o-AUWYcb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImageSlider({ images, alt, interval = 5e3, className = "" }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const timer = (0, import_react.useRef)(null);
	const count = images.length;
	(0, import_react.useEffect)(() => {
		if (paused || count < 2) return;
		timer.current = setInterval(() => setIndex((i) => (i + 1) % count), interval);
		return () => {
			if (timer.current) clearInterval(timer.current);
		};
	}, [
		paused,
		count,
		interval
	]);
	(0, import_react.useEffect)(() => setIndex(0), [count]);
	if (count === 0) return null;
	const go = (dir) => setIndex((i) => (i + dir + count) % count);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "group relative overflow-hidden rounded-3xl",
			onMouseEnter: () => setPaused(true),
			onMouseLeave: () => setPaused(false),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex transition-transform duration-700 ease-soft",
				style: { transform: `translateX(-${index * 100}%)` },
				children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src,
						alt: `${alt} — image ${i + 1}`,
						width: 1600,
						height: 1e3,
						loading: i === 0 ? "eager" : "lazy",
						className: "aspect-16/10 size-full object-cover"
					})
				}, `${src}-${i}`))
			}), count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Previous image",
					onClick: () => go(-1),
					className: "absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Next image",
					onClick: () => go(1),
					className: "absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-background/85 text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-3 flex justify-center gap-1.5",
					children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": `Show image ${i + 1}`,
						onClick: () => setIndex(i),
						className: `h-1 rounded-full transition-all ${i === index ? "w-7 bg-cream" : "w-3 bg-cream/50"}`
					}, `dot-${src}-${i}`))
				})
			] })]
		}), count > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 grid grid-cols-5 gap-2",
			children: images.map((src, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setIndex(i),
				"aria-label": `Show image ${i + 1}`,
				className: `overflow-hidden rounded-xl border transition-opacity ${i === index ? "border-primary" : "border-border opacity-70 hover:opacity-100"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					loading: "lazy",
					className: "aspect-4/3 size-full object-cover"
				})
			}, `thumb-${src}-${i}`))
		})]
	});
}
function PackageDetail() {
	const { id } = Route.useParams();
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: pkg, isLoading } = useQuery({
		queryKey: ["package", id],
		queryFn: () => fetchPackageById(id)
	});
	useReveal(pkg?.id);
	const [form, setForm] = (0, import_react.useState)({
		customer_name: "",
		customer_email: "",
		customer_mobile: "",
		travelers: "2",
		travel_date: "",
		special_requirements: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1240px] px-5 py-12 md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[380px] rounded-3xl" })
	});
	if (!pkg) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1240px] px-5 py-20 text-center md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[28px]",
				children: "Package not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "This package may have been removed by our team."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/domestic",
				className: "chip mt-6 inline-flex",
				children: "Browse domestic tours"
			})
		]
	});
	const days = itineraryOf(pkg);
	const inclusions = listOf(pkg.inclusions);
	const exclusions = listOf(pkg.exclusions);
	const total = Math.max(1, Number(form.travelers) || 1) * pkg.price_inr;
	const book = async () => {
		if (!user) {
			toast.info("Sign in to book this package");
			navigate({ to: "/auth" });
			return;
		}
		const parsed = bookingSchema.safeParse({
			...form,
			notes: ""
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "Check the booking details");
			return;
		}
		if (parsed.data.travelers > pkg.max_travelers) {
			toast.error(`This departure takes up to ${pkg.max_travelers} travellers`);
			return;
		}
		setBusy(true);
		const { data, error } = await supabase.from("bookings").insert({
			user_id: user.id,
			package_id: pkg.id,
			package_name: pkg.name,
			destination: pkg.destination,
			reference: "",
			customer_name: parsed.data.customer_name,
			customer_email: parsed.data.customer_email,
			customer_mobile: parsed.data.customer_mobile,
			travelers: parsed.data.travelers,
			travel_date: parsed.data.travel_date,
			special_requirements: parsed.data.special_requirements ?? "",
			total_amount_inr: parsed.data.travelers * pkg.price_inr
		}).select("reference").maybeSingle();
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		await supabase.from("notifications").insert({
			user_id: user.id,
			channel: "email",
			recipient: parsed.data.customer_email,
			subject: `Booking ${data?.reference ?? ""} received`,
			body: `Thanks ${parsed.data.customer_name}, your booking for ${pkg.name} is pending confirmation.`
		});
		queryClient.invalidateQueries({ queryKey: ["bookings"] });
		toast.success(`Booking created — ${data?.reference ?? "reference pending"}`);
		navigate({ to: "/bookings" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-[1240px] px-5 pt-10 md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageSlider, {
					images: galleryOf(pkg),
					alt: `${pkg.name} in ${pkg.destination}`,
					interval: 4e3
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "label-mono text-primary",
						children: pkg.code
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-[34px] leading-[1.05]",
						children: pkg.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-[14px] text-muted-foreground",
						children: pkg.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "chip",
								children: [
									pkg.days,
									" days / ",
									pkg.nights,
									" nights"
								]
							}),
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
								children: pkg.country
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Per person"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[26px] font-bold",
							children: inr(pkg.price_inr)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveButton, { packageId: pkg.id })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: whatsappEnquiryUrl(pkg),
						target: "_blank",
						rel: "noreferrer",
						className: "mt-4 inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-2.5 text-[13px] font-medium transition-colors hover:bg-foreground hover:text-cream",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " Enquire on WhatsApp"]
					})
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-[1240px] gap-8 px-5 py-12 md:px-8 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[24px]",
					children: "About this trip"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 whitespace-pre-line text-[14px] text-muted-foreground",
					children: pkg.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-10 text-[24px]",
					children: "Day-wise itinerary"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 grid gap-3",
					children: [days.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						"data-reveal": true,
						style: { transitionDelay: `${i * 60}ms` },
						className: "rounded-3xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "label-mono text-primary",
								children: ["Day ", d.day]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-1.5 text-[18px]",
								children: d.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 grid gap-1 text-[13px] text-muted-foreground",
								children: (d.items ?? []).map((item, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", item] }, j))
							})
						]
					}, `${d.day}-${i}`)), days.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted-foreground",
						children: "Itinerary coming soon."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 grid gap-6 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[18px]",
							children: "Inclusions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid gap-1.5 text-[13px] text-muted-foreground",
							children: inclusions.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 size-3.5 shrink-0 text-primary" }),
									" ",
									x
								]
							}, i))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-[18px]",
							children: "Exclusions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 grid gap-1.5 text-[13px] text-muted-foreground",
							children: exclusions.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mt-0.5 size-3.5 shrink-0 text-muted-foreground" }),
									" ",
									x
								]
							}, i))
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[18px]",
						children: "Terms"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-line text-[13px] text-muted-foreground",
						children: pkg.terms
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-[18px]",
						children: "Cancellation policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 whitespace-pre-line text-[13px] text-muted-foreground",
						children: pkg.cancellation_policy
					})] })]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:col-span-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-24 rounded-3xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "label-mono",
						children: "Book this trip"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 grid gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						book();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							placeholder: "Full name",
							value: form.customer_name,
							onChange: (e) => setForm((f) => ({
								...f,
								customer_name: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							type: "email",
							placeholder: "Email",
							value: form.customer_email,
							onChange: (e) => setForm((f) => ({
								...f,
								customer_email: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "field",
							placeholder: "Mobile number",
							value: form.customer_mobile,
							onChange: (e) => setForm((f) => ({
								...f,
								customer_mobile: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Travellers"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field mt-1.5",
									type: "number",
									min: 1,
									max: pkg.max_travelers,
									value: form.travelers,
									onChange: (e) => setForm((f) => ({
										...f,
										travelers: e.target.value
									}))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Travel date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "field mt-1.5",
									type: "date",
									value: form.travel_date,
									onChange: (e) => setForm((f) => ({
										...f,
										travel_date: e.target.value
									}))
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "field min-h-[86px]",
							placeholder: "Special requirements (optional)",
							value: form.special_requirements,
							onChange: (e) => setForm((f) => ({
								...f,
								special_requirements: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-t border-border pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "Total"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[20px] font-bold",
								children: inr(total)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy,
							className: "rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60",
							children: busy ? "Creating booking…" : user ? "Confirm booking" : "Sign in to book"
						})
					]
				})]
			})
		})]
	})] });
}
//#endregion
export { PackageDetail as component };
