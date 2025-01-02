import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// This config is required for storybook HMR

const quotesIfString = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  }
  return `"${value}"`;
};

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.STORYBOOK_CLIENT_ID": quotesIfString(
      process.env.STORYBOOK_CLIENT_ID,
    ),
    "process.env.STORYBOOK_ACCOUNT_PRIVATE_KEY": quotesIfString(
      process.env.STORYBOOK_ACCOUNT_PRIVATE_KEY,
    ),
  },
});
