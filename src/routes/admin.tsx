import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { inr, formatDate, titleCase } from "@/lib/format";
import type { Booking, Package, Review } from "@/lib/travel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Saffron Atlas" },
      {
        name: "description",
        content:
          "Role-protected admin portal to manage tour packages, bookings, reviews and travellers for Saffron Atlas.",
      },
      { property: "og:title", content: "Admin Portal — Saffron Atlas" },
      {
        property: "og:description",
        content: "Manage packages, booking statuses, review moderation and registered travellers.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "overview" | "packages" | "bookings" | "reviews" | "users";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "packages", label: "Packages" },
  { key: "bookings", label: "Bookings" },
  { key: "reviews", label: "Reviews" },
  { key: "users", label: "Travellers" },
];

function AdminPage() {
  const { loading, user, isAdmin, fullName } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  if (loading) {
    return <Shell>Checking your access…</Shell>;
  }

  if (!user) {
    return (
      <Shell>
        <p className="text-sm text-muted-foreground">You need to sign in to view the portal.</p>
        <Link to="/auth" className="mt-4 inline-flex chip chip-on">
          Sign in
        </Link>
      </Shell>
    );
  }

  if (!isAdmin) {
    return (
      <Shell>
        <h1 className="text-2xl">Restricted area</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This portal is limited to administrators. If you believe this is a mistake, contact the
          team.
        </p>
        <Link to="/" className="mt-4 inline-flex chip">
          Back to site
        </Link>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Saffron Atlas
            </p>
            <h1 className="text-lg font-semibold">Admin portal</h1>
          </div>
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-muted-foreground">{fullName}</span>
            <Link to="/" className="chip">
              View site
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-5 pb-3 md:px-8">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`chip whitespace-nowrap ${tab === t.key ? "chip-on" : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 py-8 md:px-8">
        {tab === "overview" && <Overview />}
        {tab === "packages" && <PackagesPanel />}
        {tab === "bookings" && <BookingsPanel />}
        {tab === "reviews" && <ReviewsPanel />}
        {tab === "users" && <UsersPanel />}
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[720px] px-5 py-24 text-center md:px-8">
      <div className="rounded-3xl border border-border bg-card p-10">{children}</div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [pkgs, bookings, reviews, profiles] = await Promise.all([
        supabase.from("packages").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase.from("bookings").select("total_amount_inr, status"),
        supabase.from("reviews").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      const rows = (bookings.data ?? []) as { total_amount_inr: number; status: string }[];
      return {
        packages: pkgs.count ?? 0,
        bookings: rows.length,
        pendingReviews: reviews.count ?? 0,
        travellers: profiles.count ?? 0,
        revenue: rows
          .filter((b) => b.status === "confirmed" || b.status === "completed")
          .reduce((sum, b) => sum + Number(b.total_amount_inr || 0), 0),
      };
    },
  });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card label="Active packages" value={String(data?.packages ?? "—")} />
      <Card label="Total bookings" value={String(data?.bookings ?? "—")} />
      <Card label="Confirmed revenue" value={data ? inr(data.revenue) : "—"} />
      <Card label="Reviews awaiting moderation" value={String(data?.pendingReviews ?? "—")} />
      <Card label="Registered travellers" value={String(data?.travellers ?? "—")} />
    </div>
  );
}

const EMPTY_FORM = {
  code: "",
  name: "",
  destination: "",
  country: "India",
  category: "domestic" as "domestic" | "international",
  summary: "",
  cover_image: "/images/hero.jpg",
  days: 5,
  nights: 4,
  price_inr: 25000,
  is_featured: false,
  status: "active" as "active" | "inactive" | "sold_out" | "draft",
};

function PackagesPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: packages = [] } = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Package[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editingId) {
        const { error } = await supabase.from("packages").update(form).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("packages").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Package updated" : "Package created");
      setEditingId(null);
      setForm({ ...EMPTY_FORM });
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void qc.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("packages")
        .update({ deleted_at: new Date().toISOString(), status: "inactive" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Package archived");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void qc.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
        className="grid gap-3 rounded-3xl border border-border bg-card p-5"
      >
        <h2 className="text-base font-semibold">
          {editingId ? "Edit package" : "Add a new package"}
        </h2>
        <input
          className={field}
          placeholder="Code (e.g. KSH-01)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <input
          className={field}
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className={field}
            placeholder="Destination"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            required
          />
          <input
            className={field}
            placeholder="Country"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          />
        </div>
        <textarea
          className={field}
          rows={3}
          placeholder="Summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <input
          className={field}
          placeholder="Cover image path"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-3">
          <input
            className={field}
            type="number"
            min={1}
            value={form.days}
            onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
          />
          <input
            className={field}
            type="number"
            min={0}
            value={form.nights}
            onChange={(e) => setForm({ ...form, nights: Number(e.target.value) })}
          />
          <input
            className={field}
            type="number"
            min={0}
            value={form.price_inr}
            onChange={(e) => setForm({ ...form, price_inr: Number(e.target.value) })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select
            className={field}
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as "domestic" | "international" })
            }
          >
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
          </select>
          <select
            className={field}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="sold_out">Sold out</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          Feature on the home page
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={save.isPending}
            className="rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-cream disabled:opacity-60"
          >
            {save.isPending ? "Saving…" : editingId ? "Save changes" : "Create package"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY_FORM });
              }}
              className="chip"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {packages.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {p.name} <span className="text-muted-foreground">· {p.code}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {p.destination}, {p.country} · {p.days}D/{p.nights}N · {inr(p.price_inr)} ·{" "}
                {titleCase(p.status)}
                {p.is_featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/packages/$id" params={{ id: p.id }} className="chip">
                View
              </Link>
              <button
                className="chip"
                onClick={() => {
                  setEditingId(p.id);
                  setForm({
                    code: p.code,
                    name: p.name,
                    destination: p.destination,
                    country: p.country,
                    category: p.category,
                    summary: p.summary,
                    cover_image: p.cover_image,
                    days: p.days,
                    nights: p.nights,
                    price_inr: p.price_inr,
                    is_featured: p.is_featured,
                    status: p.status,
                  });
                }}
              >
                Edit
              </button>
              <button className="chip" onClick={() => remove.mutate(p.id)}>
                Archive
              </button>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <p className="text-sm text-muted-foreground">No packages yet.</p>
        )}
      </div>
    </div>
  );
}

function BookingsPanel() {
  const qc = useQueryClient();
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin", "bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const update = useMutation({
    mutationFn: async (patch: {
      id: string;
      status?: Booking["status"];
      payment_status?: Booking["payment_status"];
    }) => {
      const { id, ...rest } = patch;
      const { error } = await supabase.from("bookings").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Booking updated");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void qc.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const field = "rounded-xl border border-border bg-background px-2 py-1.5 text-xs";

  return (
    <div className="grid gap-3">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {b.reference} <span className="text-muted-foreground">· {b.package_name}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {b.customer_name} · {b.customer_mobile} · {formatDate(b.travel_date)} ·{" "}
              {b.travelers} travellers · {inr(b.total_amount_inr)}
            </p>
          </div>
          <div className="flex gap-2">
            <select
              className={field}
              value={b.status}
              onChange={(e) =>
                update.mutate({ id: b.id, status: e.target.value as Booking["status"] })
              }
            >
              {["pending", "confirmed", "cancelled", "completed"].map((s) => (
                <option key={s} value={s}>
                  {titleCase(s)}
                </option>
              ))}
            </select>
            <select
              className={field}
              value={b.payment_status}
              onChange={(e) =>
                update.mutate({
                  id: b.id,
                  payment_status: e.target.value as Booking["payment_status"],
                })
              }
            >
              {["unpaid", "partial", "paid", "refunded"].map((s) => (
                <option key={s} value={s}>
                  {titleCase(s)}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
      {bookings.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet.</p>}
    </div>
  );
}

function ReviewsPanel() {
  const qc = useQueryClient();
  const { data: reviews = [] } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });

  const moderate = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Review["status"] }) => {
      const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Review moderated");
      void qc.invalidateQueries({ queryKey: ["admin"] });
      void qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="grid gap-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">
              {r.author_name} · {r.rating}/5{" "}
              <span className="text-muted-foreground">· {r.package_name}</span>
            </p>
            <div className="flex gap-2">
              <span className="chip">{titleCase(r.status)}</span>
              <button
                className="chip"
                onClick={() => moderate.mutate({ id: r.id, status: "approved" })}
              >
                Approve
              </button>
              <button
                className="chip"
                onClick={() => moderate.mutate({ id: r.id, status: "rejected" })}
              >
                Reject
              </button>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
        </div>
      ))}
      {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
    </div>
  );
}

function UsersPanel() {
  const { data: profiles = [] } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, mobile, is_active, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="px-4 py-3">{p.full_name || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.email || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{p.mobile || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
            </tr>
          ))}
          {profiles.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                No travellers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
