/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },

    zIndex: {
      modal: 1400,
      modalOverlay: 1300,
      dropdownMenu: 1200,
      menu: 1100,
      //
      stickyTop: 1000,
      floatingButton: 1000,
      stickyMobileSidebar: 500,
      //
      copyCodeButton: 20,
      //
      codeToken: 5,
      codeTokenHighlight: 1,
      // base
      base: 0,
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
      full: "9999px",
    },
    fontFamily: {
      sans: ["var(--font-sans)", "sans-serif"],
      mono: ["var(--font-mono)", "monospace"],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        "active-border": "hsl(var(--active-border))",
        current: "currentColor",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        transparent: "transparent",
        overlay: "hsl(var(--overlay))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          // destructive-foreground should only be used on destructive bg
          foreground: "hsl(var(--destructive-foreground))",
          // destructive-text can be used on neutral bg - it's red-ish
          text: "hsl(var(--destructive-text))",
        },
        success: {
          // success-text can be used on neutral bg, it's green-ish
          text: "hsl(var(--success-text))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        inverted: {
          DEFAULT: "hsl(var(--inverted))",
          foreground: "hsl(var(--inverted-foreground))",
        },
        warning: {
          text: "hsl(var(--warning-text))",
        },
        link: {
          foreground: "hsl(var(--link-foreground))",
        },
      },
      spacing: {
        "sticky-top-height": "var(--sticky-top-height)",
        "sidebar-height": "calc(100vh - var(--sticky-top-height))",
        "offset-top": "calc(var(--sticky-top-height) + 18px)",
        "offset-top-mobile": "calc(var(--sticky-top-height) + 100px)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "animate-in-slow": "animate-in 0.4s ease",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
