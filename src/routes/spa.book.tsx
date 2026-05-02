import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { MessageCircle } from "lucide-react";
import { SpaLayout } from "@/components/spa/SpaLayout";
import { services, SPA, whatsappLink } from "@/lib/spa";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/spa/book")({
  component: SpaBook,
  head: () => ({
    meta: [
      { title: "Book an Appointment — Dalia Beauty Hub" },
      { name: "description", content: "Reserve your visit at Dalia Beauty Hub Nairobi. Quick online booking with WhatsApp confirmation." },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(5, "Valid phone required").max(30),
  email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  service: z.string().min(1, "Choose a service"),
  preferred_date: z.string().min(1, "Pick a date"),
  preferred_time: z.string().min(1, "Pick a time"),
  notes: z.string().max(1000).optional(),
});

function SpaBook() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    const data = parsed.data;
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      service: data.service,
      preferred_date: data.preferred_date,
      preferred_time: data.preferred_time,
      notes: data.notes || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not save your booking. Please try again.");
      return;
    }
    toast.success("Booking received! We'll confirm shortly.");
    setDone(true);

    const msg = `Hi ${SPA.name}! New booking:\n• Name: ${data.name}\n• Phone: ${data.phone}\n• Service: ${data.service}\n• Date: ${data.preferred_date} at ${data.preferred_time}${data.notes ? `\n• Notes: ${data.notes}` : ""}`;
    window.open(whatsappLink(msg), "_blank", "noopener,noreferrer");
  }

  return (
    <SpaLayout>
      <section className="container-prose py-16 md:py-24 max-w-2xl">
        <div className="eyebrow mb-3 text-rose-300">Reserve your visit</div>
        <h1 className="font-display text-4xl md:text-5xl mb-4">Book an appointment</h1>
        <p className="text-muted-foreground mb-10">Submit the form and we'll confirm your booking on WhatsApp within minutes.</p>

        {done ? (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-400/5 p-8 text-center">
            <h2 className="font-display text-2xl mb-2">Thank you ✨</h2>
            <p className="text-muted-foreground mb-5">Your booking is in. We've opened WhatsApp so you can send us a quick confirmation.</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] text-white px-5 py-2.5 text-sm">
              <MessageCircle size={16} /> Open WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name"><input name="name" required maxLength={100} className="input" /></Field>
              <Field label="Phone"><input name="phone" required maxLength={30} placeholder="07XX XXX XXX" className="input" /></Field>
            </div>
            <Field label="Email (optional)"><input name="email" type="email" maxLength={255} className="input" /></Field>
            <Field label="Service">
              <select name="service" required className="input">
                <option value="">Select a service…</option>
                {services.map((s) => <option key={s.slug} value={s.name}>{s.name} — {s.price}</option>)}
              </select>
            </Field>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Preferred date"><input name="preferred_date" type="date" required className="input" /></Field>
              <Field label="Preferred time"><input name="preferred_time" type="time" required className="input" /></Field>
            </div>
            <Field label="Notes (optional)"><textarea name="notes" maxLength={1000} rows={4} className="input resize-none" placeholder="Anything we should know?" /></Field>
            <button type="submit" disabled={submitting} className="w-full rounded-full bg-rose-400 text-white py-3 font-medium hover:bg-rose-500 disabled:opacity-50">
              {submitting ? "Booking…" : "Confirm booking"}
            </button>
            <style>{`.input{width:100%;background:hsl(var(--surface,var(--background)));border:1px solid hsl(var(--border));border-radius:0.75rem;padding:0.65rem 0.85rem;font-size:0.9rem;color:inherit;outline:none;transition:border-color .15s}.input:focus{border-color:rgb(251 113 133)}`}</style>
          </form>
        )}
      </section>
    </SpaLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</span>
      {children}
    </label>
  );
}
