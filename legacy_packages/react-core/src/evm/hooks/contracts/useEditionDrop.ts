import { RequiredParam } from "../../../core/query-utils/required-param";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of an `EditionDrop` contract. This contract is used to interface with ERC1155 compliant NFTs that can be lazily minted.
 * @param contractAddress - The address of the Edition Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useContract } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const { contract } = useContract("<YOUR-CONTRACT-ADDRESS>", "edition-drop")
 *
 *   // Now you can use the edition drop contract in the rest of the component
 *
 *   // For example, this function will let the connected wallet claim a new NFT
 *   async function claim(tokenId, quantity) {
 *     await contract.claim(tokenId, quantity)
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const editionDrop = useEditionDrop("0x1234...");
 * + const editionDrop = useContract("0x1234...", "edition-drop").contract;
 * ```
 * @internal
 */
export function useEditionDrop(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useEditionDrop("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "edition-drop")`,
  );
  return useContract(contractAddress, "edition-drop").contract;
}
