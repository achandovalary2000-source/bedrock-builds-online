import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact & Quote Request — Jumbo Builders" },
      { name: "description", content: "Request a construction quote or consultation. Jumbo Builders responds within one business day." },
      { property: "og:title", content: "Contact — Jumbo Builders" },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  project_type: z.string().max(50).optional(),
  message: z.string().trim().min(10, "Tell us a bit more (10+ chars)").max(2000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      project_type: String(fd.get("project_type") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      project_type: parsed.data.project_type || null,
      message: parsed.data.message,
    });
    setLoading(false);
    if (error) {
      toast.error("Could not send. Please try again.");
      return;
    }
    setDone(true);
    toast.success("Message sent. We'll be in touch within one business day.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container-prose pt-20 pb-16 border-b border-border/60">
          <div className="eyebrow mb-5">Begin a Project</div>
          <h1 className="font-display text-5xl md:text-7xl max-w-3xl leading-[0.95]">
            Let's <em className="text-gradient-gold not-italic">talk</em> about your build.
          </h1>
        </section>
        <section className="container-prose py-20 grid md:grid-cols-12 gap-16">
          <div className="md:col-span-4 space-y-10">
            <div>
              <div className="eyebrow mb-3">Office</div>
              <p>2400 East 6th Street<br />Austin, TX 78702</p>
            </div>
            <div>
              <div className="eyebrow mb-3">Direct</div>
              <p>(512) 555-0142<br /><a href="mailto:hello@jumbobuilders.co" className="text-gold hover:opacity-80">hello@jumbobuilders.co</a></p>
            </div>
            <div>
              <div className="eyebrow mb-3">Hours</div>
              <p className="text-muted-foreground">Mon–Fri · 7:30a–6p<br />Sat by appointment</p>
            </div>
          </div>
          <div className="md:col-span-8">
            {done ? (
              <div className="border border-border p-12 text-center bg-surface/40">
                <div className="eyebrow mb-3 text-gold">Received</div>
                <h2 className="font-display text-3xl mb-3">Thank you.</h2>
                <p className="text-muted-foreground">A member of our team will reach out within one business day.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Name" name="name" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Phone" name="phone" type="tel" />
                  <Field label="Project type" name="project_type" placeholder="Residential / Commercial / Hospitality" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Tell us about your project</label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    maxLength={2000}
                    className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gold text-gold-foreground rounded-sm text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {loading ? "Sending…" : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}{required && " *"}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
