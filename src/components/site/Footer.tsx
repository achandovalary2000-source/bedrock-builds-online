import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container-prose py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl mb-3">Meridian Builders</div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Building thoughtful, enduring structures across Central Texas since 2008.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-4">Visit</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            2400 East 6th Street<br />
            Austin, TX 78702<br />
            (512) 555-0142
          </p>
        </div>
        <div>
          <div className="eyebrow mb-4">Explore</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/materials" className="text-muted-foreground hover:text-gold">Materials</Link></li>
            <li><Link to="/projects" className="text-muted-foreground hover:text-gold">Projects</Link></li>
            <li><Link to="/about" className="text-muted-foreground hover:text-gold">About</Link></li>
            <li><Link to="/auth" className="text-muted-foreground hover:text-gold">Admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-prose py-6 flex flex-col md:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Meridian Builders, LLC. TX License #B-19847.</span>
          <span className="tracking-widest uppercase">Crafted in Austin</span>
        </div>
      </div>
    </footer>
  );
}
