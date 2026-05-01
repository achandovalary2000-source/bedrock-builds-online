import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { resolveImage } from "@/lib/images";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects — Meridian Builders, Austin TX" },
      { name: "description", content: "A selection of residential, commercial, and hospitality projects delivered by Meridian Builders across Central Texas." },
      { property: "og:title", content: "Projects — Meridian Builders" },
    ],
  }),
});

type Project = {
  id: string;
  title: string;
  location: string | null;
  year: number | null;
  category: string | null;
  description: string | null;
  cover_image_url: string | null;
};

function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,location,year,category,description,cover_image_url")
      .order("sort_order")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-prose pt-20 pb-16 border-b border-border/60">
          <div className="eyebrow mb-5">Selected Work</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[0.95]">
            Seventeen years.<br />
            <em className="text-gradient-gold not-italic">One hundred eighty</em> projects.
          </h1>
        </section>
        <section className="container-prose py-16 space-y-24">
          {items.map((p, i) => (
            <article key={p.id} className={`grid md:grid-cols-12 gap-10 items-center ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className="md:col-span-7 aspect-[4/3] overflow-hidden bg-surface group">
                {resolveImage(p.cover_image_url) && (
                  <img
                    src={resolveImage(p.cover_image_url)}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{p.category}</span>
                  <span className="w-8 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">{p.year}</span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl leading-tight mb-3">{p.title}</h2>
                <p className="text-sm text-muted-foreground mb-5">{p.location}</p>
                <p className="text-muted-foreground leading-relaxed">{p.description}</p>
              </div>
            </article>
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-20">Projects coming soon.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
