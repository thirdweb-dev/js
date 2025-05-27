"use client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <ThemeProvider
        attribute="class"
        disableTransitionOnChange
        enableSystem={false}
        defaultTheme="dark"
      >
        {children}
        <Toaster richColors theme="dark" />
      </ThemeProvider>
    </ThirdwebProvider>
  );
}
