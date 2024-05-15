import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account } from "../../../interfaces/wallet.js";
import type {
  CreateWalletArgs,
  WalletAutoConnectionOption,
  WalletConnectionOption,
} from "../../../wallet-types.js";

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

  const authAccount = await user.wallet.getAccount();

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
