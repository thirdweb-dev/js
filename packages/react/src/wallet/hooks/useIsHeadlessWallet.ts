import { useWallet } from "@thirdweb-dev/react-core";
import { walletIds } from "@thirdweb-dev/wallets";

/**
 *
 * @returns `true` if the wallet does not have a UI and can sign transactions without user interaction.
 */
export function useIsHeadlessWallet() {
  const activeWallet = useWallet();
  if (!activeWallet) {
    return false;
  }
  const id = activeWallet.walletId;
  return (
    id === walletIds.localWallet ||
    id === walletIds.paper ||
    id === walletIds.magicLink
  );
}
