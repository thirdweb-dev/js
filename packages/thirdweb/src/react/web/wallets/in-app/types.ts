import type { InAppWalletSocialAuth } from "../../../../wallets/in-app/core/wallet/index.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

export type InAppWalletSelectUIState =
  | undefined
  | {
      emailLogin?: string;
      socialLogin?: {
        type: InAppWalletSocialAuth;
        connectionPromise: Promise<Account>;
      };
    };
