import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { Account } from "../../../interfaces/wallet.js";
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

  if (createOptions?.accountAbstraction) {
    return convertToSmartAccount({
      chain: options.chain || createOptions.accountAbstraction.chain,
      client: options.client,
      authAccount,
    });
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

  if (createOptions?.accountAbstraction) {
    return convertToSmartAccount({
      chain: options.chain || createOptions.accountAbstraction.chain,
      client: options.client,
      authAccount,
    });
  }

  return [authAccount, options.chain || ethereum] as const;
}

async function convertToSmartAccount(options: {
  chain: Chain;
  client: ThirdwebClient;
  authAccount: Account;
}) {
  const [{ smartWallet }, { connectSmartWallet }] = await Promise.all([
    import("../../../create-wallet.js"),
    import("../../../smart/index.js"),
  ]);

  const createOptions = {
    chain: options.chain,
    sponsorGas: true,
  };
  const sa = smartWallet(createOptions);
  return connectSmartWallet(
    sa,
    {
      client: options.client,
      personalAccount: options.authAccount,
    },
    createOptions,
  );
}
