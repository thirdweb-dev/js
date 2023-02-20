import invariant from "tiny-invariant";
import {
  useNetwork as useWagmiNetwork,
  useContext as useWagmiContext,
} from "wagmi";

/**
 * Hook for getting metadata about the network the current wallet is connected to and switching networks
 *
 * @example
 * ```javascript
 * import { useNetwork } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   const [, switchNetwork] = useNetwork();
 *
 * 
 *   return (
 *      // switchNetwork is undefined if the wallet does not support programmatic network switching
 *      // 137 is the chainId for Polygon in this example
 *     <button onClick={() => switchNetwork(137)}>
 *        Switch Network
 *     </button>
 *   );
 * };
```
 *
 * It's important to note that some wallet apps do not support programmatic network switching and switchNetwork will be undefined.
 * For those situations, you can typically switch networks in the wallet app this hook will still work.
 *
 * @public
 */

export function useNetwork() {
  const wagmiContext = useWagmiContext();
  invariant(
    wagmiContext,
    `useNetwork() can only be used inside <ThirdwebProvider />. If you are using <ThirdwebSDKProvider /> you will have to use your own network logic.`,
  );
  return useWagmiNetwork();
}
