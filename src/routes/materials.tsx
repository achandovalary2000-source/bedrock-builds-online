import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/materials")({
  component: MaterialsPage,
  head: () => ({
    meta: [
      { title: "Construction Materials — Jumbo Builders" },
      { name: "description", content: "Premium construction materials available from Jumbo Builders' Austin yard: concrete, structural steel, lumber, glass, masonry, and insulation." },
      { property: "og:title", content: "Construction Materials — Jumbo Builders" },
    ],
  }),
});

type Material = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  unit: string;
  price_per_unit: number | null;
  in_stock: boolean;
};

function MaterialsPage() {
  const [items, setItems] = useState<Material[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    supabase
      .from("materials")
      .select("id,name,category,description,unit,price_per_unit,in_stock")
      .order("sort_order")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-prose pt-20 pb-16 border-b border-border/60">
          <div className="eyebrow mb-5">Material Supply</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[0.95]">
            Specified-grade materials from our <em className="text-gradient-gold not-italic">East Austin</em> yard.
          </h1>
          <p className="mt-8 text-muted-foreground max-w-2xl">
            We stock and supply the same materials we install — vetted suppliers, transparent pricing, delivery across Travis and Hays counties.
          </p>
        </section>

        <section className="container-prose py-12">
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.18em] border rounded-sm transition-colors ${
                  filter === c
                    ? "bg-gold text-gold-foreground border-gold"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {filtered.map((m) => (
              <div key={m.id} className="bg-background p-8 hover:bg-surface transition-colors">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold">{m.category}</span>
                  <span className={`text-[10px] uppercase tracking-[0.2em] ${m.in_stock ? "text-foreground/70" : "text-destructive"}`}>
                    {m.in_stock ? "In stock" : "On order"}
                  </span>
                </div>
                <h3 className="font-display text-2xl mb-3 leading-tight">{m.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[60px]">{m.description}</p>
                <div className="flex items-baseline justify-between border-t border-border pt-4">
                  <div>
                    {m.price_per_unit && (
                      <>
                        <span className="font-display text-2xl text-gradient-gold">${Number(m.price_per_unit).toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground ml-1">/ {m.unit}</span>
                      </>
                    )}
                  </div>
                  <a href="/contact" className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-gold">Quote →</a>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-20">No materials in this category yet.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
