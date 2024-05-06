import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import { smartWallet } from "../../../create-wallet.js";
import type { Account } from "../../../interfaces/wallet.js";
import { connectSmartWallet } from "../../../smart/index.js";
import type {
  CreateWalletArgs,
  WalletAutoConnectionOption,
  WalletConnectionOption,
} from "../../../wallet-types.js";
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

export type InAppWalletSocialAuth = "google" | "apple" | "facebook";

export type InAppWalletAuth = "email" | "phone" | InAppWalletSocialAuth;

/**
 * @internal
 */
export async function connectInAppWallet(
  options: WalletConnectionOption<"inApp">,
  createOptions: CreateWalletArgs<"inApp">[1],
): Promise<[Account, Chain]> {
  const { authenticate } = await import("../authentication/index.js");

  const authResult = await authenticate(options);
  const authAccount = await authResult.user.wallet.getAccount();

  if (createOptions?.sponsorGas) {
    if (!options.chain) {
      throw new Error("chain is required when sponsorGas is enabled");
    }
    // convert to smart account
    const createOptions = {
      chain: options.chain,
      sponsorGas: true,
    };
    const sa = smartWallet(createOptions);
    return connectSmartWallet(
      sa,
      {
        client: options.client,
        personalAccount: authAccount,
      },
      createOptions,
    );
  }

  return [authAccount, options.chain || ethereum] as const;
}

export type InAppWalletAutoConnectOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};

/**
 * @internal
 */
export async function autoConnectInAppWallet(
  options: WalletAutoConnectionOption<"inApp">,
  createOptions: CreateWalletArgs<"inApp">[1],
): Promise<[Account, Chain]> {
  const { getAuthenticatedUser } = await import("../authentication/index.js");
  const user = await getAuthenticatedUser({ client: options.client });
  if (!user) {
    throw new Error("not authenticated");
  }

  const authAccount = await user.wallet.getAccount();

  if (createOptions?.sponsorGas) {
    if (!options.chain) {
      throw new Error("chain is required when sponsorGas is enabled");
    }
    // convert to smart account
    const createOptions = {
      chain: options.chain,
      sponsorGas: true,
    };
    const sa = smartWallet(createOptions);
    return connectSmartWallet(
      sa,
      {
        client: options.client,
        personalAccount: authAccount,
      },
      createOptions,
    );
  }

  return [authAccount, options.chain || ethereum] as const;
}
