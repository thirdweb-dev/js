import { createContext } from "react";
import type { WalletConfig } from "../types/wallets.js";

export const ThirdwebProviderContext = /* @__PURE__ */ createContext<{
  wallets: WalletConfig[];
  autoConnect: boolean;
} | null>(null);
