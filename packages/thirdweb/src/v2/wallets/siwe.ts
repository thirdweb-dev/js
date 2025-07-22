import { defineChain } from "../../chains/utils.js";
import type { Prettify } from "../../utils/type-utils.js";
import type { Wallet } from "../../wallets/interfaces/wallet.js";
import type { BaseLoginOptions } from "./types.js";
import { createUserWallet } from "./user.js";

export type LoginWithWalletOptions = Prettify<
  BaseLoginOptions & {
    wallet: Wallet;
    chainId?: number;
  }
>;

/**
 * Login with wallet using SIWE
 * Authenticates users using Sign-In with Ethereum (SIWE) protocol with any connected wallet.
 * @param options - Options including the wallet instance and optional chain ID
 * @returns Promise that resolves to UserWallet instance
 * @example
 * ```typescript
 * import { Wallets } from "thirdweb/v2";
 *
 * const wallet = await Wallets.connectExternalWallet({
 *   client: thirdwebClient,
 *   walletId: "io.metamask",
 *   chainId: 1,
 * });
 *
 * const userWallet = await Wallets.loginWithWallet({
 *   client: thirdwebClient,
 *   wallet: wallet,
 * });
 * ```
 * @wallet
 */
export async function loginWithWallet(options: LoginWithWalletOptions) {
  const { siweAuthenticate } = await import(
    "../../wallets/in-app/core/authentication/siwe.js"
  );
  const authResult = await siweAuthenticate({
    client: options.client,
    wallet: options.wallet,
    chain: options.wallet.getChain() ?? defineChain(1),
    ecosystem: options.ecosystem,
  });
  return createUserWallet({
    client: options.client,
    ecosystem: options.ecosystem,
    authResult,
  });
}
