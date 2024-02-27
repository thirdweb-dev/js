import { RequiredParam } from "../../../core/query-utils/required-param";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 *
 * Hook for getting an instance of an `Edition` contract. This contract is used to interface with ERC1155 compliant NFTs.
 * @param contractAddress - The address of the Edition contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useContract } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const { contract } = useContract("<YOUR-CONTRACT-ADDRESS>", "edition")
 *
 *   // Now you can use the edition contract in the rest of the component
 *
 *   // For example, this function will return all the NFTs on this contract
 *   async function getNFTs() {
 *     const nfts = await contract.getAll()
 *     return nfts
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const edition = useEdition("0x1234...");
 * + const edition = useContract("0x1234...", "edition").contract;
 * ```
 * @internal
 */
export function useEdition(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useEdition("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "edition")`,
  );
  return useContract(contractAddress, "edition").contract;
}
