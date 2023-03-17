import { useInstalledWallets } from "./useInstalledWallets";
import { useWallet } from "@thirdweb-dev/react-core";

/**
 *
 * @returns `true` if the the a confirmation is required to switch networks in the active wallet
 */
export function useWalletRequiresConfirmation() {
  const activeWallet = useWallet();
  const installedWallets = useInstalledWallets();

  return (
    activeWallet &&
    (activeWallet.walletId === "walletConnectV1" ||
      activeWallet.walletId === "walletConnectV2" ||
      (activeWallet.walletId === "metamask" && !installedWallets.metamask) ||
      (activeWallet.walletId === "coinbaseWallet" &&
        !installedWallets.coinbase))
  );
}
