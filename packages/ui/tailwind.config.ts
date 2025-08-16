import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    // Note: when importing this config in website project,
    // add a relative path to the ui package here
  ],
  darkMode: ["class"],
  plugins: [tailwindcssAnimate],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        // 16px
        DEFAULT: "1rem",
        // 24px
        lg: "1.5rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        skeleton: "skeleton 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "text-shimmer": "text-shimmer 1.25s linear infinite",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        "active-border": "hsl(var(--active-border))",
        background: "hsl(var(--background))",
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          // destructive-foreground should only be used on destructive bg
          foreground: "hsl(var(--destructive-foreground))",
          // destructive-text can be used on neutral bg - it's red-ish
          text: "hsl(var(--destructive-text))",
        },
        foreground: "hsl(var(--foreground))",
        input: "hsl(var(--input))",
        inverted: {
          DEFAULT: "hsl(var(--inverted))",
          foreground: "hsl(var(--inverted-foreground))",
        },
        link: {
          foreground: "hsl(var(--link-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        "nebula-pink": {
          foreground: "hsl(var(--nebula-pink-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        ring: "hsl(var(--ring))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        sidebar: {
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          ring: "hsl(var(--sidebar-ring))",
        },
        success: {
          // success-text can be used on neutral bg, it's green-ish
          text: "hsl(var(--success-text))",
        },
        warning: {
          text: "hsl(var(--warning-text))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "-100% 50%" },
        },
      },
    },
  },
};

export default config;
