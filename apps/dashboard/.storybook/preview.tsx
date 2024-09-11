import type { Preview } from "@storybook/react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoonIcon, SunIcon } from "lucide-react";
import { Inter as interFont } from "next/font/google";
// biome-ignore lint/style/useImportType: <explanation>
import React, { useState } from "react";
import { useEffect } from "react";
import { Button } from "../src/@/components/ui/button";

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
      return (
        <StoryLayout>
          <Story />
        </StoryLayout>
      );
    },
  ],
};

export default preview;

function StoryLayout(props: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.body.className = `font-sans antialiased ${fontSans.variable} ${theme === "dark" ? " dark" : ""}`;
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background text-foreground min-w-0">
        <div className="flex justify-end p-4 border-b gap-2">
          <Button
            onClick={() => setTheme("dark")}
            size="sm"
            variant={theme === "dark" ? "default" : "ghost"}
          >
            <MoonIcon className="size-5" />
          </Button>

          <Button
            onClick={() => setTheme("light")}
            size="sm"
            variant={theme === "light" ? "default" : "ghost"}
          >
            <SunIcon className="size-5" />
          </Button>
        </div>

        <div className="grow flex flex-col min-w-0">{props.children}</div>
      </div>
    </QueryClientProvider>
  );
}
