/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  darkMode: ["class"],
  plugins: [require("tailwindcss-animate")],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "animate-in-slow": "animate-in 0.4s ease",
        "text-shimmer": "text-shimmer 1.25s linear infinite",
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
        current: "currentColor",
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
        overlay: "hsl(var(--overlay))",
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
        success: {
          // success-text can be used on neutral bg, it's green-ish
          text: "hsl(var(--success-text))",
        },
        transparent: "transparent",
        warning: {
          text: "hsl(var(--warning-text))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0, opacity: 0 },
          to: { height: "var(--radix-accordion-content-height)", opacity: 1 },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: 1 },
          to: { height: 0, opacity: 0 },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "-100% 50%" },
        },
      },
      spacing: {
        "offset-top": "calc(var(--sticky-top-height) + 18px)",
        "offset-top-mobile": "calc(var(--sticky-top-height) + 100px)",
        "sidebar-height": "calc(100vh - var(--sticky-top-height))",
        "sticky-top-height": "var(--sticky-top-height)",
      },
    },
    fontFamily: {
      mono: ["var(--font-mono)", "monospace"],
      sans: ["var(--font-sans)", "sans-serif"],
    },

    zIndex: {
      // base
      base: 0,
      //
      codeToken: 5,
      codeTokenHighlight: 1,
      //
      copyCodeButton: 20,
      dropdownMenu: 1200,
      floatingButton: 1000,
      menu: 1100,
      modal: 1400,
      modalOverlay: 1300,
      stickyMobileSidebar: 500,
      //
      stickyTop: 1000,
    },
  },
};
