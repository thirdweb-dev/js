import { useNetwork as useWagmiNetwork } from "wagmi";

/**
 * Hook for getting metadata about the network the current wallet is connected to and switching networks
 *
 * @example
 * ```javascript
 * import { useNetwork, ChainId } from "@thirdweb-dev/react";
 *
 * const App = () => {
 *   const [, switchNetwork] = useNetwork();
 *
 *   return (
 *     <button onClick={() => switchNetwork(ChainId.Polygon)}>
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
  return useWagmiNetwork();
}
