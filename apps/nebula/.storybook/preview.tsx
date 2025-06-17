import type { Preview } from "@storybook/nextjs";
import "../src/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MoonIcon, SunIcon } from "lucide-react";
import { ThemeProvider, useTheme } from "next-themes";
import { Inter as interFont } from "next/font/google";
// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { Button } from "../src/@/components/ui/button";

const queryClient = new QueryClient();

const fontSans = interFont({
  subsets: ["latin"],
  variable: "--font-sans",
});

const customViewports = {
  xs: {
    // Regular sized phones (iphone 15 / 15 pro)
    name: "iPhone",
    styles: {
      width: "390px",
      height: "844px",
    },
  },
  sm: {
    // Larger phones (iphone 15 plus / 15 pro max)
    name: "iPhone Plus",
    styles: {
      width: "430px",
      height: "932px",
    },
  },
};

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: customViewports,
    },
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
      <div className="flex min-h-dvh min-w-0 flex-col bg-background text-foreground">
        <div className="fixed right-0 bottom-0 z-50 flex justify-end gap-2 p-4">
          <Button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            size="sm"
            variant="outline"
            className="h-auto w-auto shrink-0 rounded-full p-2"
          >
            {theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
          </Button>
        </div>

        <div className="flex min-w-0 grow flex-col">{props.children}</div>
        <ToasterSetup />
      </div>
    </QueryClientProvider>
  );
}

function ToasterSetup() {
  const { theme } = useTheme();
  return <Toaster richColors theme={theme === "light" ? "light" : "dark"} />;
}
