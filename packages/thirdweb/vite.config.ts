import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// This config is for storybook

export default defineConfig({
  plugins: [
    react({
      // Fixes HMR
      include: "**/*.tsx",
    }),
  ],
});
