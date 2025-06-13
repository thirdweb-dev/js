"use client";
import { Toaster } from "sonner";
import { ThirdwebProvider } from "thirdweb/react";

export function PayProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
      <Toaster richColors theme="dark" />
    </ThirdwebProvider>
  );
}
