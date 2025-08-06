/** @type {import('tailwindcss').Config} */
export default{
  darkMode: ["class"],
  content: [    
    "./src/**/*.js",
    "./src/**/*.vue",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "#E67D10",
          light: "#FFA94D",
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          dark: "#2563EB",
          light: "#60A5FA",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          dark: "#059669",
          light: "#34D399",
          50: "var(--color-accent-50, #fff7ed)",
          100: "var(--color-accent-100, #ffedd5)",
          200: "var(--color-accent-200, #fed7aa)",
          300: "var(--color-accent-300, #fdba74)",
          400: "var(--color-accent-400, #fb923c)",
          500: "var(--color-accent-500, #f97316)",
          600: "var(--color-accent-600, #ea580c)",
          700: "var(--color-accent-700, #c2410c)",
          800: "var(--color-accent-800, #9a3412)",
          900: "var(--color-accent-900, #7c2d12)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      zIndex: {
        60: "60",
        70: "70",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "var(--tw-prose-body)",
            maxWidth: "65ch",
            a: {
              color: "var(--tw-prose-links)",
              textDecoration: "underline",
              fontWeight: "500",
            },
            strong: {
              color: "var(--tw-prose-bold)",
              fontWeight: "600",
            },
            h1: {
              color: "var(--tw-prose-headings)",
              fontWeight: "800",
            },
            h2: {
              color: "var(--tw-prose-headings)",
              fontWeight: "700",
            },
            h3: {
              color: "var(--tw-prose-headings)",
              fontWeight: "600",
            },
            h4: {
              color: "var(--tw-prose-headings)",
              fontWeight: "600",
            },
          },
        },
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
  ],
}
