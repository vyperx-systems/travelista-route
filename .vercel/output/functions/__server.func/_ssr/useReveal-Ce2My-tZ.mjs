import { r as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useReveal-Ce2My-tZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Reveals every [data-reveal] element as it scrolls into view.
* Runs once per mount and re-scans on route content changes via the key argument.
*/
function useReveal(key) {
	(0, import_react.useEffect)(() => {
		const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
		if (nodes.length === 0) return;
		if (typeof IntersectionObserver === "undefined") {
			nodes.forEach((n) => n.setAttribute("data-reveal", "shown"));
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.setAttribute("data-reveal", "shown");
					observer.unobserve(entry.target);
				}
			});
		}, {
			rootMargin: "0px 0px -8% 0px",
			threshold: .08
		});
		nodes.forEach((n) => {
			if (n.getBoundingClientRect().top < window.innerHeight) n.setAttribute("data-reveal", "shown");
			else observer.observe(n);
		});
		return () => observer.disconnect();
	}, [key]);
}
//#endregion
export { useReveal as t };
