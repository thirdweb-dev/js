import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { WalletId } from "../../../wallet-types.js";
import type {
  CreateWalletArgs,
  WalletAutoConnectionOption,
  WalletConnectionOption,
} from "../../../wallet-types.js";

/**
 * Checks if the provided wallet is an in-app wallet.
 *
 * @param wallet - The wallet to check.
 * @returns True if the wallet is an in-app wallet, false otherwise.
 */
export function isInAppWallet(
  wallet: Wallet<WalletId>,
): wallet is Wallet<"inApp" | "embedded"> {
  return wallet.id === "inApp" || wallet.id === "embedded";
}

/**
 * @internal
 */
export async function connectInAppWallet(
  options: WalletConnectionOption<"inApp">,
  createOptions: CreateWalletArgs<"inApp">[1],
): Promise<[Account, Chain]> {
  const { authenticate } = await import("../authentication/index.js");

  const authResult = await authenticate(options);
  const authAccount = authResult.user.account;

  if (createOptions?.smartAccount) {
    return convertToSmartAccount({
      client: options.client,
      authAccount,
      smartAccountOptions: createOptions.smartAccount,
      chain: options.chain,
    });
  }

  return [
    authAccount,
    options.chain || createOptions?.smartAccount?.chain || ethereum,
  ] as const;
}

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

  const authAccount = user.account;

  if (createOptions?.smartAccount) {
    return convertToSmartAccount({
      client: options.client,
      authAccount,
      smartAccountOptions: createOptions.smartAccount,
      chain: options.chain,
    });
  }

  return [
    authAccount,
    options.chain || createOptions?.smartAccount?.chain || ethereum,
  ] as const;
}

async function convertToSmartAccount(options: {
  client: ThirdwebClient;
  authAccount: Account;
  smartAccountOptions: CreateWalletArgs<"smart">[1];
  chain?: Chain;
}) {
  const [{ smartWallet }, { connectSmartWallet }] = await Promise.all([
    import("../../../create-wallet.js"),
    import("../../../smart/index.js"),
  ]);

  const sa = smartWallet(options.smartAccountOptions);
  return connectSmartWallet(
    sa,
    {
      client: options.client,
      personalAccount: options.authAccount,
      chain: options.chain,
    },
    options.smartAccountOptions,
  );
}
