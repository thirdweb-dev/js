import tailwindConfig from "@workspace/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Config = {
  ...tailwindConfig,
  content: [
    "./src/**/*.{ts,tsx}",
    // add contents of ui package
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
