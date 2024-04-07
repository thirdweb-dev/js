import { createContext } from "react";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../wallets/types.js";
import type { ConnectLocale } from "../../web/ui/ConnectWallet/locale/types.js";
import type { LocaleId } from "../../web/ui/types.js";

export const WalletConnectionContext = /* @__PURE__ */ createContext<{
  wallets: Wallet[];
  client: ThirdwebClient;
  chain?: Chain;
  chains?: Chain[];
  appMetadata?: AppMetadata;
  locale: LocaleId;
  connectLocale: ConnectLocale;
  recommendedWallets?: Wallet[];
  walletConnect?: {
    projectId?: string;
  };
  accountAbstraction?: SmartWalletOptions;
  showAllWallets?: boolean;
} | null>(null);
