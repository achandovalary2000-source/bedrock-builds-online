import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Jumbo Builders, Austin Texas" },
      { name: "description", content: "Jumbo Builders is a premium general contractor founded in Austin in 2008, specializing in architectural construction across Central Texas." },
      { property: "og:title", content: "About — Jumbo Builders" },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-prose pt-20 pb-16">
          <div className="eyebrow mb-5">Our Practice</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl leading-[0.95]">
            A builder shaped by the <em className="text-gradient-gold not-italic">architecture</em> it delivers.
          </h1>
        </section>

        <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
          <img src={heroImg} alt="Construction at dusk" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/40" />
        </section>

        <section className="container-prose py-24 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <div className="eyebrow mb-4">Founded 2008</div>
            <h2 className="font-display text-3xl md:text-4xl leading-tight">From a single residential remodel on East 11th to one of Central Texas' most respected builders.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Jumbo Builders was founded by Daniel Ortiz and Sarah Whitfield in a converted East Austin warehouse in 2008. What began as a two-person remodeling shop has grown into a 64-person general contractor with a yard, a millwork shop, and self-performed concrete, framing, and finish trades.
            </p>
            <p>
              We believe great buildings come from a tight feedback loop between architect, builder, and craftsman. We staff every project with a salaried superintendent and project manager who stay from day one through the final punch list — no rotation, no handoffs.
            </p>
            <p>
              Today our work spans hill country residences, downtown commercial towers, and the boutique hospitality projects redefining East Austin. Across all three, the standard is the same: drawings honored to the millimeter, materials specified to the source, schedules met without compromise.
            </p>
          </div>
        </section>

        <section className="border-t border-border/60 bg-surface/40">
          <div className="container-prose py-20 grid md:grid-cols-3 gap-12">
            {[
              { t: "Headquarters", d: "2400 East 6th Street\nAustin, Texas 78702" },
              { t: "Service Area", d: "Travis, Hays, Williamson,\nand Burnet Counties" },
              { t: "Credentials", d: "TX License #B-19847\nLEED AP · OSHA 30\nFully bonded & insured" },
            ].map((b) => (
              <div key={b.t}>
                <div className="eyebrow mb-3">{b.t}</div>
                <p className="text-foreground whitespace-pre-line">{b.d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
