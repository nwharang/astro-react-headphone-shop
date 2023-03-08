/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./views/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  mode: "jit",
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/images/hero-bg.webp')",
      },
      animation: {
        marquee: "marquee 5s linear infinite",
        marquee2: "marquee2 5s  linear infinite",
        slidein: "slidein 0.5s ease-out alternate",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        marquee2: {
          "0%": { transform: "translateX(98%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slidein: {
          "0%": {
            transform: "translateX(-20%)",
            opacity: 0,
          },
          "100%": { transform: "translateX(0%)", opacity: 1 },
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
