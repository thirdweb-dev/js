import { useActiveWallet } from "./useActiveWallet.js";
import { useConnectedWallets } from "./useConnectedWallets.js";

/**
 * Get the admin wallet for the active wallet
 * Useful for smart wallets to get the underlying personal account
 * @returns The admin wallet for the active wallet, or the active wallet if it doesn't have an admin account
 * @walletConnection
 */
export function useAdminWallet() {
  const activeWallet = useActiveWallet();
  const connectedWallets = useConnectedWallets();
  const adminAccount = activeWallet?.getAdminAccount?.();
  if (!adminAccount) {
    // If the active wallet doesn't have an admin account, return the active wallet
    return activeWallet;
  }

  // If the active wallet has an admin account, find the admin wallet in connected wallets and return it
  return connectedWallets.find(
    (wallet) =>
      wallet.getAccount()?.address?.toLowerCase() ===
      adminAccount?.address?.toLowerCase(),
  );
}
