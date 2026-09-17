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
      { title: "My profile — Tour & Travels" },
      {
        name: "description",
        content: "Update your name and mobile number used for tour bookings and trip updates.",
      },
      { property: "og:title", content: "My profile — Tour & Travels" },
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
      <section className="mx-auto max-w-310 px-5 py-20 text-center md:px-8">
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
  <section className="mx-auto w-full max-w-180 px-4 py-10 sm:px-5 md:px-8 md:py-12">
  <div className="label-mono text-primary">Account</div>

  <h1 className="mt-2 text-[30px] sm:text-[34px]">
    My profile
  </h1>

  {/* Logged-in user information */}
  <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
    <div className="label-mono text-primary">
      Logged in as
    </div>

    <div className="mt-3 min-w-0">
      <p className="mt-1 break-all text-sm text-foreground"> {user?.email || "No email available"} 
      </p>
    </div>
  </div>

  {/* Profile form */}
  <form
    className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-4 sm:mt-8 sm:p-6"
    onSubmit={(e) => {
      e.preventDefault();
      void save();
    }}
  >
    {/* Email */}
    <label className="block min-w-0">
      <span className="label-mono">
        Email
      </span>

      <input
        type="email"
        className="field mt-1.5 w-full text-foreground opacity-70"
        value={user?.email ?? ""}
        readOnly
      />
    </label>

    {/* Full name */}
    <label className="block min-w-0">
      <span className="label-mono">
        Full name
      </span>

      <input
        type="text"
        className="field mt-1.5 w-full text-foreground"
        value={form.full_name}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            full_name: e.target.value,
          }))
        }
        placeholder="Enter your full name"
      />
    </label>

    {/* Mobile number */}
    <label className="block min-w-0">
      <span className="label-mono">
        Mobile number
      </span>

      <input
        type="tel"
        className="field mt-1.5 w-full text-foreground"
        value={form.mobile}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            mobile: e.target.value,
          }))
        }
        placeholder="Enter your mobile number"
      />
    </label>

    {/* Save button */}
    <button
      type="submit"
      disabled={busy}
      className="w-full justify-self-start rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
    >
      {busy ? "Saving…" : "Save changes"}
    </button>
  </form>

  {/* Profile navigation */}
  <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
    <Link
      to="/bookings"
      className="chip w-full justify-center sm:w-auto"
    >
      My bookings
    </Link>

    <Link
      to="/saved"
      className="chip w-full justify-center sm:w-auto"
    >
      Saved packages
    </Link>

  </div>
</section>
  );
}
