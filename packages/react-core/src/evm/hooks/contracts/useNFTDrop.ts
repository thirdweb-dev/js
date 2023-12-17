import { RequiredParam } from "../../../core/query-utils/required-param";
import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";

/**
 * Hook for getting an instance of an `NFTDrop` contract. This contract is meant to interface with ERC721 compliant NFTs that can be lazily minted.
 * @param contractAddress - the address of the NFT Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useContract } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const { contract } = useContract("<YOUR-CONTRACT-ADDRESS>", "nft-drop")
 *
 *   // Now you can use the nft drop contract in the rest of the component
 *
 *   // For example, this function will let the connected wallet claim a new NFT
 *   async function claim(quantity) {
 *     await contract.claim(quantity)
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @deprecated
 * This hook is deprecated and will be removed in a future major version. You should use {@link useContract} instead.
 * ```diff
 * - const nftDrop = useNFTDrop("0x1234...");
 * + const nftDrop = useContract("0x1234...", "nft-drop").contract;
 * ```
 * @internal
 */
export function useNFTDrop(contractAddress: RequiredParam<string>) {
  showDeprecationWarning(
    `useNFTDrop("${contractAddress || "0x..."}")`,
    `useContract("${contractAddress || "0x..."}", "nft-drop")`,
  );
  return useContract(contractAddress, "nft-drop").contract;
}
