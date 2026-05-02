import { Link } from "@tanstack/react-router";
import { MessageCircle, MapPin, Phone, Sparkles } from "lucide-react";
import { SPA, whatsappLink } from "@/lib/spa";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Dalia Beauty Hub on WhatsApp"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-lg shadow-black/30 hover:scale-105 transition-transform"
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
    </a>
  );
}

function SpaHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="container-prose flex items-center justify-between py-4">
        <Link to="/spa" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-rose-400 to-amber-300 grid place-items-center text-white">
            <Sparkles size={16} />
          </div>
          <div className="font-display text-xl">Dalia Beauty Hub</div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/spa" activeOptions={{ exact: true }} activeProps={{ className: "text-rose-400" }} className="hover:text-rose-400 transition-colors">Home</Link>
          <Link to="/spa/services" activeProps={{ className: "text-rose-400" }} className="hover:text-rose-400 transition-colors">Services</Link>
          <Link to="/spa/book" className="inline-flex items-center gap-2 rounded-full bg-rose-400 text-white px-4 py-2 hover:bg-rose-500 transition-colors">
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}

function SpaFooter() {
  return (
    <footer className="border-t border-border/60 mt-20 bg-surface/30">
      <div className="container-prose py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="font-display text-xl mb-2">{SPA.name}</div>
          <p className="text-sm text-muted-foreground">A serene escape for hair, nails, skin and wellness in the heart of Nairobi.</p>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 text-rose-400" /> <span>{SPA.address}</span></div>
          <div className="flex items-start gap-2"><Phone size={16} className="mt-0.5 text-rose-400" /> <span>{SPA.phone}</span></div>
          <div className="flex items-start gap-2"><MessageCircle size={16} className="mt-0.5 text-rose-400" /> <a href={whatsappLink()} className="hover:text-rose-400" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></div>
        </div>
        <div className="text-sm">
          <div className="eyebrow mb-3">Hours</div>
          <p className="text-muted-foreground">Mon–Sat · 9:00 AM – 8:00 PM<br />Sunday · 10:00 AM – 5:00 PM</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {SPA.name} · Nairobi, Kenya
      </div>
    </footer>
  );
}

export function SpaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SpaHeader />
      <main className="flex-1">{children}</main>
      <SpaFooter />
      <WhatsAppFab />
    </div>
  );
}
