import { useBuiltinContract } from "./useBuiltinContract";

/**
 * Hook for getting an instance of an `NFTCollection` contract. This contract is meant to interface with ERC721 compliant NFTs.
 * @param contractAddress - the address of the NFT Collection contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useNFTCollection } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const nftCollection = useNFTCollection("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the nftCollection contract in the rest of the component
 *
 *   // For example, this function will return all the NFTs on this contract
 *   async function getNFTs() {
 *     const nfts = await nftCollection.getAll()
 *     return nfts
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 * @depreated use `useContract()` instead
 */
export function useNFTCollection(contractAddress?: string) {
  return useBuiltinContract("nft-collection", contractAddress);
}
