import { useEffect } from "react";

/**
 * Reveals every [data-reveal] element as it scrolls into view.
 * Runs once per mount and re-scans on route content changes via the key argument.
 */
export function useReveal(key?: unknown) {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (nodes.length === 0) return;

    if (typeof IntersectionObserver === "undefined") {
      nodes.forEach((n) => n.setAttribute("data-reveal", "shown"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-reveal", "shown");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    nodes.forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight) {
        n.setAttribute("data-reveal", "shown");
      } else {
        observer.observe(n);
      }
    });

    return () => observer.disconnect();
  }, [key]);
}
