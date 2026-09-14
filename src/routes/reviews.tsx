import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { fetchApprovedReviews, fetchPackages, reviewSchema } from "@/lib/travel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/format";
import { useReveal } from "@/hooks/useReveal";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Traveller reviews — Tour & Travels tours" },
      {
        name: "description",
        content:
          "Read verified traveller reviews of our domestic and international tour packages, and share your own trip story.",
      },
      { property: "og:title", content: "Traveller reviews — Tour & Travels" },
      {
        property: "og:description",
        content: "Honest reviews from travellers who booked our curated itineraries.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { user, fullName } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [packageId, setPackageId] = useState("");
  const [busy, setBusy] = useState(false);

  const { data: reviews } = useQuery({
    queryKey: ["reviews", "all"],
    queryFn: () => fetchApprovedReviews(),
  });
  const { data: packages } = useQuery({
    queryKey: ["packages", "all-for-review"],
    queryFn: () => fetchPackages(),
  });

  useReveal(reviews?.length);

  const submit = async () => {
    if (!user) {
      toast.info("Sign in to share your review");
      navigate({ to: "/auth" });
      return;
    }
    const parsed = reviewSchema.safeParse({ rating, body, package_id: packageId });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your review");
      return;
    }
    const pkg = (packages ?? []).find((p) => p.id === parsed.data.package_id);
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      package_id: parsed.data.package_id,
      package_name: pkg?.name ?? "",
      author_name: fullName || "Traveller",
      rating: parsed.data.rating,
      body: parsed.data.body,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setBody("");
    setPackageId("");
    setRating(5);
    queryClient.invalidateQueries({ queryKey: ["reviews"] });
    toast.success("Thanks! Your review is pending moderation.");
  };

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-5 pt-14 md:px-8">
        <div className="label-mono text-primary">Traveller stories</div>
        <h1 className="mt-3 max-w-[24ch] text-[40px] leading-[1.03]">Reviews from the road.</h1>
        <p className="mt-4 max-w-[54ch] text-[15px] text-muted-foreground">
          Every review is written by a signed-in traveller and published after our team checks it
          against a real booking.
        </p>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-6 px-5 py-10 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {(reviews ?? []).length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-sm text-muted-foreground">
              No approved reviews yet. Yours could be the first.
            </div>
          ) : (
            <div className="grid gap-4">
              {(reviews ?? []).map((r, i) => (
                <blockquote
                  key={r.id}
                  data-reveal
                  style={{ transitionDelay: `${i * 60}ms` }}
                  className="rounded-3xl border border-border bg-card p-6"
                >
                  <div className="flex gap-0.5 text-primary">
                    {Array.from({ length: r.rating }).map((_, s) => (
                      <Star key={s} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 text-[15px] text-muted-foreground">{r.body}</p>
                  <footer className="mt-4 font-mono text-[11px] text-muted-foreground">
                    {r.author_name || "Traveller"} · {r.package_name} · {formatDate(r.created_at)}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6">
            <h2 className="text-[22px]">Share your experience</h2>
            {!user && (
              <p className="mt-2 text-[13px] text-muted-foreground">
                <Link to="/auth" className="text-primary underline">
                  Sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="label-mono">Package</span>
                <select
                  className="field mt-1.5"
                  value={packageId}
                  onChange={(e) => setPackageId(e.target.value)}
                >
                  <option value="">Choose a package</option>
                  {(packages ?? []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>

              <div>
                <span className="label-mono">Rating</span>
                <div className="mt-2 flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star`}
                      onClick={() => setRating(n)}
                      className="text-primary"
                    >
                      <Star className={`size-5 ${n <= rating ? "fill-current" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="label-mono">Your review</span>
                <textarea
                  className="field mt-1.5 min-h-[120px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="What worked, what surprised you, what you would tell a friend…"
                />
              </label>

              <button
                onClick={() => void submit()}
                disabled={busy}
                className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                {busy ? "Sending…" : "Submit review"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
