import tailwindConfig from "@workspace/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Config = {
  ...tailwindConfig,
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
    // add contents of ui package
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    ...tailwindConfig.theme,
    extend: {
      ...tailwindConfig.theme?.extend,
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      spacing: {
        "offset-top": "calc(var(--sticky-top-height) + 18px)",
        "offset-top-mobile": "calc(var(--sticky-top-height) + 100px)",
        "sidebar-height": "calc(100vh - var(--sticky-top-height))",
        "sticky-top-height": "var(--sticky-top-height)",
      },
      zIndex: {
        // base
        base: "0",
        //
        codeToken: "5",
        codeTokenHighlight: "1",
        //
        copyCodeButton: "20",
        dropdownMenu: "1200",
        floatingButton: "1000",
        menu: "1100",
        modal: "1400",
        modalOverlay: "1300",
        stickyMobileSidebar: "500",
        //
        stickyTop: "1000",
      },
    },
  },
};

export default config;
