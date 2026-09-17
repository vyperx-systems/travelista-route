import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Check, a as ShieldCheck, i as Sparkles, w as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-Ollb7OKR.mjs";
import { n as useAuth } from "./useAuth-D4alW62P.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as signupSchema } from "./travel-Bp2uVIGn.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Analytics } from "../_libs/vercel__analytics.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BaGfTd7m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CONTROL = "w-full bg-transparent px-4 pb-2 pt-6 text-[14px] text-foreground outline-none placeholder:text-muted-foreground/70";
function FieldFrame({ label, floated, error, hint, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("block", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative rounded-2xl border bg-background transition-all duration-300 ease-soft focus-within:bg-card focus-within:shadow-[0_0_0_4px_var(--ring)]", error ? "border-destructive" : "border-input hover:border-primary/50 focus-within:border-primary"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("pointer-events-none absolute left-4 z-10 origin-left transition-all duration-300 ease-soft", floated ? "top-1.75 font-mono text-[10px] uppercase tracking-[0.14em] text-primary" : "top-4.25 text-[13px] text-muted-foreground"),
				children: label
			}), children]
		}), error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1.5 block text-[12px] text-destructive",
			children: error
		}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1.5 block text-[12px] text-muted-foreground",
			children: hint
		}) : null]
	});
}
function TextField({ label, value, onChange, error, hint, className, placeholder, type = "text", autoComplete, min, max }) {
	const [focused, setFocused] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldFrame, {
		label,
		floated: focused || value !== "" || type === "date" || type === "time",
		error,
		hint,
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			onFocus: () => setFocused(true),
			onBlur: () => setFocused(false),
			placeholder: focused ? placeholder ?? "" : "",
			...autoComplete ? { autoComplete } : {},
			...min !== void 0 ? { min } : {},
			...max !== void 0 ? { max } : {},
			className: CONTROL
		})
	});
}
function SubmitButton({ busy, children, className, type = "submit", onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		...onClick ? { onClick } : {},
		disabled: busy || disabled,
		className: cn("inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 ease-soft hover:brightness-105 active:scale-[0.98] disabled:opacity-60", className),
		children: busy ? "Please wait…" : children
	});
}
var PERKS = [
	"Save packages and compare them later",
	"Book with a unique booking reference",
	"Track booking and payment status"
];
function AuthPage() {
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		email: "",
		mobile: "",
		password: "",
		confirmPassword: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const navigate = useNavigate();
	const { user, loading } = useAuth();
	(0, import_react.useEffect)(() => {
		if (!loading && user) navigate({
			to: "/",
			replace: true
		});
	}, [
		loading,
		user,
		navigate
	]);
	const set = (key) => (value) => setForm((f) => ({
		...f,
		[key]: value
	}));
	const later = () => {
		if (typeof window !== "undefined") window.localStorage.setItem("sa_auth_skipped", "1");
		navigate({
			to: "/",
			replace: true
		});
	};
	const signIn = async () => {
		setBusy(true);
		setErrors({});
		const { error } = await supabase.auth.signInWithPassword({
			email: form.email.trim(),
			password: form.password
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (typeof window !== "undefined") window.localStorage.setItem("sa_auth_skipped", "1");
		toast.success("Welcome back");
		navigate({
			to: "/",
			replace: true
		});
	};
	const signUp = async () => {
		const parsed = signupSchema.safeParse(form);
		if (!parsed.success) {
			const map = {};
			parsed.error.issues.forEach((i) => {
				if (i.path[0]) map[String(i.path[0])] = i.message;
			});
			setErrors(map);
			return;
		}
		setBusy(true);
		setErrors({});
		const { error } = await supabase.auth.signUp({
			email: parsed.data.email,
			password: parsed.data.password,
			options: {
				emailRedirectTo: `${window.location.origin}/`,
				data: {
					full_name: parsed.data.fullName,
					mobile: parsed.data.mobile
				}
			}
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		window.localStorage.setItem("sa_auth_skipped", "1");
		toast.success(`Welcome, ${parsed.data.fullName.split(" ")[0]}. Please check your email to verify your account.`);
		navigate({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Analytics, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -left-40 -top-40 size-130 rounded-full bg-primary/15 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute -bottom-52 -right-32 size-115 rounded-full bg-lagoon/15 blur-3xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-auto grid max-w-310 items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-[1fr_480px] lg:gap-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "label-mono text-primary",
						children: "Traveller account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-[40px] leading-[1.02] sm:text-[52px]",
						children: mode === "signin" ? "Welcome back" : "Start planning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-[46ch] text-[15px] text-muted-foreground",
						children: "One account for saved packages and bookings with a unique reference. You can always browse first and sign in later."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-7 grid gap-2.5",
						children: PERKS.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							style: { animationDelay: `${i * 70}ms` },
							className: "flex animate-in items-center gap-2.5 text-[14px] text-muted-foreground fade-in slide-in-from-bottom-2 duration-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3" })
							}), p]
						}, p))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 hidden overflow-hidden rounded-3xl lg:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/kashmir.jpg",
							alt: "Snow-lined valley in Kashmir",
							width: 1600,
							height: 1200,
							className: "aspect-video size-full object-cover"
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border border-border bg-card/90 p-6 shadow-[0_24px_60px_-30px_oklch(0.262_0.029_55/35%)] backdrop-blur md:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative grid grid-cols-2 gap-1 rounded-full border border-border bg-background p-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": true,
								className: "absolute inset-y-1 w-[calc(50%-0.25rem)] rounded-full bg-primary transition-transform duration-400 ease-soft",
								style: { transform: `translateX(${mode === "signin" ? "0.25rem" : "calc(100% + 0.25rem)"})` }
							}), ["signin", "signup"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode(m),
								className: `relative z-10 rounded-full py-2.5 text-[13px] font-medium transition-colors duration-300 ${mode === m ? "text-primary-foreground" : "text-muted-foreground"}`,
								children: m === "signin" ? "Sign in" : "Create account"
							}, m))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-6 grid animate-in gap-4 fade-in slide-in-from-bottom-2 duration-500",
							onSubmit: (e) => {
								e.preventDefault();
								mode === "signin" ? signIn() : signUp();
							},
							children: [
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Full name",
									value: form.fullName,
									onChange: set("fullName"),
									error: errors["fullName"],
									placeholder: "Ananya Sharma"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Mobile number",
									value: form.mobile,
									onChange: set("mobile"),
									error: errors["mobile"],
									placeholder: "+91 98765 43210"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Email",
									type: "email",
									autoComplete: "email",
									value: form.email,
									onChange: set("email"),
									error: errors["email"],
									placeholder: "you@example.com"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Password",
									type: "password",
									autoComplete: mode === "signin" ? "current-password" : "new-password",
									value: form.password,
									onChange: set("password"),
									error: errors["password"],
									...mode === "signup" ? { hint: "At least 8 characters." } : {}
								}),
								mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Confirm password",
									type: "password",
									value: form.confirmPassword,
									onChange: set("confirmPassword"),
									error: errors["confirmPassword"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubmitButton, {
									busy,
									className: "mt-1 w-full",
									children: [
										mode === "signin" ? "Sign in" : "Create account",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
									]
								})
							]
						}, mode),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: later,
							className: "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium text-muted-foreground transition-all duration-300 ease-soft hover:border-foreground hover:text-foreground active:scale-[0.98]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " I will do it later"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-5 flex items-start gap-2 text-[12px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mt-0.5 size-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Your details stay private and are only used for bookings. Need help?",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/contact",
									className: "text-primary underline",
									children: "Contact us"
								}),
								"."
							] })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { AuthPage as component };
