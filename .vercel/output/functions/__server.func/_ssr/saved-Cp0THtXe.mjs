import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as useReveal } from "./useReveal-Ce2My-tZ.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DQtMKDSl.mjs";
import { n as useAuth } from "./useAuth-DwHnDKK-.mjs";
import { t as PACKAGE_SELECT } from "./travel-Cw4W0a_v.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as PackageCard } from "./PackageCard-BwS8mDY5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-Cp0THtXe.js
var import_jsx_runtime = require_jsx_runtime();
function SavedPage() {
	const { user, loading } = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["saved-packages", user?.id],
		enabled: Boolean(user),
		queryFn: async () => {
			const { data: saved, error } = await supabase.from("saved_packages").select("package_id").order("created_at", { ascending: false });
			if (error) throw error;
			const ids = (saved ?? []).map((s) => s.package_id);
			if (ids.length === 0) return [];
			const { data: pkgs, error: pkgError } = await supabase.from("packages").select(PACKAGE_SELECT).in("id", ids);
			if (pkgError) throw pkgError;
			return pkgs ?? [];
		}
	});
	useReveal(data?.length);
	if (!loading && !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInPrompt, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1240px] px-5 py-12 md:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "label-mono text-primary",
				children: "Your shortlist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-[34px]",
				children: "Saved packages"
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					0,
					1,
					2
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[420px] rounded-3xl" }, i))
			}) : (data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 rounded-3xl border border-border bg-card p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						"Nothing saved yet. Tap the heart on any package to keep it here.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/domestic",
							className: "text-primary underline",
							children: "Browse tours"
						}),
						"."
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
				children: (data ?? []).map((pkg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackageCard, {
					pkg,
					delay: i * 70
				}, pkg.id))
			})
		]
	});
}
function SignInPrompt() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1240px] px-5 py-20 text-center md:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-[30px]",
			children: "Sign in to see your saved trips"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/auth",
			className: "chip mt-6 inline-flex chip-on",
			children: "Sign in"
		})]
	});
}
//#endregion
export { SavedPage as component };
