import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Hammer, Building2, Home, Award, ShieldCheck, Compass } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/images";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Meridian Builders — Premium Construction in Austin, Texas" },
      { name: "description", content: "Architectural construction, materials, and project delivery across Central Texas. Established 2008." },
    ],
  }),
});

type Project = { id: string; title: string; location: string | null; year: number | null; category: string | null; cover_image_url: string | null };

function Index() {
  const [featured, setFeatured] = useState<Project[]>([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,location,year,category,cover_image_url")
      .eq("featured", true)
      .order("sort_order")
      .then(({ data }) => setFeatured(data ?? []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* HERO */}
        <section className="relative h-[88vh] min-h-[600px] flex items-end overflow-hidden">
          <img
            src={heroImg}
            alt="Meridian Builders construction site at dusk in Austin"
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
          <div className="absolute inset-0 bg-background/30" />
          <div className="container-prose relative pb-24 md:pb-32">
            <div className="eyebrow mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Established 2008 · Austin, Texas
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Building <em className="text-gradient-gold not-italic">enduring</em> places<br />across Central Texas.
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-xl animate-in fade-in duration-1000 delay-200">
              Meridian Builders delivers residential, commercial, and hospitality construction with architectural precision and uncompromising material quality.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-in fade-in duration-1000 delay-300">
              <Link to="/contact" className="group inline-flex items-center gap-2 px-7 py-4 bg-gold text-gold-foreground rounded-sm text-sm font-medium hover:opacity-90 transition-opacity">
                Start a Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/projects" className="inline-flex items-center gap-2 px-7 py-4 border border-border rounded-sm text-sm hover:bg-surface transition-colors">
                View Our Work
              </Link>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="border-y border-border/60 bg-surface/40">
          <div className="container-prose grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
            {[
              { v: "180+", l: "Projects Delivered" },
              { v: "17", l: "Years Building" },
              { v: "$420M", l: "Constructed Value" },
              { v: "100%", l: "Licensed & Bonded" },
            ].map((s) => (
              <div key={s.l} className="px-4 py-10 text-center">
                <div className="font-display text-4xl md:text-5xl text-gradient-gold">{s.v}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section className="container-prose py-24 md:py-32">
          <div className="grid md:grid-cols-3 gap-12 items-end mb-16">
            <div className="md:col-span-2">
              <div className="eyebrow mb-4">What We Build</div>
              <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-2xl">
                Three disciplines.<br />One standard of craft.
              </h2>
            </div>
            <p className="text-muted-foreground">
              From custom hill country residences to downtown towers, every project carries the Meridian signature: premium materials, integrated design, and on-time delivery.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-border">
            {[
              { icon: Home, t: "Residential", d: "Custom homes, hill country estates, and high-end remodels in Westlake, Tarrytown, and beyond." },
              { icon: Building2, t: "Commercial", d: "Office towers, mixed-use developments, and tenant build-outs delivered to LEED standards." },
              { icon: Hammer, t: "Hospitality", d: "Boutique hotels, restaurants, and adaptive reuse projects across Austin's creative districts." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="bg-background p-10 hover:bg-surface transition-colors group">
                <Icon size={28} className="text-gold mb-6" />
                <h3 className="text-2xl mb-3">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PROJECTS */}
        <section className="bg-surface/30 border-y border-border/60 py-24 md:py-32">
          <div className="container-prose">
            <div className="flex items-end justify-between mb-12">
              <div>
                <div className="eyebrow mb-4">Selected Work</div>
                <h2 className="font-display text-4xl md:text-5xl">Recent Projects</h2>
              </div>
              <Link to="/projects" className="hidden md:inline-flex items-center gap-2 text-sm text-gold hover:opacity-80">
                All projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((p) => (
                <article key={p.id} className="group cursor-default">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface mb-5">
                    {resolveImage(p.cover_image_url) && (
                      <img
                        src={resolveImage(p.cover_image_url)}
                        alt={p.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent" />
                    <div className="absolute top-5 left-5 text-xs uppercase tracking-[0.2em] text-gold">{p.category}</div>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-xl">{p.title}</h3>
                    <span className="text-xs text-muted-foreground">{p.year}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{p.location}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="container-prose py-24 md:py-32">
          <div className="grid md:grid-cols-3 gap-16">
            {[
              { icon: Award, t: "Architectural rigor", d: "We collaborate with leading architects from concept through closeout." },
              { icon: ShieldCheck, t: "Self-performed core trades", d: "Concrete, framing, and finish carpentry executed by salaried craftsmen — not subbed out." },
              { icon: Compass, t: "Locally rooted", d: "Headquartered on East 6th. We know Austin's permitting, geology, and supply chains." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t}>
                <Icon size={28} className="text-gold mb-5" />
                <h3 className="text-2xl mb-3">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container-prose pb-24 md:pb-32">
          <div className="relative rounded-sm overflow-hidden border border-border p-12 md:p-20" style={{ background: "var(--gradient-surface)" }}>
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20" style={{ background: "var(--gradient-gold)", filter: "blur(80px)" }} />
            <div className="relative max-w-2xl">
              <div className="eyebrow mb-4">Let's Build</div>
              <h2 className="font-display text-4xl md:text-5xl mb-6">Have a project in mind?</h2>
              <p className="text-muted-foreground mb-8">
                Tell us about your site, your timeline, and your aspirations. We'll respond within one business day.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-4 bg-gold text-gold-foreground rounded-sm text-sm font-medium hover:opacity-90">
                Request a Consultation <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
