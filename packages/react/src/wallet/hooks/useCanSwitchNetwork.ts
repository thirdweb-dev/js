import { useInstalledWallets } from "./useInstalledWallets";
import { useWallet } from "@thirdweb-dev/react-core";

/**
 *
 * @returns `true` if the wallet app is on a different device and user has connected via a QR code
 */
export function useIsNonLocalWallet() {
  const activeWallet = useWallet();
  const installedWallets = useInstalledWallets();

  return (
    activeWallet &&
    (activeWallet.walletId === "walletConnectV1" ||
      activeWallet.walletId === "walletConnectV2" ||
      (activeWallet.walletId === "metamask" && !installedWallets.metamask) ||
      (activeWallet.walletId === "coinbaseWallet" &&
        !installedWallets.coinbaseWallet))
  );
}
