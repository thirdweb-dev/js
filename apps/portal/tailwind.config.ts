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
        current: "currentColor",
        border: "var(--border)",
        input: "var(--b-700)",
        ring: "var(--b-700)",
        transparent: "transparent",
        overlay: "var(--overlay)",
        // backgrounds
        b: {
          900: "var(--b-900)",
          800: "var(--b-800)",
          700: "var(--b-700)",
          600: "var(--b-600)",
        },
        // foregrounds
        f: {
          100: "var(--f-100)",
          200: "var(--f-200)",
          300: "var(--f-300)",
        },
        "code-bg": "var(--code-bg)",
        accent: {
          500: "var(--accent-500)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
        },
        danger: {
          500: "var(--danger-500)",
          800: "var(--danger-800)",
          900: "var(--danger-900)",
        },
        warning: {
          500: "var(--warning-500)",
          900: "var(--warning-900)",
          800: "var(--warning-800)",
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
