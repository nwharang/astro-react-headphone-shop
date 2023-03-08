import node from "@astrojs/node";
import { defineConfig } from "astro/config";

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  srcDir: "views",
  outDir: "./build/",
  output: "server",
  build: {
    client: "./build/client/",
    server: "./build/server/",
    serverEntry: "index.mjs",
  },
  adapter: node({
    mode: "middleware",
  }),
  vite: {
    ssr: {
      noExternal: ["path-to-regexp"],
    },
  },
  site: "http://localhost:3000",
  integrations: [
    tailwind(),
    react(),
    sitemap({
      customPages: [
        "http://localhost:3000",
        "http://localhost:3000/p",
        "http://localhost:3000/about",
      ],
    }),
  ],
});
