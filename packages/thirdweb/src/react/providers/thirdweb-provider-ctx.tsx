import { createContext } from "react";
import type { WalletConfig } from "../types/wallets.js";
import type { ThirdwebClient } from "../../client/client.js";
import type { DAppMetaData } from "../../wallets/types.js";

export const ThirdwebProviderContext = /* @__PURE__ */ createContext<{
  wallets: WalletConfig[];
  client: ThirdwebClient;
  dappMetadata?: DAppMetaData;
} | null>(null);
