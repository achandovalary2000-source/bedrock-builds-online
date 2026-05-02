import { createFileRoute, Link } from "@tanstack/react-router";
import { SpaLayout } from "@/components/spa/SpaLayout";
import { services } from "@/lib/spa";

export const Route = createFileRoute("/spa/services")({
  component: SpaServices,
  head: () => ({
    meta: [
      { title: "Services — Dalia Beauty Hub" },
      { name: "description", content: "Manicures, pedicures, nail art, braiding, facials, hot stone massage, lashes and more in Nairobi." },
      { property: "og:title", content: "Services — Dalia Beauty Hub" },
      { property: "og:description", content: "Full beauty and wellness menu at Dalia Beauty Hub Nairobi." },
    ],
  }),
});

function SpaServices() {
  const categories = Array.from(new Set(services.map((s) => s.category)));
  return (
    <SpaLayout>
      <section className="container-prose py-16 md:py-24">
        <div className="eyebrow mb-3 text-rose-300">Our full menu</div>
        <h1 className="font-display text-4xl md:text-6xl mb-4">Services & pricing</h1>
        <p className="text-muted-foreground max-w-2xl">Every treatment includes a warm welcome, complimentary tea and our signature attention to detail.</p>
      </section>

      {categories.map((cat) => (
        <section key={cat} className="container-prose pb-16">
          <h2 className="font-display text-2xl md:text-3xl mb-6 text-rose-300">{cat}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.filter((s) => s.category === cat).map((s) => (
              <article key={s.slug} className="flex gap-4 rounded-2xl border border-border/60 overflow-hidden bg-surface/30">
                <img src={s.image} alt={s.name} loading="lazy" className="w-32 h-32 object-cover flex-shrink-0" />
                <div className="py-3 pr-4 flex-1">
                  <div className="flex items-baseline justify-between gap-3 mb-1">
                    <h3 className="text-lg">{s.name}</h3>
                    <span className="text-rose-400 font-medium text-sm whitespace-nowrap">{s.price}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{s.duration}</div>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="container-prose pb-24 text-center">
        <Link to="/spa/book" className="inline-flex items-center gap-2 px-7 py-3 bg-rose-400 text-white rounded-full text-sm font-medium hover:bg-rose-500">
          Book any service
        </Link>
      </section>
    </SpaLayout>
  );
}
