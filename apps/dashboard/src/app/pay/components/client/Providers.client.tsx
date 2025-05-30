"use client";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";
import { PHProvider } from "../../../../lib/posthog/Posthog";
import { PostHogPageView } from "../../../../lib/posthog/PosthogPageView";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <PHProvider>
        <PostHogPageView />
        {children}
        <Toaster richColors theme="dark" />
      </PHProvider>
    </ThirdwebProvider>
  );
}
