import type { Preview } from "@storybook/react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Inter as interFont } from "next/font/google";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import React, { useEffect } from "react";
import { cn } from "../src/@/lib/utils";

// Note: Wrapping the Stoy with AppRouterProviders makes the storybook server time SUPER SLOW
// so let's just not have it there - all stories should be independent from context anyway and just rely on props

const queryClient = new QueryClient();

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
      useEffect(() => {
        document.body.className = cn(
          "font-sans antialiased",
          fontSans.variable,
        );
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
};

export default preview;
