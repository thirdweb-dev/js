import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account } from "../../../interfaces/wallet.js";
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

export type InAppWalletAuth = "email" | InAppWalletSocialAuth;

/**
 * @internal
 */
export async function connectInAppWallet(
  options: InAppWalletConnectionOptions,
): Promise<[Account, Chain]> {
  const { authenticate } = await import("../authentication/index.js");

  const authResult = await authenticate(options);
  const authAccount = await authResult.user.wallet.getAccount();

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
  options: InAppWalletAutoConnectOptions,
): Promise<[Account, Chain]> {
  const { getAuthenticatedUser } = await import("../authentication/index.js");
  const user = await getAuthenticatedUser({ client: options.client });
  if (!user) {
    throw new Error("not authenticated");
  }

  const authAccount = await user.wallet.getAccount();

  return [authAccount, options.chain || ethereum] as const;
}
