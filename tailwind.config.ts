import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Untitled UI Gray Scale
        gray: {
          25: "hsl(220, 14%, 96%)",
          50: "hsl(220, 9%, 89%)",
          100: "hsl(220, 8%, 80%)",
          200: "hsl(220, 5%, 70%)",
          300: "hsl(220, 4%, 58%)",
          400: "hsl(220, 3%, 46%)",
          500: "hsl(220, 1%, 36%)",
          600: "hsl(220, 1%, 26%)",
          700: "hsl(220, 2%, 20%)",
          800: "hsl(220, 3%, 16%)",
          900: "hsl(220, 6%, 10%)",
          950: "hsl(220, 13%, 5%)",
        },
        // Brand colors
        brand: {
          25: "hsl(220, 43%, 99%)",
          50: "hsl(220, 38%, 97%)",
          100: "hsl(220, 35%, 94%)",
          200: "hsl(220, 27%, 84%)",
          300: "hsl(220, 20%, 65%)",
          400: "hsl(220, 13%, 46%)",
          500: "hsl(220, 9%, 30%)",
          600: "hsl(220, 9%, 20%)",
          700: "hsl(220, 9%, 15%)",
          800: "hsl(220, 9%, 10%)",
          900: "hsl(220, 9%, 6%)",
          950: "hsl(220, 13%, 4%)",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;