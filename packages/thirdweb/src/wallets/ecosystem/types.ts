import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
} from "../in-app/core/wallet/types.js";
import type { Ecosystem } from "../in-app/web/types.js";

export type EcosystemWalletCreationOptions = {
  partnerId?: string;
};

export type EcosystemWalletConnectionOptions = InAppWalletConnectionOptions & {
  ecosystem: Ecosystem;
};
export type EcosystemWalletAutoConnectOptions =
  InAppWalletAutoConnectOptions & { ecosystem: Ecosystem };
