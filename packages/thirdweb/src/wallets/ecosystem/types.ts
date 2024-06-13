import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
} from "../in-app/core/wallet/types.js";
import type { Ecosystem } from "../in-app/web/types.js";
import type { SmartWalletOptions } from "../smart/types.js";

export type EcosystemWalletCreationOptions = {
  partnerId?: string;
  smartAccount?: SmartWalletOptions;
};

export type EcosystemWalletConnectionOptions = InAppWalletConnectionOptions & {
  ecosystem: Ecosystem;
};
export type EcosystemWalletAutoConnectOptions =
  InAppWalletAutoConnectOptions & { ecosystem: Ecosystem };
