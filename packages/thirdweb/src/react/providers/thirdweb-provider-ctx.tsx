import { createContext } from "react";
import type { WalletConfig } from "../types/wallets.js";
import type { ThirdwebClient } from "../../client/client.js";

export const ThirdwebProviderContext = /* @__PURE__ */ createContext<{
  wallets: WalletConfig[];
  client: ThirdwebClient;
} | null>(null);
