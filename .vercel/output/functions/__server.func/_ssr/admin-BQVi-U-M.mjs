import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-DQtMKDSl.mjs";
import { n as useAuth } from "./useAuth-DwHnDKK-.mjs";
import { n as inr, r as titleCase, t as formatDate } from "./format-CRihJgk0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BQVi-U-M.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		key: "overview",
		label: "Overview"
	},
	{
		key: "packages",
		label: "Packages"
	},
	{
		key: "bookings",
		label: "Bookings"
	},
	{
		key: "reviews",
		label: "Reviews"
	},
	{
		key: "users",
		label: "Travellers"
	}
];
function AdminPage() {
	const { loading, user, isAdmin, fullName } = useAuth();
	const [tab, setTab] = (0, import_react.useState)("overview");
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: "Checking your access…" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "You need to sign in to view the portal."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/auth",
		className: "mt-4 inline-flex chip chip-on",
		children: "Sign in"
	})] });
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl",
			children: "Restricted area"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "This portal is limited to administrators. If you believe this is a mistake, contact the team."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-4 inline-flex chip",
			children: "Back to site"
		})
	] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-310 flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
					children: "Tour & Travels"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: "Admin portal"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[13px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "chip",
						children: "View site"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-310 gap-2 overflow-x-auto px-5 pb-3 md:px-8",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setTab(t.key),
					className: `chip whitespace-nowrap ${tab === t.key ? "chip-on" : ""}`,
					children: t.label
				}, t.key))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-310 px-5 py-8 md:px-8",
			children: [
				tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {}),
				tab === "packages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackagesPanel, {}),
				tab === "bookings" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingsPanel, {}),
				tab === "reviews" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsPanel, {}),
				tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersPanel, {})
			]
		})]
	});
}
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-180 px-5 py-24 text-center md:px-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-3xl border border-border bg-card p-10",
			children
		})
	});
}
function Card({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-2xl font-semibold",
			children: value
		})]
	});
}
function Overview() {
	const { data } = useQuery({
		queryKey: ["admin", "overview"],
		queryFn: async () => {
			const [pkgs, bookings, reviews, profiles] = await Promise.all([
				supabase.from("packages").select("id", {
					count: "exact",
					head: true
				}).is("deleted_at", null),
				supabase.from("bookings").select("total_amount_inr, status"),
				supabase.from("reviews").select("id", {
					count: "exact",
					head: true
				}).eq("status", "pending"),
				supabase.from("profiles").select("id", {
					count: "exact",
					head: true
				})
			]);
			const rows = bookings.data ?? [];
			return {
				packages: pkgs.count ?? 0,
				bookings: rows.length,
				pendingReviews: reviews.count ?? 0,
				travellers: profiles.count ?? 0,
				revenue: rows.filter((b) => b.status === "confirmed" || b.status === "completed").reduce((sum, b) => sum + Number(b.total_amount_inr || 0), 0)
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				label: "Active packages",
				value: String(data?.packages ?? "—")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				label: "Total bookings",
				value: String(data?.bookings ?? "—")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				label: "Confirmed revenue",
				value: data ? inr(data.revenue) : "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				label: "Reviews awaiting moderation",
				value: String(data?.pendingReviews ?? "—")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				label: "Registered travellers",
				value: String(data?.travellers ?? "—")
			})
		]
	});
}
var EMPTY_FORM = {
	code: "",
	name: "",
	destination: "",
	country: "India",
	category: "domestic",
	summary: "",
	cover_image: "/images/hero.jpg",
	days: 5,
	nights: 4,
	price_inr: 25e3,
	is_featured: false,
	status: "active"
};
function PackagesPanel() {
	const qc = useQueryClient();
	const [form, setForm] = (0, import_react.useState)({ ...EMPTY_FORM });
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const { data: packages = [] } = useQuery({
		queryKey: ["admin", "packages"],
		queryFn: async () => {
			const { data, error } = await supabase.from("packages").select("*").is("deleted_at", null).order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
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
			qc.invalidateQueries({ queryKey: ["admin"] });
			qc.invalidateQueries({ queryKey: ["packages"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("packages").update({
				deleted_at: (/* @__PURE__ */ new Date()).toISOString(),
				status: "inactive"
			}).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Package archived");
			qc.invalidateQueries({ queryKey: ["admin"] });
			qc.invalidateQueries({ queryKey: ["packages"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const field = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[360px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				save.mutate();
			},
			className: "grid gap-3 rounded-3xl border border-border bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: editingId ? "Edit package" : "Add a new package"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					placeholder: "Code (e.g. KSH-01)",
					value: form.code,
					onChange: (e) => setForm({
						...form,
						code: e.target.value
					}),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					placeholder: "Name",
					value: form.name,
					onChange: (e) => setForm({
						...form,
						name: e.target.value
					}),
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Destination",
						value: form.destination,
						onChange: (e) => setForm({
							...form,
							destination: e.target.value
						}),
						required: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						className: field,
						placeholder: "Country",
						value: form.country,
						onChange: (e) => setForm({
							...form,
							country: e.target.value
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					className: field,
					rows: 3,
					placeholder: "Summary",
					value: form.summary,
					onChange: (e) => setForm({
						...form,
						summary: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: field,
					placeholder: "Cover image path",
					value: form.cover_image,
					onChange: (e) => setForm({
						...form,
						cover_image: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							type: "number",
							min: 1,
							value: form.days,
							onChange: (e) => setForm({
								...form,
								days: Number(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							type: "number",
							min: 0,
							value: form.nights,
							onChange: (e) => setForm({
								...form,
								nights: Number(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: field,
							type: "number",
							min: 0,
							value: form.price_inr,
							onChange: (e) => setForm({
								...form,
								price_inr: Number(e.target.value)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: field,
						value: form.category,
						onChange: (e) => setForm({
							...form,
							category: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "domestic",
							children: "Domestic"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "international",
							children: "International"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: field,
						value: form.status,
						onChange: (e) => setForm({
							...form,
							status: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "inactive",
								children: "Inactive"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sold_out",
								children: "Sold out"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "draft",
								children: "Draft"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: form.is_featured,
						onChange: (e) => setForm({
							...form,
							is_featured: e.target.checked
						})
					}), "Feature on the home page"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: save.isPending,
						className: "rounded-full bg-foreground px-4 py-2 text-[13px] font-medium text-cream disabled:opacity-60",
						children: save.isPending ? "Saving…" : editingId ? "Save changes" : "Create package"
					}), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setEditingId(null);
							setForm({ ...EMPTY_FORM });
						},
						className: "chip",
						children: "Cancel"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3",
			children: [packages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-medium",
						children: [
							p.name,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["· ", p.code]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							p.destination,
							", ",
							p.country,
							" · ",
							p.days,
							"D/",
							p.nights,
							"N · ",
							inr(p.price_inr),
							" ·",
							" ",
							titleCase(p.status),
							p.is_featured ? " · Featured" : ""
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/packages/$id",
							params: { id: p.id },
							className: "chip",
							children: "View"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							onClick: () => {
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
									status: p.status
								});
							},
							children: "Edit"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							onClick: () => remove.mutate(p.id),
							children: "Archive"
						})
					]
				})]
			}, p.id)), packages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No packages yet."
			})]
		})]
	});
}
function BookingsPanel() {
	const qc = useQueryClient();
	const { data: bookings = [] } = useQuery({
		queryKey: ["admin", "bookings"],
		queryFn: async () => {
			const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const update = useMutation({
		mutationFn: async (patch) => {
			const { id, ...rest } = patch;
			const { error } = await supabase.from("bookings").update(rest).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Booking updated");
			qc.invalidateQueries({ queryKey: ["admin"] });
			qc.invalidateQueries({ queryKey: ["bookings"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const field = "rounded-xl border border-border bg-background px-2 py-1.5 text-xs";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [bookings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						b.reference,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["· ", b.package_name]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						b.customer_name,
						" · ",
						b.customer_mobile,
						" · ",
						formatDate(b.travel_date),
						" ·",
						" ",
						b.travelers,
						" travellers · ",
						inr(b.total_amount_inr)
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: field,
					value: b.status,
					onChange: (e) => update.mutate({
						id: b.id,
						status: e.target.value
					}),
					children: [
						"pending",
						"confirmed",
						"cancelled",
						"completed"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: titleCase(s)
					}, s))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: field,
					value: b.payment_status,
					onChange: (e) => update.mutate({
						id: b.id,
						payment_status: e.target.value
					}),
					children: [
						"unpaid",
						"partial",
						"paid",
						"refunded"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: s,
						children: titleCase(s)
					}, s))
				})]
			})]
		}, b.id)), bookings.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No bookings yet."
		})]
	});
}
function ReviewsPanel() {
	const qc = useQueryClient();
	const { data: reviews = [] } = useQuery({
		queryKey: ["admin", "reviews"],
		queryFn: async () => {
			const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const moderate = useMutation({
		mutationFn: async ({ id, status }) => {
			const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Review moderated");
			qc.invalidateQueries({ queryKey: ["admin"] });
			qc.invalidateQueries({ queryKey: ["reviews"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3",
		children: [reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						r.author_name,
						" · ",
						r.rating,
						"/5",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["· ", r.package_name]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "chip",
							children: titleCase(r.status)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							onClick: () => moderate.mutate({
								id: r.id,
								status: "approved"
							}),
							children: "Approve"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "chip",
							onClick: () => moderate.mutate({
								id: r.id,
								status: "rejected"
							}),
							children: "Reject"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: r.body
			})]
		}, r.id)), reviews.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No reviews yet."
		})]
	});
}
function UsersPanel() {
	const { data: profiles = [] } = useQuery({
		queryKey: ["admin", "profiles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("id, full_name, email, mobile, is_active, created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-2xl border border-border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-[11px] uppercase tracking-[0.14em] text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Mobile"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Joined"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [profiles.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-t border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: p.full_name || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: p.email || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: p.mobile || "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: formatDate(p.created_at)
					})
				]
			}, p.id)), profiles.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-6 text-muted-foreground",
				colSpan: 4,
				children: "No travellers yet."
			}) })] })]
		})
	});
}
//#endregion
export { AdminPage as component };
