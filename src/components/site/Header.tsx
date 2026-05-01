import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/materials", label: "Materials" },
  { to: "/projects", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="container-prose flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: "var(--gradient-gold)" }}>
            <span className="font-display text-xl text-gold-foreground">M</span>
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg tracking-tight">Jumbo Builders</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Austin · Texas</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="text-sm px-5 py-2.5 rounded-sm bg-gold text-gold-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Request a Quote
          </Link>
        </nav>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <div className="container-prose py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-sm text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
