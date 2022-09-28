import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";
import { Pack } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/pack";

/**
 * Hook for getting an instance of a `Pack` contract. This contract supports the creation of on-chain luck-based lootboxes.
 * @param contractAddress - the address of the Pack contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { usePack } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const pack = usePack("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the pack contract in the rest of the component
 *
 *   // For example, this function will get all the packs on this contract
 *   async function getPacks() {
 *     const packs = await pack.getAll()
 *     return packs
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated use `useContract()` instead
 */
export function usePack(contractAddress?: string) {
  showDeprecationWarning("usePack()", "useContract<Pack>()");
  return useContract<Pack>(contractAddress).contract;
}
