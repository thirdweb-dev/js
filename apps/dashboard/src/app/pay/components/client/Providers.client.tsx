"use client";
import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/sonner";

export function PayProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
      <Toaster richColors />
    </ThirdwebProvider>
  );
}
