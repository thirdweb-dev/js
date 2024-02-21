import type { EmbeddedWallet } from "../../../wallets/embedded/core/wallet/index.js";
import type { Account } from "../../../wallets/interfaces/wallet.js";

export type EmbeddedWalletSocialAuth = "google" | "apple" | "facebook";

export type EmbeddedWalletAuth = "email" | EmbeddedWalletSocialAuth;

export type EmbeddedWalletSelectUIState =
  | undefined
  | {
      emailLogin?: string;
      // if a socialLogin is triggered, save the type and wallet instance that's in the process of being connected
      socialLogin?: {
        type: EmbeddedWalletSocialAuth;
        wallet: EmbeddedWallet;
        connectionPromise: Promise<Account>;
      };
    };
