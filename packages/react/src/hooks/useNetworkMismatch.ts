import { useDesiredChainId } from "../Provider";
import { useChainId } from "./useChainId";

/**
 * Hook for checking whether the connected wallet is on the correct network specified by the `desiredChainId` passed to the `<ThirdwebProvider />`.
 *
 * ```javascript
 * import { useNetworkMistmatch } from "@thirdweb-dev/react"
 * ```
 *
 * @returns `true` if the chainId of the connected wallet is different from the desired chainId passed into <ThirdwebProvider />
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
 */
export function useNetworkMismatch() {
  const desiredChainId = useDesiredChainId();
  const activeChainId = useChainId();

  if (desiredChainId === -1) {
    // means no desiredChainId is set in the <ThirdwebProvider />, so we don't care about the network mismatch
    return false;
  }
  if (!activeChainId) {
    // means no wallet is connected yet, so we don't care about the network mismatch
    return false;
  }
  // check if the chainIds are different
  return desiredChainId !== activeChainId;
}
