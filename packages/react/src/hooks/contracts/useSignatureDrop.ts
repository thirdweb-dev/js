import { useBuiltinContract } from "./useBuiltinContract";
import { SignatureDrop } from "@thirdweb-dev/sdk";

/**
 * Hook for getting an instance of an `SignatureDrop` contract. This contract is meant to interface with ERC721 compliant NFTs that can be lazily minted.
 * @param contractAddress - the address of the NFT Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useSignatureDrop } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const signatureDrop = useSignatureDrop("<YOUR-CONTRACT-ADDRESS>")
 *
 *   // Now you can use the Signature drop contract in the rest of the component
 *
 *   // For example, this function will let the connected wallet claim a new NFT
 *   async function claim(quantity) {
 *     await signatureDrop.claim(quantity)
 *   }
 *
 *   ...
 * }
 * ```
 * @public
 */
export function useSignatureDrop(
  contractAddress?: string,
): SignatureDrop | undefined {
  return useBuiltinContract("signature-drop", contractAddress);
}
