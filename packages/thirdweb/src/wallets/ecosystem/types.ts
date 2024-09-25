import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
  InAppWalletCreationOptions,
} from "../in-app/core/wallet/types.js";

export type EcosystemWalletCreationOptions = InAppWalletCreationOptions & {
  partnerId?: string;
};

export type EcosystemWalletConnectionOptions = InAppWalletConnectionOptions;
export type EcosystemWalletAutoConnectOptions = InAppWalletAutoConnectOptions;
