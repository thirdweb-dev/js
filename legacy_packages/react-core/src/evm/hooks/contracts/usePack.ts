import { RequiredParam } from "../../../core/query-utils/required-param";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of a `Pack` contract. This contract supports the creation of on-chain luck-based lootboxes.
 * @param contractAddress - The address of the Pack contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useContract } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const { contract } = usePack("<YOUR-CONTRACT-ADDRESS>", "pack")
 *
 *   // Now you can use the pack contract in the rest of the component
 *
 *   // For example, this function will get all the packs on this contract
 *   async function getPacks() {
 *     const packs = await contract.getAll()
 *     return packs
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const pack = usePack("0x1234...");
 * + const pack = useContract("0x1234...", "pack").contract;
 * ```
 *
 * @internal
 */
export function usePack(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `usePack("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "pack")`,
  );
  return useContract(contractAddress, "pack").contract;
}
