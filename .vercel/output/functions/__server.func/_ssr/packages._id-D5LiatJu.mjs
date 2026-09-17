import { m as createFileRoute, p as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/packages._id-D5LiatJu.js
var $$splitComponentImporter = () => import("./packages._id-o-AUWYcb.mjs");
var Route = createFileRoute("/packages/$id")({
	head: () => ({ meta: [
		{ title: "Tour package details & itinerary — Tour & Travels" },
		{
			name: "description",
			content: "Day-wise itinerary, inclusions, exclusions, cancellation policy and INR pricing for this curated tour package."
		},
		{
			property: "og:title",
			content: "Tour package details — Tour & Travels"
		},
		{
			property: "og:description",
			content: "See the full plan, what's included and book this trip in minutes."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
