import tailwindConfig from "@workspace/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Config = {
  ...tailwindConfig,
  theme: {
    ...tailwindConfig.theme,
    extend: {
      ...tailwindConfig.theme?.extend,
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  content: [
    "./src/**/*.{ts,tsx}",
    // add contents of ui package
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
