import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";
import { Split } from "@thirdweb-dev/sdk/dist/declarations/src/evm/contracts/prebuilt-implementations/split";

/**
 * Hook for getting an instance of a `Split` contract. This contract supports fund distribution to multiple parties.
 * @param contractAddress - the address of the Split contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useSplit } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const split = useSplit("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the split contract in the rest of the component
 *
 *   // For example, this function will retrun all the receipients of the split
 *   async function getRecipients() {
 *     const recipients = await split.getAllRecipients()
 *     return recipients
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated use `useContract()` instead
 */
export function useSplit(contractAddress?: string) {
  showDeprecationWarning("useSplit()", "useContract<Split>()");
  return useContract<Split>(contractAddress).contract;
}
