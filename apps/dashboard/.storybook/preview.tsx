import type { Preview } from "@storybook/react";
import "@/styles/globals.css";
import { Inter as interFont } from "next/font/google";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React from "react";
import { cn } from "../src/@/lib/utils";

// Note: Wrapping the Stoy with AppRouterProviders makes the storybook server time SUPER SLOW
// so let's just not have it there - all stories should be independent from context anyway and just rely on props

const fontSans = interFont({
  subsets: ["latin"],
  variable: "--font-sans",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    (Story) => {
      return (
        <div className={cn("font-sans antialiased", fontSans.variable)}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
