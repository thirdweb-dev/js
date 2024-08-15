import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
} from "../in-app/core/wallet/types.js";

export type EcosystemWalletCreationOptions = {
  partnerId?: string;
  auth?: {
    mode?: "popup" | "redirect";
    redirectUrl?: string;
    redirectExternally?: boolean;
  };
};

export type EcosystemWalletConnectionOptions = InAppWalletConnectionOptions;
export type EcosystemWalletAutoConnectOptions = InAppWalletAutoConnectOptions;
