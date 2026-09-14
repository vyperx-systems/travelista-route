export function inr(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function titleCase(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const WHATSAPP_NUMBER = "919000000000";

export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}


export function whatsappEnquiryUrl(pkg: {
  code: string;
  name: string;
  days: number;
  nights: number;
}): string {
  const message = [
    `Hello, I am interested in the ${pkg.name} package.`,
    `Package ID: ${pkg.code}`,
    `Duration: ${pkg.days} Days / ${pkg.nights} Nights`,
    `Please provide more details.`,
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
