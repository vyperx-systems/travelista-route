import { Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useSavedIds() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-ids", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("saved_packages").select("package_id");
      if (error) throw error;
      return (data ?? []).map((r) => r.package_id);
    },
  });
}

export function SaveButton({
  packageId,
  withLabel = false,
}: {
  packageId: string;
  withLabel?: boolean;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: savedIds } = useSavedIds();
  const saved = (savedIds ?? []).includes(packageId);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("auth");
      if (saved) {
        const { error } = await supabase
          .from("saved_packages")
          .delete()
          .eq("package_id", packageId)
          .eq("user_id", user.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase
        .from("saved_packages")
        .insert({ package_id: packageId, user_id: user.id });
      if (error) throw error;
      return "saved" as const;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["saved-ids"] });
      queryClient.invalidateQueries({ queryKey: ["saved-packages"] });
      toast.success(result === "saved" ? "Added to saved packages" : "Removed from saved packages");
    },
    onError: () => toast.error("Could not update your saved packages"),
  });

  const onClick = () => {
    if (!user) {
      toast.info("Sign in to save packages");
      navigate({ to: "/auth" });
      return;
    }
    mutation.mutate();
  };

  if (withLabel) {
    return (
      <button
        onClick={onClick}
        disabled={mutation.isPending}
        className="w-full rounded-xl border border-border py-3 text-sm font-medium transition-colors hover:bg-muted"
      >
        <span className="inline-flex items-center gap-2">
          <Heart className={`size-4 ${saved ? "fill-primary text-primary" : ""}`} />
          {saved ? "Saved" : "Save package"}
        </span>
      </button>
    );
  }

  return (
    <button
      aria-label={saved ? "Remove from saved" : "Save package"}
      onClick={onClick}
      disabled={mutation.isPending}
      className="grid size-9 place-items-center rounded-full border border-border bg-card/90 transition-colors hover:bg-card"
    >
      <Heart className={`size-4 ${saved ? "fill-primary text-primary" : "text-foreground"}`} />
    </button>
  );
}
