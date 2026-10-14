import { vitePlugin as remix } from "@remix-run/dev"
import tailwindcss from "@tailwindcss/vite"
import { vercelPreset } from "@vercel/remix/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  plugins: [
    tailwindcss(),
    // The Vercel preset splits the server build per runtime; only Vercel needs that, so `npm start` keeps build/server/index.js.
    remix({ presets: process.env.VERCEL ? [vercelPreset()] : [], ignoredRouteFiles: ["**/.*"] }),
    tsconfigPaths(),
  ],
  // argon2 is a native module used only by *.server files; the client dependency scan must not crawl it.
  optimizeDeps: { exclude: ["argon2"] },
})
