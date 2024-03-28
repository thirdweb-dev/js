import { useWalletConfig } from "@thirdweb-dev/react-core";

/**
 *
 * @returns `true` if the wallet does not have a UI and can sign transactions without user interaction.
 */
export function useIsHeadlessWallet() {
  const walletConfig = useWalletConfig();
  return !!walletConfig?.isHeadless;
}
