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
  const installedWallets = useInstalledWallets();

  const disableNetworkSwitching =
    !activeWallet ||
    (supportedChains.length === 1 && !networkMismatch) ||
    activeWallet.walletId === "walletConnectV1" ||
    activeWallet.walletId === "walletConnectV2" ||
    (activeWallet.walletId === "metamask" && !installedWallets.metamask);

  return !disableNetworkSwitching;
}
