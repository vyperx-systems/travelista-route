import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Booking } from "@/lib/travel";
import { formatDate, inr, titleCase } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/bookings")({
  head: () => ({
    meta: [
      { title: "My bookings — Tour & Travels" },
      {
        name: "description",
        content:
          "Track your Tour & Travels tour bookings: reference number, travel date, travellers and status.",
      },
      { property: "og:title", content: "My bookings — Tour & Travels" },
      { property: "og:description", content: "Every booking and its live status in one view." },
    ],
  }),
  component: BookingsPage,
});

const statusTone: Record<string, string> = {
  pending: "bg-muted text-foreground",
  confirmed: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive text-destructive-foreground",
  completed: "bg-foreground text-cream",
};

function BookingsPage() {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_mobile: "",
    travel_date: "",
    special_requirements: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, changes }: { id: string; changes: Partial<Booking> }) => {
      const { error } = await supabase.from("bookings").update(changes).eq("id", id);
      if (error) throw error;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings", user?.id] });
    },
    onError: (error) => toast.error(error.message),
  });

  const openEditor = (booking: Booking) => {
    setForm({
      customer_name: booking.customer_name,
      customer_mobile: booking.customer_mobile,
      travel_date: booking.travel_date,
      special_requirements: booking.special_requirements ?? "",
    });
    setEditingBooking(booking);
  };

  const saveBooking = async () => {
    if (!editingBooking) return;
    if (!form.customer_name.trim() || !form.customer_mobile.trim() || !form.travel_date) {
      toast.error("Please complete your name, mobile number and travel date");
      return;
    }
    try {
      await updateBooking.mutateAsync({
        id: editingBooking.id,
        changes: {
          customer_name: form.customer_name.trim(),
          customer_mobile: form.customer_mobile.trim(),
          travel_date: form.travel_date,
          special_requirements: form.special_requirements.trim(),
        },
      });
      setEditingBooking(null);
      toast.success("Booking updated");
    } catch {
      // The mutation has already shown the database error.
    }
  };

  const cancelBooking = async () => {
    if (!cancellingBooking) return;
    try {
      await updateBooking.mutateAsync({
        id: cancellingBooking.id,
        changes: { status: "cancelled" },
      });
      setCancellingBooking(null);
      toast.success("Booking cancelled");
    } catch {
      // The mutation has already shown the database error.
    }
  };

  if (!loading && !user) {
    return (
      <section className="mx-auto max-w-310 px-5 py-20 text-center md:px-8">
        <h1 className="text-[30px]">Sign in to view your bookings</h1>
        <Link to="/auth" className="chip chip-on mt-6 inline-flex">
          Sign in
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-310 px-5 py-12 md:px-8">
      <div className="label-mono text-primary">Trip desk</div>
      <h1 className="mt-2 text-[34px]">My bookings</h1>

      {isLoading ? (
        <div className="mt-8 grid gap-3">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-32 rounded-3xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            No bookings yet.{" "}
            <Link to="/domestic" className="text-primary underline">
              Find a trip
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-3">
          {(data ?? []).map((b) => (
            <article key={b.id} className="rounded-3xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-[11px] text-muted-foreground">{b.reference}</div>
                  <h2 className="mt-1 text-[20px]">{b.package_name}</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">{b.destination}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${
                    statusTone[b.status] ?? "bg-muted"
                  }`}>
                  {titleCase(b.status ?? "Booked")}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 border-t border-border pt-4 text-[13px] sm:grid-cols-4">
                <div>
                  <dt className="label-mono">Travel date</dt>
                  <dd className="mt-1">{formatDate(b.travel_date)}</dd>
                </div>
                <div>
                  <dt className="label-mono">Travellers</dt>
                  <dd className="mt-1">{b.travelers}</dd>
                </div>
                <div>
                  <dt className="label-mono">Total</dt>
                  <dd className="mt-1 font-bold">{inr(b.total_amount_inr)}</dd>
                </div>
                <div>
                  <dt className="label-mono">Payment</dt>
                  <dd className="mt-1">{titleCase(b.payment_status ?? "To be paid")}</dd>
                </div>
              </dl>
              {b.special_requirements && (
                <p className="mt-3 text-[13px] text-muted-foreground">
                  Notes: {b.special_requirements}
                </p>
              )}
              {b.status === "pending" || b.status === "confirmed" ? (
                <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" onClick={() => openEditor(b)}>
                    Edit booking
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setCancellingBooking(b)}>
                    Cancel booking
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(editingBooking)} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit booking</DialogTitle>
            <DialogDescription>
              Update the traveller contact details, travel date, or trip notes for {editingBooking?.reference}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <label className="grid gap-1.5 text-sm">
              Traveller name
              <Input value={form.customer_name} onChange={(event) => setForm({ ...form, customer_name: event.target.value })} />
            </label>
            <label className="grid gap-1.5 text-sm">
              Mobile number
              <Input value={form.customer_mobile} onChange={(event) => setForm({ ...form, customer_mobile: event.target.value })} />
            </label>
            <label className="grid gap-1.5 text-sm">
              Travel date
              <Input type="date" value={form.travel_date} onChange={(event) => setForm({ ...form, travel_date: event.target.value })} />
            </label>
            <label className="grid gap-1.5 text-sm">
              Special requirements
              <Textarea value={form.special_requirements} onChange={(event) => setForm({ ...form, special_requirements: event.target.value })} />
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBooking(null)}>Close</Button>
            <Button onClick={saveBooking} disabled={updateBooking.isPending}>
              {updateBooking.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(cancellingBooking)} onOpenChange={(open) => !open && setCancellingBooking(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel {cancellingBooking?.reference}. Your booking will remain in your history, and our team will apply the package cancellation policy.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateBooking.isPending}>Keep booking</AlertDialogCancel>
            <AlertDialogAction onClick={cancelBooking} disabled={updateBooking.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {updateBooking.isPending ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
