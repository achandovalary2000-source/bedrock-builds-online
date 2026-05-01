import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Plus, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Meridian Builders" }] }),
});

type Material = { id: string; name: string; category: string; description: string | null; unit: string; price_per_unit: number | null; in_stock: boolean; sort_order: number };
type Project = { id: string; title: string; location: string | null; year: number | null; category: string | null; description: string | null; cover_image_url: string | null; featured: boolean; sort_order: number };
type Inquiry = { id: string; name: string; email: string; phone: string | null; project_type: string | null; message: string; status: string; created_at: string };

function AdminPage() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"materials" | "projects" | "inquiries">("materials");
  const [materials, setMaterials] = useState<Material[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  const refresh = async () => {
    const [m, p, i] = await Promise.all([
      supabase.from("materials").select("*").order("sort_order"),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    ]);
    setMaterials(m.data ?? []);
    setProjects(p.data ?? []);
    setInquiries(i.data ?? []);
  };

  useEffect(() => { if (user) refresh(); }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container-prose py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="eyebrow mb-2">Admin Console</div>
            <h1 className="font-display text-4xl">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email} {isAdmin && <span className="text-gold">· Admin</span>}</p>
          </div>
          <button onClick={() => signOut()} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <LogOut size={14} /> Sign out
          </button>
        </div>

        {!isAdmin && (
          <div className="border border-gold/40 bg-gold/5 p-6 rounded-sm mb-8">
            <p className="text-sm">Your account doesn't have admin privileges yet. An existing admin must grant access.</p>
            <p className="text-xs text-muted-foreground mt-3">First-time setup? Open the backend → user_roles table and insert a row with your user_id and role = 'admin'.</p>
            <Link to="/" className="text-xs text-gold mt-3 inline-block">← Back to site</Link>
          </div>
        )}

        {isAdmin && (
          <>
            <div className="flex gap-2 border-b border-border mb-8">
              {(["materials", "projects", "inquiries"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm uppercase tracking-[0.18em] border-b-2 transition-colors ${tab === t ? "border-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {t} {t === "inquiries" && inquiries.filter((i) => i.status === "new").length > 0 && <span className="ml-1 text-gold">({inquiries.filter((i) => i.status === "new").length})</span>}
                </button>
              ))}
            </div>

            {tab === "materials" && <MaterialsAdmin items={materials} refresh={refresh} />}
            {tab === "projects" && <ProjectsAdmin items={projects} refresh={refresh} />}
            {tab === "inquiries" && <InquiriesAdmin items={inquiries} refresh={refresh} />}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function MaterialsAdmin({ items, refresh }: { items: Material[]; refresh: () => void }) {
  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("materials").insert({
      name: String(fd.get("name")),
      category: String(fd.get("category")),
      description: String(fd.get("description") || "") || null,
      unit: String(fd.get("unit") || "unit"),
      price_per_unit: fd.get("price") ? Number(fd.get("price")) : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Material added");
    e.currentTarget.reset();
    refresh();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("materials").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={add} className="border border-border p-6 rounded-sm space-y-3 bg-surface/30 h-fit">
        <div className="eyebrow mb-2">Add Material</div>
        <input name="name" required placeholder="Name" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <input name="category" required placeholder="Category" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <textarea name="description" placeholder="Description" rows={3} className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input name="unit" placeholder="Unit" defaultValue="unit" className="bg-background border border-border rounded-sm px-3 py-2 text-sm" />
          <input name="price" type="number" step="0.01" placeholder="Price" className="bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="w-full py-2 bg-gold text-gold-foreground rounded-sm text-sm font-medium inline-flex items-center justify-center gap-2"><Plus size={14} /> Add</button>
      </form>
      <div className="lg:col-span-2 space-y-2">
        {items.map((m) => (
          <div key={m.id} className="border border-border p-4 flex items-center justify-between gap-4 bg-surface/20">
            <div>
              <div className="text-xs text-gold uppercase tracking-[0.2em]">{m.category}</div>
              <div className="font-display text-lg">{m.name}</div>
              <div className="text-xs text-muted-foreground">${m.price_per_unit ?? "—"} / {m.unit}</div>
            </div>
            <button onClick={() => del(m.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsAdmin({ items, refresh }: { items: Project[]; refresh: () => void }) {
  const add = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("projects").insert({
      title: String(fd.get("title")),
      location: String(fd.get("location") || "") || null,
      year: fd.get("year") ? Number(fd.get("year")) : null,
      category: String(fd.get("category") || "") || null,
      description: String(fd.get("description") || "") || null,
      cover_image_url: String(fd.get("cover") || "") || null,
      featured: fd.get("featured") === "on",
    });
    if (error) return toast.error(error.message);
    toast.success("Project added");
    e.currentTarget.reset();
    refresh();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={add} className="border border-border p-6 rounded-sm space-y-3 bg-surface/30 h-fit">
        <div className="eyebrow mb-2">Add Project</div>
        <input name="title" required placeholder="Title" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <input name="location" placeholder="Location" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-3">
          <input name="year" type="number" placeholder="Year" className="bg-background border border-border rounded-sm px-3 py-2 text-sm" />
          <input name="category" placeholder="Category" className="bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        </div>
        <textarea name="description" placeholder="Description" rows={3} className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <input name="cover" placeholder="Cover image URL" className="w-full bg-background border border-border rounded-sm px-3 py-2 text-sm" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" /> Featured</label>
        <button type="submit" className="w-full py-2 bg-gold text-gold-foreground rounded-sm text-sm font-medium inline-flex items-center justify-center gap-2"><Plus size={14} /> Add</button>
      </form>
      <div className="lg:col-span-2 space-y-2">
        {items.map((p) => (
          <div key={p.id} className="border border-border p-4 flex items-center justify-between gap-4 bg-surface/20">
            <div>
              <div className="text-xs text-gold uppercase tracking-[0.2em]">{p.category} · {p.year}</div>
              <div className="font-display text-lg">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.location} {p.featured && "· ★ Featured"}</div>
            </div>
            <button onClick={() => del(p.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function InquiriesAdmin({ items, refresh }: { items: Inquiry[]; refresh: () => void }) {
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };
  if (items.length === 0) return <p className="text-muted-foreground">No inquiries yet.</p>;
  return (
    <div className="space-y-3">
      {items.map((i) => (
        <div key={i.id} className="border border-border p-6 bg-surface/20">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="font-display text-xl">{i.name}</div>
              <div className="text-sm text-muted-foreground">{i.email} {i.phone && `· ${i.phone}`}</div>
              {i.project_type && <div className="text-xs text-gold uppercase tracking-[0.2em] mt-1">{i.project_type}</div>}
            </div>
            <div className="flex items-center gap-2">
              <select value={i.status} onChange={(e) => setStatus(i.id, e.target.value)} className="bg-background border border-border rounded-sm px-2 py-1 text-xs">
                <option value="new">new</option>
                <option value="contacted">contacted</option>
                <option value="closed">closed</option>
              </select>
              <button onClick={() => del(i.id)} className="text-muted-foreground hover:text-destructive p-2"><Trash2 size={14} /></button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{i.message}</p>
          <div className="text-xs text-muted-foreground mt-3">{new Date(i.created_at).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
