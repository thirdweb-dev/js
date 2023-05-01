import { useWallet } from "@thirdweb-dev/react-core";

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
  return id === "localWallet" || id === "PaperWallet" || id === "magicLink";
}
