import { useInstalledWallets } from "./useInstalledWallets";
import {
  useWallet,
  useSupportedChains,
  useNetworkMismatch,
} from "@thirdweb-dev/react-core";

export function useCanSwitchNetwork() {
  const activeWallet = useWallet();
  const supportedChains = useSupportedChains();
  const networkMismatch = useNetworkMismatch();

  const canNotSwitchNetwork =
    !activeWallet ||
    (supportedChains.length === 1 && !networkMismatch) ||
    activeWallet.walletId === "walletConnectV1" ||
    activeWallet.walletId === "walletConnectV2";

  return !canNotSwitchNetwork;
}

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
      (activeWallet.walletId === "coinbase" && !installedWallets.coinbase))
  );
}
