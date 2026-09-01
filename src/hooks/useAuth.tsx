import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  fullName: string;
};

const AuthContext = createContext<AuthState>({
  loading: true,
  session: null,
  user: null,
  isAdmin: false,
  fullName: "",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    loading: true,
    session: null,
    user: null,
    isAdmin: false,
    fullName: "",
  });

  useEffect(() => {
    let active = true;

    const load = async (session: Session | null) => {
      if (!session?.user) {
        if (active) {
          setState({ loading: false, session: null, user: null, isAdmin: false, fullName: "" });
        }
        return;
      }
      const [{ data: roles }, { data: profile }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
        supabase.from("profiles").select("full_name").eq("id", session.user.id).maybeSingle(),
      ]);
      if (!active) return;
      setState({
        loading: false,
        session,
        user: session.user,
        isAdmin: (roles ?? []).some((r) => r.role === "admin"),
        fullName: profile?.full_name || (session.user.email ?? ""),
      });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load(session);
      }
    });

    void supabase.auth.getSession().then(({ data }) => load(data.session));

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
