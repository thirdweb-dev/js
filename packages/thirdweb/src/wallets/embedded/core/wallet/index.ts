import type { Account, Wallet } from "../../../interfaces/wallet.js";
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

/**
 * @internal
 */
export async function connectEmbeddedWallet(
  wallet: Wallet,
  options: EmbeddedWalletConnectionOptions,
): Promise<Account> {
  const { authenticate } = await import("../authentication/index.js");

  const authResult = await authenticate({
    ...options,
  });
  const authAccount = await authResult.user.wallet.getAccount();

  wallet._data.chain = options?.chain || ethereum;
  wallet._data.account = authAccount;

  return authAccount;
}

export type EmbeddedWalletAutoConnectOptions = {
  client: ThirdwebClient;
  chain?: Chain;
};

/**
 * @internal
 */
export async function autoConnectEmbeddedWallet(
  wallet: Wallet,
  options: EmbeddedWalletAutoConnectOptions,
): Promise<Account> {
  const { getAuthenticatedUser } = await import("../authentication/index.js");
  const user = await getAuthenticatedUser({ client: options.client });
  if (!user) {
    throw new Error("not authenticated");
  }

  const authAccount = await user.wallet.getAccount();

  wallet._data.chain = options?.chain || ethereum;
  wallet._data.account = authAccount;

  return authAccount;
}

/**
 * @internal
 */
export async function switchChainEmbeddedWallet(
  wallet: Wallet,
  chain: Chain,
): Promise<void> {
  wallet._data.chain = chain;
}

/**
 * @internal
 */
export async function disconnectEmbeddedWallet(wallet: Wallet): Promise<void> {
  wallet._data.account = undefined;
  wallet._data.chain = undefined;
}
