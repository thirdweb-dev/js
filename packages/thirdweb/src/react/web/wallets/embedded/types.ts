import type { EmbeddedWalletSocialAuth } from "../../../../wallets/embedded/core/wallet/index.js";
import type { Account } from "../../../../wallets/interfaces/wallet.js";

export type EmbeddedWalletSelectUIState =
  | undefined
  | {
      emailLogin?: string;
      socialLogin?: {
        type: EmbeddedWalletSocialAuth;
        connectionPromise: Promise<Account>;
      };
    };
