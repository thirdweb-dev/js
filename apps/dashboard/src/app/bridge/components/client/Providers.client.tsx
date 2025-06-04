"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import { PHProvider } from "../../../../lib/posthog/Posthog";
import { PostHogPageView } from "../../../../lib/posthog/PosthogPageView";

export function BridgeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        enableSystem={false}
        defaultTheme="dark"
      >
        <PHProvider disable_session_recording={true}>
          <PostHogPageView />
          {children}
          <Toaster richColors theme="dark" />
        </PHProvider>
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
