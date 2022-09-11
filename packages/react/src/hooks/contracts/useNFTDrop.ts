import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";
import type { NFTDrop } from "@thirdweb-dev/sdk";

/**
 * Hook for getting an instance of an `NFTDrop` contract. This contract is meant to interface with ERC721 compliant NFTs that can be lazily minted.
 * @param contractAddress - the address of the NFT Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useNFTDrop } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const nftDrop = await useNFTDrop("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the nft drop contract in the rest of the component
 *
 *   // For example, this function will let the connected wallet claim a new NFT
 *   async function claim(quantity) {
 *     await nftDrop.claim(quantity)
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @depreated use `useContract()` instead
 */
export function useNFTDrop(contractAddress?: string) {
  showDeprecationWarning("useNFTDrop()", "useContract<NFTDrop>()");
  return useContract<NFTDrop>(contractAddress).contract;
}
