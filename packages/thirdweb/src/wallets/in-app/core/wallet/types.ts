import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { SmartWalletOptions } from "../../../smart/types.js";
import type {
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../authentication/type.js";

export type InAppWalletConnectionOptions = (
  | MultiStepAuthArgsType
  | SingleStepAuthArgsType
) & {
  client: ThirdwebClient;
  chain?: Chain;
};

export type InAppWalletAutoConnectOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};

export type InAppWalletSocialAuth = "google" | "apple" | "facebook";

export type InAppWalletAuth =
  | "email"
  | "phone"
  | "passkey"
  | InAppWalletSocialAuth;

export type InAppWalletCreationOptions =
  | {
      auth?: {
        options: InAppWalletAuth[];
      };
      metadata?: {
        image?: {
          src: string;
          width?: number;
          height?: number;
          alt?: string;
        };
      };
      smartAccount?: SmartWalletOptions;
      hidePrivateKeyExport?: boolean;
    }
  | undefined;

export type AuthenticatedUser = {
  email: string | undefined;
  walletAddress: string;
};
