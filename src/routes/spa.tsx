import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Heart, Star } from "lucide-react";
import heroImg from "@/assets/spa-hero.jpg";
import { SpaLayout } from "@/components/spa/SpaLayout";
import { services, SPA, whatsappLink } from "@/lib/spa";

export const Route = createFileRoute("/spa")({
  component: SpaHome,
  head: () => ({
    meta: [
      { title: "Dalia Beauty Hub — Beauty Spa in Nairobi" },
      { name: "description", content: "Book manicures, pedicures, hair braiding, facials, lashes and massages at Dalia Beauty Hub in Nairobi, Kenya." },
      { property: "og:title", content: "Dalia Beauty Hub — Beauty Spa in Nairobi" },
      { property: "og:description", content: "A serene escape for hair, nails, skin and wellness in the heart of Nairobi." },
    ],
  }),
});

function SpaHome() {
  const featured = services.slice(0, 6);
  return (
    <SpaLayout>
      {/* HERO */}
      <section className="relative h-[80vh] min-h-[560px] flex items-end overflow-hidden">
        <img src={heroImg} alt="Dalia Beauty Hub interior" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="container-prose relative pb-16 md:pb-24">
          <div className="eyebrow mb-5 text-rose-300">Nairobi · Beauty & Wellness</div>
          <h1 className="font-display text-5xl md:text-7xl leading-[0.95] max-w-3xl">
            Where you <em className="not-italic bg-gradient-to-r from-rose-400 to-amber-300 bg-clip-text text-transparent">glow</em><br />from the inside out.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Dalia Beauty Hub is your sanctuary for expert nail care, braiding, facials, lashes and massage — crafted by stylists who love what they do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/spa/book" className="group inline-flex items-center gap-2 px-6 py-3 bg-rose-400 text-white rounded-full text-sm font-medium hover:bg-rose-500 transition-colors">
              Book an Appointment <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm hover:bg-surface transition-colors">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-prose py-20 grid md:grid-cols-3 gap-10">
        {[
          { icon: Sparkles, t: "Expert stylists", d: "Our team brings years of training in nails, hair and skincare." },
          { icon: Heart, t: "Hygienic & relaxing", d: "Sanitized tools, calming spaces and complimentary refreshments." },
          { icon: Star, t: "Loved by Nairobi", d: "Hundreds of 5-star reviews from clients across the city." },
        ].map(({ icon: Icon, t, d }) => (
          <div key={t} className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-rose-400/10 grid place-items-center text-rose-400 mb-4">
              <Icon size={20} />
            </div>
            <h3 className="text-xl mb-2">{t}</h3>
            <p className="text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      {/* SERVICES */}
      <section className="container-prose pb-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-3 text-rose-300">Our Services</div>
            <h2 className="font-display text-4xl md:text-5xl">Treat yourself</h2>
          </div>
          <Link to="/spa/services" className="hidden md:inline-flex items-center gap-2 text-sm text-rose-400 hover:opacity-80">
            All services <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((s) => (
            <article key={s.slug} className="group rounded-2xl overflow-hidden border border-border/60 bg-surface/30 hover:border-rose-400/50 transition-colors">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <div className="text-xs uppercase tracking-widest text-rose-400 mb-2">{s.category}</div>
                <h3 className="text-lg mb-1">{s.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{s.duration}</span>
                  <span className="text-rose-400 font-medium">{s.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-prose pb-24">
        <div className="rounded-3xl border border-border p-10 md:p-16 bg-gradient-to-br from-rose-500/10 via-amber-300/5 to-transparent text-center">
          <h2 className="font-display text-3xl md:text-5xl mb-4">Ready to feel beautiful?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">Visit us at {SPA.address} or call {SPA.phone}. We can't wait to pamper you.</p>
          <Link to="/spa/book" className="inline-flex items-center gap-2 px-7 py-3 bg-rose-400 text-white rounded-full text-sm font-medium hover:bg-rose-500">
            Book Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </SpaLayout>
  );
}
