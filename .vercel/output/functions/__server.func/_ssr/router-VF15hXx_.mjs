import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useNavigate, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as ShieldCheck, d as Menu, h as Heart, l as Moon, n as Sun, t as X } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-Ollb7OKR.mjs";
import { n as useAuth, t as AuthProvider } from "./useAuth-D4alW62P.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route } from "./packages._id-CtgqORPd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-VF15hXx_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Jl1PQX4O.css";
var KEY = "sa_theme";
var ThemeContext = (0, import_react.createContext)({
	theme: "light",
	toggle: () => {}
});
/** Inlined in the document head so the first paint already matches the choice. */
var themeBootstrapScript = `try{var t=localStorage.getItem('${KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}if(t==='dark'){document.documentElement.classList.add('dark')}document.documentElement.style.colorScheme=t}catch(e){}`;
function ThemeProvider({ children }) {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const next = window.localStorage.getItem(KEY) ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
		setTheme(next);
	}, []);
	(0, import_react.useEffect)(() => {
		const root = document.documentElement;
		root.classList.toggle("dark", theme === "dark");
		root.style.colorScheme = theme;
		window.localStorage.setItem(KEY, theme);
	}, [theme]);
	const toggle = (0, import_react.useCallback)(() => setTheme((t) => t === "dark" ? "light" : "dark"), []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeContext.Provider, {
		value: {
			theme,
			toggle
		},
		children
	});
}
function useTheme() {
	return (0, import_react.useContext)(ThemeContext);
}
function ThemeToggle({ className = "" }) {
	const { theme, toggle } = useTheme();
	const dark = theme === "dark";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: toggle,
		"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
		title: dark ? "Light mode" : "Dark mode",
		className: `relative grid size-9 place-items-center overflow-hidden rounded-full border border-border bg-card transition-colors hover:bg-muted ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: `absolute size-4 text-primary transition-all duration-500 ease-soft ${dark ? "translate-y-5 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: `absolute size-4 text-primary transition-all duration-500 ease-soft ${dark ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-5 -rotate-90 opacity-0"}` })]
	});
}
var links = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/domestic",
		label: "Domestic"
	},
	{
		to: "/international",
		label: "International"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const { user, isAdmin, fullName } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const signOut = async () => {
		await queryClient.cancelQueries();
		queryClient.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-310 items-center justify-between gap-4 px-5 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "flex items-center gap-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/web_logo.png",
						alt: "Travelista",
						className: "h-15 w-auto"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-6 text-[13px] text-muted-foreground lg:flex",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						activeProps: { className: "text-foreground font-medium" },
						activeOptions: { exact: l.to === "/" },
						className: "transition-colors hover:text-foreground",
						children: l.label
					}, l.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/saved",
								className: "hidden sm:inline-flex chip",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "size-3" }), " Saved"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/bookings",
								className: "hidden md:inline-flex chip",
								children: "My bookings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/profile",
								className: "hidden md:inline-flex chip",
								children: fullName.split(" ")[0] || "Profile"
							}),
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/admin",
								className: "hidden md:inline-flex chip chip-on",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3" }), " Admin"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: signOut,
								className: "hidden rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-cream transition-opacity hover:opacity-90 md:inline-flex",
								children: "Logout"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-cream transition-opacity hover:opacity-90",
							children: "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Toggle menu",
							onClick: () => setOpen((v) => !v),
							className: "grid size-9 place-items-center rounded-full border border-border lg:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-4" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border bg-card px-5 py-4 lg:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "grid gap-1 text-sm",
				children: [links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: l.to,
					onClick: () => setOpen(false),
					className: "rounded-xl px-3 py-2 transition-colors hover:bg-muted",
					children: l.label
				}, l.to)), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/saved",
						onClick: () => setOpen(false),
						className: "rounded-xl px-3 py-2 hover:bg-muted",
						children: "Saved packages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bookings",
						onClick: () => setOpen(false),
						className: "rounded-xl px-3 py-2 hover:bg-muted",
						children: "My bookings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/profile",
						onClick: () => setOpen(false),
						className: "rounded-xl px-3 py-2 hover:bg-muted",
						children: "Profile"
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin",
						onClick: () => setOpen(false),
						className: "rounded-xl px-3 py-2 text-primary hover:bg-muted",
						children: "Admin portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: signOut,
						className: "mt-1 rounded-xl bg-foreground px-3 py-2 text-left text-cream",
						children: "Logout"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/auth",
					onClick: () => setOpen(false),
					className: "mt-1 rounded-xl bg-foreground px-3 py-2 text-cream",
					children: "Sign in"
				})]
			})
		})]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 border-t border-border bg-footer text-footer-foreground/80",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-310 flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-display text-[22px] italic text-footer-foreground",
				children: "Tour & Travels"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-[42ch] text-[13px] text-footer-foreground/60",
				children: "Slow journeys, told well. Hand-built itineraries across India and the world since 2016."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-footer-foreground/70",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/domestic",
						children: "Domestic"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/international",
						children: "International"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/about",
						children: "About"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/contact",
						children: "Contact"
					})
				]
			})]
		})
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-full border border-border px-5 py-2.5 text-sm font-medium",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$11 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Tour & Travels — Tours & Travels" },
			{
				name: "description",
				content: "Hand-built domestic and international tour packages with day-wise itineraries, instant booking and INR pricing."
			},
			{
				property: "og:site_name",
				content: "Tour & Travels"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/images/web_logo.png",
				type: "image/png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@1,9..144,600;1,9..144,700&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("head", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { dangerouslySetInnerHTML: { __html: themeBootstrapScript } })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function FirstVisitAuthGate() {
	const { loading, user } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	(0, import_react.useEffect)(() => {
		if (loading || user || pathname === "/auth") return;
		if (typeof window === "undefined") return;
		if (window.localStorage.getItem("sa_auth_skipped") === "1") return;
		navigate({
			to: "/auth",
			replace: true
		});
	}, [
		loading,
		user,
		pathname,
		navigate
	]);
	return null;
}
function RootComponent() {
	const { queryClient } = Route$11.useRouteContext();
	const router = useRouter();
	const isAdmin = useRouterState({ select: (s) => s.location.pathname }).startsWith("/admin");
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ThemeProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FirstVisitAuthGate, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen flex-col",
				children: [
					!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
					}),
					!isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "top-center" })
		] }) })
	});
}
var $$splitComponentImporter$9 = () => import("./routes-BP7MgyTD.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Tour & Travels — Curated Tours & Travel Packages in INR" },
		{
			name: "description",
			content: "Discover hand-built domestic and international tour packages with day-wise itineraries, transparent INR pricing, saved trips and instant booking."
		},
		{
			property: "og:title",
			content: "Tour & Travels — Curated Tours & Travel Packages"
		},
		{
			property: "og:description",
			content: "Slow, story-first itineraries across India and the world. Browse packages, save favourites and book in minutes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./about-DoDNuqJ7.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Tour & Travels — Slow, hand-built travel since 2016" },
		{
			name: "description",
			content: "We plan story-first itineraries across India and the world, walked and tested by our own planners, with transparent per-person INR pricing."
		},
		{
			property: "og:title",
			content: "About Tour & Travels"
		},
		{
			property: "og:description",
			content: "A small planning studio building slow, well-paced journeys since 2016."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin-CSijZluj.mjs");
var Route$8 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{ title: "Admin Portal — Tour & Travels" },
		{
			name: "description",
			content: "Role-protected admin portal to manage tour packages, bookings and travellers for Tour & Travels."
		},
		{
			property: "og:title",
			content: "Admin Portal — Tour & Travels"
		},
		{
			property: "og:description",
			content: "Manage packages, booking statuses and registered travellers."
		},
		{
			name: "robots",
			content: "noindex, nofollow"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./auth-BaGfTd7m.mjs");
var Route$7 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Sign in or create an account — Tour & Travels" },
		{
			name: "description",
			content: "Sign in to save packages, book curated tours and track your booking status with Tour & Travels."
		},
		{
			property: "og:title",
			content: "Sign in — Tour & Travels"
		},
		{
			property: "og:description",
			content: "Access saved trips, bookings and account details on your Tour & Travels account."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./bookings-Lttnzl8z.mjs");
var Route$6 = createFileRoute("/bookings")({
	head: () => ({ meta: [
		{ title: "My bookings — Tour & Travels" },
		{
			name: "description",
			content: "Track your Tour & Travels tour bookings: reference number, travel date, travellers and status."
		},
		{
			property: "og:title",
			content: "My bookings — Tour & Travels"
		},
		{
			property: "og:description",
			content: "Every booking and its live status in one view."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./contact-K5g0lL4P.mjs");
var Route$5 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Tour & Travels — Plan your trip on WhatsApp" },
		{
			name: "description",
			content: "Talk to the team that plans our itineraries. Send an enquiry on WhatsApp and get trip ideas, dates and INR pricing within a day."
		},
		{
			property: "og:title",
			content: "Contact Tour & Travels"
		},
		{
			property: "og:description",
			content: "Enquire on WhatsApp for custom itineraries, group trips and honeymoon plans."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./domestic-z3-WKe5B.mjs");
var Route$4 = createFileRoute("/domestic")({
	head: () => ({ meta: [
		{ title: "Domestic Tour Packages in India — Tour & Travels" },
		{
			name: "description",
			content: "Kashmir, Kerala, Rajasthan, Himachal and Goa tour packages with day-wise itineraries and per-person INR pricing."
		},
		{
			property: "og:title",
			content: "Domestic Tour Packages in India"
		},
		{
			property: "og:description",
			content: "Curated India trips — houseboats, forts, hill stations and beaches."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./international-s6M0Jf1V.mjs");
var Route$3 = createFileRoute("/international")({
	head: () => ({ meta: [
		{ title: "International Tour Packages — Tour & Travels" },
		{
			name: "description",
			content: "Dubai, Bali and Maldives holiday packages with visa assistance, transfers and transparent INR pricing."
		},
		{
			property: "og:title",
			content: "International Tour Packages"
		},
		{
			property: "og:description",
			content: "Overseas journeys planned for Indian travellers, priced in rupees."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./profile-8liE__St.mjs");
var Route$2 = createFileRoute("/profile")({
	head: () => ({ meta: [
		{ title: "My profile — Tour & Travels" },
		{
			name: "description",
			content: "Update your name and mobile number used for tour bookings and trip updates."
		},
		{
			property: "og:title",
			content: "My profile — Tour & Travels"
		},
		{
			property: "og:description",
			content: "Keep your traveller details current."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./saved-CRTwf1fo.mjs");
var Route$1 = createFileRoute("/saved")({
	head: () => ({ meta: [
		{ title: "Saved tour packages — Tour & Travels" },
		{
			name: "description",
			content: "Your shortlisted domestic and international tour packages, ready to book."
		},
		{
			property: "og:title",
			content: "Saved packages — Tour & Travels"
		},
		{
			property: "og:description",
			content: "Everything you shortlisted, in one place."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	AboutRoute: Route$9.update({
		id: "/about",
		path: "/about",
		getParentRoute: () => Route$11
	}),
	AdminRoute: Route$8.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$11
	}),
	AuthRoute: Route$7.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$11
	}),
	BookingsRoute: Route$6.update({
		id: "/bookings",
		path: "/bookings",
		getParentRoute: () => Route$11
	}),
	ContactRoute: Route$5.update({
		id: "/contact",
		path: "/contact",
		getParentRoute: () => Route$11
	}),
	DomesticRoute: Route$4.update({
		id: "/domestic",
		path: "/domestic",
		getParentRoute: () => Route$11
	}),
	InternationalRoute: Route$3.update({
		id: "/international",
		path: "/international",
		getParentRoute: () => Route$11
	}),
	ProfileRoute: Route$2.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => Route$11
	}),
	SavedRoute: Route$1.update({
		id: "/saved",
		path: "/saved",
		getParentRoute: () => Route$11
	}),
	PackagesIdRoute: Route.update({
		id: "/packages/$id",
		path: "/packages/$id",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
