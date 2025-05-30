"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import { PHProvider } from "../../../../lib/posthog/Posthog";
import { PostHogPageView } from "../../../../lib/posthog/PosthogPageView";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        enableSystem={false}
        defaultTheme="dark"
      >
        <PHProvider>
          <PostHogPageView />
          {children}
          <Toaster richColors theme="dark" />
        </PHProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
