import { RequiredParam } from "../../../core/types/shared";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of an `Edition` contract. This contract is used to interface with ERC1155 compliant NFTs.
 * @param contractAddress - the address of the Edition contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useEdition } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const edition = useEdition("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the edition contract in the rest of the component
 *
 *   // For example, this function will return all the NFTs on this contract
 *   async function getNFTs() {
 *     const nfts = await edition.getAll()
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
 * - const edition = await sdk.useEdition("0x1234...");
 * + const edition = await sdk.useContract("0x1234...", "edition").contract;
 * ```
 */
export function useEdition(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useEdition("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "edition")`,
  );
  return useContract(contractAddress, "edition").contract;
}
