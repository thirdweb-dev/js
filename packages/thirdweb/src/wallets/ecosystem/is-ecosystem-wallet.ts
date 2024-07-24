import type { Wallet } from "../interfaces/wallet.js";
import type { EcosystemWalletId } from "../wallet-types.js";

export function isEcosystemWallet(
  wallet: Wallet,
): wallet is Wallet<EcosystemWalletId>;

export function isEcosystemWallet(wallet: string): wallet is EcosystemWalletId;

/**
 * Checks if the given wallet is an ecosystem wallet.
 *
 * @param {string} walletId - The wallet ID to check.
 * @returns {boolean} True if the wallet is an ecosystem wallet, false otherwise.
 * @internal
 */
export function isEcosystemWallet(
  wallet: Wallet | string,
): wallet is Wallet<EcosystemWalletId> {
  return typeof wallet === "string"
    ? wallet.startsWith("ecosystem.")
    : wallet.id.startsWith("ecosystem.");
}
