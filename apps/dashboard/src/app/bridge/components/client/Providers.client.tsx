"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

export function BridgeProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        enableSystem={false}
      >
        {children}
        <Toaster richColors theme="dark" />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
