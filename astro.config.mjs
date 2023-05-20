import node from "@astrojs/node";
import { defineConfig } from "astro/config";
// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import react from "@astrojs/react";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";
import config from "@/utils/config";

// https://astro.build/config
export default defineConfig({
  srcDir: "views",
  outDir: "./build/",
  output: "server",
  build: {
    client: "./build/client/",
    server: "./build/server/",
    serverEntry: "index.mjs",
    assets: 'assets'
  },
  adapter: node({
    mode: "middleware",
  }),
  vite: {
    ssr: {
      noExternal: ["path-to-regexp"],
    },
  },
  site: `http://${config.host}/trpc`,
  integrations: [
    tailwind(),
    react(),
    sitemap({
      customPages: [
        `http://${config.host}/trpc`,
        `http://${config.host}/trpc/p`,
        `http://${config.host}/trpc/about`,
      ],
    }),
  ],
});
