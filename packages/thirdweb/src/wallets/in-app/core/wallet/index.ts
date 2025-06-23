import { ethereum } from "../../../../chains/chain-definitions/ethereum.js";
import type { Chain } from "../../../../chains/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import {
  type SocialAuthOption,
  socialAuthOptions,
} from "../../../../wallets/types.js";
import type {
  EcosystemWalletConnectionOptions,
  EcosystemWalletCreationOptions,
} from "../../../ecosystem/types.js";
import type { Account, Wallet } from "../../../interfaces/wallet.js";
import type { SmartWalletOptions } from "../../../smart/types.js";
import type {
  CreateWalletArgs,
  EcosystemWalletId,
  WalletAutoConnectionOption,
  WalletId,
} from "../../../wallet-types.js";
import { create7702MinimalAccount } from "../eip7702/minimal-account.js";
import type { InAppConnector } from "../interfaces/connector.js";
import type {
  ExecutionModeOptions,
  InAppWalletConnectionOptions,
  InAppWalletCreationOptions,
} from "./types.js";

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
  options: InAppWalletConnectionOptions | EcosystemWalletConnectionOptions,
  createOptions: InAppWalletCreationOptions | EcosystemWalletCreationOptions,
  connector: InAppConnector,
): Promise<{ account: Account; chain: Chain; adminAccount?: Account }> {
  if (
    // if auth mode is not specified, the default is popup
    createOptions?.auth?.mode !== "popup" &&
    createOptions?.auth?.mode !== undefined &&
    connector.authenticateWithRedirect
  ) {
    const strategy = options.strategy;
    if (socialAuthOptions.includes(strategy as SocialAuthOption)) {
      await connector.authenticateWithRedirect(
        strategy as SocialAuthOption,
        createOptions?.auth?.mode,
        createOptions?.auth?.redirectUrl,
      );
    }
  }
  // If we don't have authenticateWithRedirect then it's likely react native, so the default is to redirect and we can carry on
  // IF WE EVER ADD MORE CONNECTOR TYPES, this could cause redirect to be ignored despite being specified
  // TODO: In V6, make everything redirect auth

  const authResult = await connector.connect(options);
  const authAccount = authResult.user.account;

  return createInAppAccount({
    authAccount,
    client: options.client,
    createOptions,
    desiredChain: options.chain,
  });
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
): Promise<{ account: Account; chain: Chain; adminAccount?: Account }> {
  if (options.authResult && connector.loginWithAuthToken) {
    await connector.loginWithAuthToken(options.authResult);
  }

  const user = await getAuthenticatedUser(connector);
  if (!user) {
    throw new Error("Failed to authenticate user.");
  }

  const authAccount = user.account;

  return createInAppAccount({
    authAccount,
    client: options.client,
    createOptions,
    desiredChain: options.chain,
  });
}

async function convertToSmartAccount(options: {
  client: ThirdwebClient;
  authAccount: Account;
  smartAccountOptions: CreateWalletArgs<"smart">[1];
  chain?: Chain;
}) {
  const { connectSmartAccount } = await import("../../../smart/index.js");

  return connectSmartAccount(
    {
      chain: options.chain,
      client: options.client,
      personalAccount: options.authAccount,
    },
    options.smartAccountOptions,
  );
}

async function getAuthenticatedUser(connector: InAppConnector) {
  const user = await connector.getUser();
  switch (user.status) {
    case "Logged In, Wallet Initialized": {
      return user;
    }
  }
  return undefined;
}

async function createInAppAccount(options: {
  client: ThirdwebClient;
  authAccount: Account;
  createOptions: InAppWalletCreationOptions | EcosystemWalletCreationOptions;
  desiredChain?: Chain;
}) {
  const { createOptions, authAccount, desiredChain, client } = options;
  let smartAccountOptions: SmartWalletOptions | undefined;
  let eip7702: Extract<ExecutionModeOptions, { mode: "EIP7702" }> | undefined;
  const executionMode =
    createOptions && "executionMode" in createOptions
      ? createOptions.executionMode
      : undefined;

  if (executionMode) {
    if (executionMode.mode === "EIP4337") {
      smartAccountOptions = executionMode.smartAccount;
    } else if (executionMode.mode === "EIP7702") {
      eip7702 = executionMode;
    }
  }

  // backwards compatibility
  if (
    createOptions &&
    "smartAccount" in createOptions &&
    createOptions?.smartAccount
  ) {
    smartAccountOptions = createOptions.smartAccount;
  }

  if (smartAccountOptions) {
    const [account, chain] = await convertToSmartAccount({
      authAccount,
      chain: desiredChain,
      client,
      smartAccountOptions,
    });
    return { account, adminAccount: authAccount, chain };
  }

  if (eip7702) {
    const chain = desiredChain;
    if (!chain) {
      throw new Error(
        "Chain is required for EIP-7702 execution, pass a chain when connecting the inAppWallet.",
      );
    }
    const account = create7702MinimalAccount({
      adminAccount: authAccount,
      client,
      sponsorGas: eip7702.sponsorGas,
    });
    return {
      account,
      adminAccount: authAccount,
      chain,
    };
  }

  return { account: authAccount, chain: desiredChain || ethereum } as const;
}
