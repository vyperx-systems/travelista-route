import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-Ollb7OKR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAuth-D4alW62P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)({
	loading: true,
	session: null,
	user: null,
	isAdmin: false,
	fullName: ""
});
function AuthProvider({ children }) {
	const [state, setState] = (0, import_react.useState)({
		loading: true,
		session: null,
		user: null,
		isAdmin: false,
		fullName: ""
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		const load = async (session) => {
			if (!session?.user) {
				if (active) setState({
					loading: false,
					session: null,
					user: null,
					isAdmin: false,
					fullName: ""
				});
				return;
			}
			const [{ data: roles }, { data: profile }] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", session.user.id), supabase.from("profiles").select("full_name").eq("id", session.user.id).maybeSingle()]);
			if (!active) return;
			setState({
				loading: false,
				session,
				user: session.user,
				isAdmin: (roles ?? []).some((r) => r.role === "admin"),
				fullName: profile?.full_name || (session.user.email ?? "")
			});
		};
		const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
			if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") load(session);
		});
		supabase.auth.getSession().then(({ data }) => load(data.session));
		return () => {
			active = false;
			sub.subscription.unsubscribe();
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: state,
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
//#endregion
export { useAuth as n, AuthProvider as t };
