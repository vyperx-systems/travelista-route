import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Profile } from "@/lib/travel";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Saffron Atlas" },
      {
        name: "description",
        content: "Update your name and mobile number used for tour bookings and trip updates.",
      },
      { property: "og:title", content: "My profile — Saffron Atlas" },
      { property: "og:description", content: "Keep your traveller details current." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ full_name: "", mobile: "" });
  const [busy, setBusy] = useState(false);

  const { data } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
  });

  useEffect(() => {
    if (data) setForm({ full_name: data.full_name ?? "", mobile: data.mobile ?? "" });
  }, [data]);

  if (!loading && !user) {
    return (
      <section className="mx-auto max-w-[1240px] px-5 py-20 text-center md:px-8">
        <h1 className="text-[30px]">Sign in to manage your profile</h1>
        <Link to="/auth" className="chip chip-on mt-6 inline-flex">
          Sign in
        </Link>
      </section>
    );
  }

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name.trim(), mobile: form.mobile.trim() })
      .eq("id", user.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Profile updated");
  };

  return (
    <section className="mx-auto max-w-[720px] px-5 py-12 md:px-8">
      <div className="label-mono text-primary">Account</div>
      <h1 className="mt-2 text-[34px]">My profile</h1>

      <form
        className="mt-8 grid gap-4 rounded-3xl border border-border bg-card p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <label className="block">
          <span className="label-mono">Email</span>
          <input className="field mt-1.5 opacity-70" value={data?.email ?? ""} readOnly />
        </label>
        <label className="block">
          <span className="label-mono">Full name</span>
          <input
            className="field mt-1.5"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
          />
        </label>
        <label className="block">
          <span className="label-mono">Mobile number</span>
          <input
            className="field mt-1.5"
            value={form.mobile}
            onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="justify-self-start rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/bookings" className="chip">
          My bookings
        </Link>
        <Link to="/saved" className="chip">
          Saved packages
        </Link>
        <Link to="/reviews" className="chip">
          Write a review
        </Link>
      </div>
    </section>
  );
}
