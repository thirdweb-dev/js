import { useSDKChainId } from "./useSDK";
import { useChainId } from "./wallet";

/**
 * Hook for checking whether the connected wallet is currently on the correct chain,
 * i.e. the chain specified in the `activeChain` on the `ThirdwebProvider`.
 *
 * @example
 *
 * ```jsx
 * import { useNetworkMismatch } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   const isMismatched = useNetworkMismatch();
 * };
 * ```
 *
 * Using this value, you can prompt users to switch their network using the `useSwitchChain` hook.
 *
 * @returns
 * Returns `true` if the `chainId` of the connected wallet is different from the `chainId` of the `activeChain` on the `ThirdwebProvider` component
 *
 * @networkConnection
 */
export function useNetworkMismatch() {
  const walletChainId = useChainId();
  const sdkChainId = useSDKChainId();

  if (!sdkChainId) {
    // we don't know yet
    return false;
  }

  if (sdkChainId === -1) {
    // means no network is set in the <ThirdwebProvider />, so we don't care about the network mismatch
    return false;
  }
  if (!walletChainId) {
    // means no wallet is connected yet, so we don't care about the network mismatch
    return false;
  }
  // check if the chainIds are different
  return sdkChainId !== walletChainId;
}
