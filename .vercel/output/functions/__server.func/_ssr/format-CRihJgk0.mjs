//#region node_modules/.nitro/vite/services/ssr/assets/format-CRihJgk0.js
function inr(amount) {
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(amount || 0);
}
function formatDate(value) {
	if (!value) return "—";
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "—";
	return d.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function titleCase(value) {
	return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
var WHATSAPP_NUMBER = "919000000000";
function whatsappUrl(message) {
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function whatsappEnquiryUrl(pkg) {
	const message = [
		`Hello, I am interested in the ${pkg.name} package.`,
		`Package ID: ${pkg.code}`,
		`Duration: ${pkg.days} Days / ${pkg.nights} Nights`,
		`Please provide more details.`
	].join("\n");
	return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
//#endregion
export { whatsappUrl as a, whatsappEnquiryUrl as i, inr as n, titleCase as r, formatDate as t };
