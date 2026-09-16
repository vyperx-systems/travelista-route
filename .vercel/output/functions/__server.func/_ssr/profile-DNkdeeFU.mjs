import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DQtMKDSl.mjs";
import { n as useAuth } from "./useAuth-DwHnDKK-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-DNkdeeFU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { user, loading } = useAuth();
	const queryClient = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		mobile: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const { data } = useQuery({
		queryKey: ["profile", user?.id],
		enabled: Boolean(user),
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
			if (error) throw error;
			return data;
		}
	});
	(0, import_react.useEffect)(() => {
		if (data) setForm({
			full_name: data.full_name ?? "",
			mobile: data.mobile ?? ""
		});
	}, [data]);
	if (!loading && !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-310 px-5 py-20 text-center md:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-[30px]",
			children: "Sign in to manage your profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth",
			className: "chip chip-on mt-6 inline-flex",
			children: "Sign in"
		})]
	});
	const save = async () => {
		if (!user) return;
		setBusy(true);
		const { error } = await supabase.from("profiles").update({
			full_name: form.full_name.trim(),
			mobile: form.mobile.trim()
		}).eq("id", user.id);
		setBusy(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		queryClient.invalidateQueries({ queryKey: ["profile"] });
		toast.success("Profile updated");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-180 px-4 py-10 sm:px-5 md:px-8 md:py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono text-primary",
				children: "Account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-[30px] sm:text-[34px]",
				children: "My profile"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "label-mono text-primary",
					children: "Logged in as"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 break-all text-sm text-foreground",
						children: [" ", user?.email || "No email available"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 grid gap-4 rounded-3xl border border-border bg-card p-4 sm:mt-8 sm:p-6",
				onSubmit: (e) => {
					e.preventDefault();
					save();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							className: "field mt-1.5 w-full text-foreground opacity-70",
							value: user?.email ?? "",
							readOnly: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Full name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							className: "field mt-1.5 w-full text-foreground",
							value: form.full_name,
							onChange: (e) => setForm((f) => ({
								...f,
								full_name: e.target.value
							})),
							placeholder: "Enter your full name"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "label-mono",
							children: "Mobile number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "tel",
							className: "field mt-1.5 w-full text-foreground",
							value: form.mobile,
							onChange: (e) => setForm((f) => ({
								...f,
								mobile: e.target.value
							})),
							placeholder: "Enter your mobile number"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: busy,
						className: "w-full justify-self-start rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto",
						children: busy ? "Saving…" : "Save changes"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/bookings",
						className: "chip w-full justify-center sm:w-auto",
						children: "My bookings"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/saved",
						className: "chip w-full justify-center sm:w-auto",
						children: "Saved packages"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/reviews",
						className: "chip w-full justify-center sm:w-auto",
						children: "Write a review"
					})
				]
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
