"use client";

import { useWalletConnect } from "@/hooks/useWalletConnect";

export function AutoConnectWalletConnect({ uri }: { uri?: string }) {
  useWalletConnect({ uri });
  return null;
}
