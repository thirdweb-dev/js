import type { Preview } from "@storybook/react";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { Inter as interFont } from "next/font/google";
// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { useEffect } from "react";
import { Button } from "../src/@/components/ui/button";

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
        <ThemeProvider
          attribute="class"
          disableTransitionOnChange
          enableSystem={false}
          defaultTheme="dark"
        >
          <StoryLayout>
            <Story />
          </StoryLayout>
        </ThemeProvider>
      );
    },
  ],
};

export default preview;

function StoryLayout(props: {
  children: React.ReactNode;
}) {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    document.body.className = `font-sans antialiased ${fontSans.variable}`;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen min-w-0 flex-col bg-background text-foreground">
        <div className="flex justify-end gap-2 border-b p-4">
          <Button
            onClick={() => setTheme("dark")}
            size="sm"
            variant={theme === "dark" ? "default" : "outline"}
            className="h-auto w-auto rounded-full p-2"
          >
            <MoonIcon className="size-4" />
          </Button>

          <Button
            onClick={() => setTheme("light")}
            size="sm"
            variant={theme === "light" ? "default" : "outline"}
            className="h-auto w-auto rounded-full p-2"
          >
            <SunIcon className="size-4" />
          </Button>
        </div>

        <div className="flex min-w-0 grow flex-col">{props.children}</div>
      </div>
    </QueryClientProvider>
  );
}
