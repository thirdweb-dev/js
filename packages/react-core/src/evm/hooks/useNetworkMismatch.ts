import { useSDKChainId } from "./useSDK";
import { useChainId } from "./wallet";

/**
 * Hook for checking whether the connected wallet is on the correct network specified by the `network` passed to the `<ThirdwebProvider />`.
 *
 * ```javascript
 * import { useNetworkMismatch } from "@thirdweb-dev/react"
 * ```
 *
 * @returns `true` if the chainId of the connected wallet is different from the chainId of the network passed into `<ThirdwebProvider />`
 *
 * @see {@link https://portal.thirdweb.com/react/react.usenetworkmismatch?utm_source=sdk | Documentation}
 *
 * @example
 * You can check if a users wallet is connected to the correct chain ID as follows:
 * ```javascript
 * import { useNetworkMismatch } from "@thirdweb-dev/react"
 *
 * const App = () => {
 *   const isMismatched = useNetworkMismatch()
 *
 *   return <div>{isMismatched}</div>
 * }
 * ```
 *
 * From here, you can prompt users to switch their network using the `useNetwork` hook.
 *
 * @public
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
