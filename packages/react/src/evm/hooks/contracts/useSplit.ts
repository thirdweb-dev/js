import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

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
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const split = await sdk.useSplit("0x1234...");
 * + const split = await sdk.useContract("0x1234...", "split").contract;
 * ```
 */
export function useSplit(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useSplit("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "split")`,
  );
  return useContract(contractAddress, "split").contract;
}
