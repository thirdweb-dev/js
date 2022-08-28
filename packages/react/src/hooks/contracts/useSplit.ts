import { useBuiltinContract } from "./useBuiltinContract";
import { Split } from "@thirdweb-dev/sdk";

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
 */
export function useSplit(contractAddress?: string): Split | undefined {
  return useBuiltinContract("split", contractAddress);
}
