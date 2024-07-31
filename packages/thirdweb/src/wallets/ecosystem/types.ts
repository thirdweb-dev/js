import type { Prettify } from "../../utils/type-utils.js";
import type {
  InAppWalletAutoConnectOptions,
  InAppWalletConnectionOptions,
} from "../in-app/core/wallet/types.js";
import type { Ecosystem } from "../in-app/web/types.js";

export type EcosystemWalletCreationOptions = {
  partnerId?: string;
  auth?: {
    mode?: "popup" | "redirect";
  };
};

export type EcosystemWalletConnectionOptions = Prettify<
  InAppWalletConnectionOptions & {
    ecosystem: Ecosystem;
  }
>;
export type EcosystemWalletAutoConnectOptions = Prettify<
  InAppWalletAutoConnectOptions & { ecosystem: Ecosystem }
>;
