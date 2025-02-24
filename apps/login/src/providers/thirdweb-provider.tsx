"use client";
import { initDevMode } from "@/lib/dev-mode";
import { ThirdwebProvider } from "thirdweb/react";

initDevMode();

export function Provider({ children }: { children: React.ReactNode }) {
  return <ThirdwebProvider>{children}</ThirdwebProvider>;
}
