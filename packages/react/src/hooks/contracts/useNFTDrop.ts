import { useBuiltinContract } from "./useBuiltinContract";
import { NFTDrop } from "@thirdweb-dev/sdk";

/**
 * Hook for getting an instance of an `NFTDrop` contract. This contract is meant to interface with ERC721 compliant NFTs that can be lazily minted.
 * @param contractAddress - the address of the NFT Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useNFTDrop } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const nftDrop = useNFTDrop("<YOUR-CONTRACT-ADDRESS>")
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
 */
export function useNFTDrop(contractAddress?: string): NFTDrop | undefined {
  return useBuiltinContract("nft-drop", contractAddress);
}
