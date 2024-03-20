import { createContext } from "react";
import type { WalletConfig } from "../types/wallets.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { AppMetadata } from "../../../wallets/types.js";
import type { UILocale } from "../../web/ui/types.js";

export const WalletConnectionContext = /* @__PURE__ */ createContext<{
  wallets: WalletConfig[];
  client: ThirdwebClient;
  appMetadata: AppMetadata;
  locale: UILocale;
} | null>(null);
