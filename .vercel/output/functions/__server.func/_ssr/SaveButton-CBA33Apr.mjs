import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Heart } from "../_libs/lucide-react.mjs";
import { t as supabase } from "./client-Ollb7OKR.mjs";
import { n as useAuth } from "./useAuth-D4alW62P.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SaveButton-CBA33Apr.js
var import_jsx_runtime = require_jsx_runtime();
var FILLERS = [
	"/images/stay.jpg",
	"/images/journey.jpg",
	"/images/cuisine.jpg",
	"/images/sunset.jpg"
];
/**
* Gallery images for a package. Admin-managed `gallery` values win; when the
* admin has not uploaded extra frames yet we build a small, sensible set from
* the cover image plus curated travel frames so the slider always has depth.
*/
function galleryOf(pkg) {
	const managed = (Array.isArray(pkg.gallery) ? pkg.gallery : []).filter((v) => typeof v === "string" && v.trim().length > 0);
	const list = [
		pkg.cover_image || "/images/hero.jpg",
		...managed,
		...FILLERS
	];
	return Array.from(new Set(list)).slice(0, 5);
}
function useSavedIds() {
	const { user } = useAuth();
	return useQuery({
		queryKey: ["saved-ids", user?.id],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("saved_packages").select("package_id");
			if (error) throw error;
			return (data ?? []).map((r) => r.package_id);
		}
	});
}
function SaveButton({ packageId, withLabel = false }) {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { data: savedIds } = useSavedIds();
	const saved = (savedIds ?? []).includes(packageId);
	const mutation = useMutation({
		mutationFn: async () => {
			if (!user) throw new Error("auth");
			if (saved) {
				const { error } = await supabase.from("saved_packages").delete().eq("package_id", packageId).eq("user_id", user.id);
				if (error) throw error;
				return "removed";
			}
			const { error } = await supabase.from("saved_packages").insert({
				package_id: packageId,
				user_id: user.id
			});
			if (error) throw error;
			return "saved";
		},
		onSuccess: (result) => {
			queryClient.invalidateQueries({ queryKey: ["saved-ids"] });
			queryClient.invalidateQueries({ queryKey: ["saved-packages"] });
			toast.success(result === "saved" ? "Added to saved packages" : "Removed from saved packages");
		},
		onError: () => toast.error("Could not update your saved packages")
	});
	const onClick = () => {
		if (!user) {
			toast.info("Sign in to save packages");
			navigate({ to: "/auth" });
			return;
		}
		mutation.mutate();
	};
	if (withLabel) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		disabled: mutation.isPending,
		className: "w-full rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-4 ${saved ? "fill-primary text-primary" : ""}` }), saved ? "Saved" : "Save package"]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"aria-label": saved ? "Remove from saved" : "Save package",
		onClick,
		disabled: mutation.isPending,
		className: "grid size-9 place-items-center rounded-full border border-border bg-card/90 transition-colors hover:bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `size-4 ${saved ? "fill-primary text-primary" : "text-foreground"}` })
	});
}
//#endregion
export { galleryOf as n, SaveButton as t };
