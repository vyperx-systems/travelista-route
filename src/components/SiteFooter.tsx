import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-footer text-footer-foreground/80">
      <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-6 px-5 py-12 md:flex-row md:items-center md:px-8">
        <div>
          <div className="font-display text-[22px] italic text-footer-foreground">Saffron Atlas</div>
          <p className="mt-2 max-w-[42ch] text-[13px] text-footer-foreground/60">
            Slow journeys, told well. Hand-built itineraries across India and the world since 2016.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-7 gap-y-2 text-[13px] text-footer-foreground/70">
          <Link to="/domestic">Domestic</Link>
          <Link to="/international">International</Link>
          <Link to="/packages">Packages</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
