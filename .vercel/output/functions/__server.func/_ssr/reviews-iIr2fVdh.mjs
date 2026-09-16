import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Star } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-DQtMKDSl.mjs";
import { n as useAuth } from "./useAuth-DwHnDKK-.mjs";
import { t as formatDate } from "./format-CRihJgk0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as fetchPackages, c as reviewSchema, r as fetchApprovedReviews } from "./travel-Cw4W0a_v.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-iIr2fVdh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReviewsPage() {
	const { user, fullName } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [rating, setRating] = (0, import_react.useState)(5);
	const [body, setBody] = (0, import_react.useState)("");
	const [packageId, setPackageId] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data: reviews } = useQuery({
		queryKey: ["reviews", "all"],
		queryFn: () => fetchApprovedReviews()
	});
	const { data: packages } = useQuery({
		queryKey: ["packages", "all-for-review"],
		queryFn: () => fetchPackages()
	});
	useReveal(reviews?.length);
	const submit = async () => {
		if (!user) {
			toast.info("Sign in to share your review");
			navigate({ to: "/auth" });
			return;
		}
		const parsed = reviewSchema.safeParse({
			rating,
			body,
			package_id: packageId
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0]?.message ?? "Check your review");
			return;
		}
		const pkg = (packages ?? []).find((p) => p.id === parsed.data.package_id);
		setBusy(true);
		const { error } = await supabase.from("reviews").insert({
			user_id: user.id,
			package_id: parsed.data.package_id,
			package_name: pkg?.name ?? "",
			author_name: fullName || "Traveller",
			rating: parsed.data.rating,
			body: parsed.data.body
		});
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		setBody("");
		setPackageId("");
		setRating(5);
		queryClient.invalidateQueries({ queryKey: ["reviews"] });
		toast.success("Thanks! Your review is pending moderation.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1240px] px-5 pt-14 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono text-primary",
				children: "Traveller stories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-[24ch] text-[40px] leading-[1.03]",
				children: "Reviews from the road."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-[54ch] text-[15px] text-muted-foreground",
				children: "Every review is written by a signed-in traveller and published after our team checks it against a real booking."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-[1240px] gap-6 px-5 py-10 md:px-8 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-7",
			children: (reviews ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground",
				children: "No approved reviews yet. Yours could be the first."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4",
				children: (reviews ?? []).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("blockquote", {
					"data-reveal": true,
					style: { transitionDelay: `${i * 60}ms` },
					className: "rounded-3xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-0.5 text-primary",
							children: Array.from({ length: r.rating }).map((_, s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-current" }, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-[15px] text-muted-foreground",
							children: r.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: "mt-4 font-mono text-[11px] text-muted-foreground",
							children: [
								r.author_name || "Traveller",
								" · ",
								r.package_name,
								" · ",
								formatDate(r.created_at)
							]
						})
					]
				}, r.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky top-24 rounded-3xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-[22px]",
						children: "Share your experience"
					}),
					!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-[13px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								className: "text-primary underline",
								children: "Sign in"
							}),
							" ",
							"to write a review."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Package"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "field mt-1.5",
									value: packageId,
									onChange: (e) => setPackageId(e.target.value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Choose a package"
									}), (packages ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.name
									}, p.id))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "label-mono",
								children: "Rating"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-1.5",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `${n} star`,
									onClick: () => setRating(n),
									className: "text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `size-5 ${n <= rating ? "fill-current" : ""}` })
								}, n))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "label-mono",
									children: "Your review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "field mt-1.5 min-h-[120px]",
									value: body,
									onChange: (e) => setBody(e.target.value),
									placeholder: "What worked, what surprised you, what you would tell a friend…"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => void submit(),
								disabled: busy,
								className: "rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60",
								children: busy ? "Sending…" : "Submit review"
							})
						]
					})
				]
			})
		})]
	})] });
}
//#endregion
export { ReviewsPage as component };
