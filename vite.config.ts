// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // This project deploys through Wrangler to Cloudflare Workers.
  // Keep the explicit target so deployment always receives Worker output.
  nitro: {
    preset: "cloudflare_module",
    // Some clients still request this conventional path even with an explicit SVG icon.
    // Keep it out of the SSR catch-all, which is not an asset handler.
    routeRules: { "/favicon.ico": { redirect: "/favicon.svg" } },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts.
    server: { entry: "server" },
  },
});
