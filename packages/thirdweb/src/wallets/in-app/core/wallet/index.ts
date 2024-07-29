import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type SocialAuthOption,
  socialAuthOptions,
} from "../../../../wallets/types.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { EcosystemWalletId, WalletId } from "../../../wallet-types.js";
import type {
  CreateWalletArgs,
  WalletAutoConnectionOption,
  WalletConnectionOption,
} from "../../../wallet-types.js";
import { UserWalletStatus } from "../authentication/type.js";
import type { InAppConnector } from "../interfaces/connector.js";

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
  options:
    | WalletConnectionOption<"inApp">
    | WalletConnectionOption<EcosystemWalletId>,
  createOptions:
    | CreateWalletArgs<"inApp">[1]
    | CreateWalletArgs<EcosystemWalletId>[1],
  connector: InAppConnector,
): Promise<[Account, Chain]> {
  if (
    createOptions?.auth?.mode === "redirect" &&
    connector.authenticateWithRedirect
  ) {
    const strategy = options.strategy;
    if (socialAuthOptions.includes(strategy as SocialAuthOption)) {
      connector.authenticateWithRedirect(strategy as SocialAuthOption);
    }
  }
  // If we don't have authenticateWithRedirect then it's likely react native, so the default is to redirect and we can carry on
  // IF WE EVER ADD MORE CONNECTOR TYPES, this could cause redirect to be ignored despite being specified
  // TODO: In V6, make everything redirect auth

  const authResult = await connector.authenticate(options);
  const authAccount = authResult.user.account;

  if (
    createOptions &&
    "smartAccount" in createOptions &&
    createOptions?.smartAccount
  ) {
    return convertToSmartAccount({
      client: options.client,
      authAccount,
      smartAccountOptions: createOptions.smartAccount,
      chain: options.chain,
    });
  }

  return [authAccount, options.chain || ethereum] as const;
}

/**
 * @internal
 */
export async function autoConnectInAppWallet(
  options:
    | WalletAutoConnectionOption<"inApp">
    | WalletAutoConnectionOption<EcosystemWalletId>,
  createOptions:
    | CreateWalletArgs<"inApp">[1]
    | CreateWalletArgs<EcosystemWalletId>[1],
  connector: InAppConnector,
): Promise<[Account, Chain]> {
  if (options.authResult && connector.loginWithAuthToken) {
    await connector.loginWithAuthToken(options.authResult);
  }

  const user = await getAuthenticatedUser(connector);
  if (!user) {
    throw new Error("Failed to authenticate user.");
  }

  const authAccount = user.account;

  if (
    createOptions &&
    "smartAccount" in createOptions &&
    createOptions?.smartAccount
  ) {
    return convertToSmartAccount({
      client: options.client,
      authAccount,
      smartAccountOptions: createOptions.smartAccount,
      chain: options.chain,
    });
  }

  return [authAccount, options.chain || ethereum] as const;
}

async function convertToSmartAccount(options: {
  client: ThirdwebClient;
  authAccount: Account;
  smartAccountOptions: CreateWalletArgs<"smart">[1];
  chain?: Chain;
}) {
  const [{ smartWallet }, { connectSmartWallet }] = await Promise.all([
    import("../../../smart/smart-wallet.js"),
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

async function getAuthenticatedUser(connector: InAppConnector) {
  const user = await connector.getUser();
  switch (user.status) {
    case UserWalletStatus.LOGGED_IN_WALLET_INITIALIZED: {
      return user;
    }
  }
  return undefined;
}
