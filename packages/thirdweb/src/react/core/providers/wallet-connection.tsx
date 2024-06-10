"use client";
import { createContext } from "react";
import type { Chain } from "../../../chains/types.js";
import type { ThirdwebClient } from "../../../client/client.js";
import type { Wallet } from "../../../wallets/interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../wallets/smart/types.js";
import type { AppMetadata } from "../../../wallets/types.js";
import type { ConnectButton_connectModalOptions } from "../../web/ui/ConnectWallet/ConnectButtonProps.js";
import type { ConnectLocale } from "../../web/ui/ConnectWallet/locale/types.js";
import type { LocaleId } from "../../web/ui/types.js";
import type { SiweAuthOptions } from "../hooks/auth/useSiweAuth.js";

export const ConnectUIContext = /* @__PURE__ */ createContext<{
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
  onConnect?: (wallet: Wallet) => void;
  onDisconnect?: () => void;
  isEmbed: boolean;
  connectModal: Omit<ConnectButton_connectModalOptions, "size"> & {
    size: "compact" | "wide";
  };
  auth?: SiweAuthOptions;
} | null>(null);
