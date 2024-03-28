import type { Account } from "../../../interfaces/wallet.js";
import type {
  MultiStepAuthArgsType,
  SingleStepAuthArgsType,
} from "../authentication/type.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Chain } from "../../../../chains/types.js";
import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";

export type EmbeddedWalletConnectionOptions = (
  | MultiStepAuthArgsType
  | SingleStepAuthArgsType
) & {
  client: ThirdwebClient;
  chain?: Chain;
};

export type EmbeddedWalletSocialAuth = "google" | "apple" | "facebook";

export type EmbeddedWalletAuth = "email" | EmbeddedWalletSocialAuth;

/**
 * @internal
 */
export async function connectEmbeddedWallet(
  options: EmbeddedWalletConnectionOptions,
): Promise<[Account, Chain]> {
  const { authenticate } = await import("../authentication/index.js");

  const authResult = await authenticate(options);
  const authAccount = await authResult.user.wallet.getAccount();

  return [authAccount, options.chain || ethereum] as const;
}

export type EmbeddedWalletAutoConnectOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};

/**
 * @internal
 */
export async function autoConnectEmbeddedWallet(
  options: EmbeddedWalletAutoConnectOptions,
): Promise<[Account, Chain]> {
  const { getAuthenticatedUser } = await import("../authentication/index.js");
  const user = await getAuthenticatedUser({ client: options.client });
  if (!user) {
    throw new Error("not authenticated");
  }

  const authAccount = await user.wallet.getAccount();

  return [authAccount, options.chain || ethereum] as const;
}
