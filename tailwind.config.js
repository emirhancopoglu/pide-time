/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx,html,css}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  safelist: [
    {
      pattern:
        /(bg|text|border|shadow)-(red|blue|green|yellow|gray)-(100|200|300|400|500|600)/,
    },
    {
      pattern: /(p|m|h|w|gap|flex|grid)-(.*)/,
    },
    {
      pattern: /flex-(col|row|wrap|nowrap|1|auto)/,
    },
    {
      pattern: /items-(start|center|end|stretch)/,
    },
    {
      pattern: /justify-(start|center|between|end)/,
    },
  ],
  plugins: [],
};
