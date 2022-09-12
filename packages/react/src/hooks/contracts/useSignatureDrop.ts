import { showDeprecationWarning } from "../../utils/deprecation-warning";
import { useContract } from "../async/contracts";
import { SignatureDropImpl } from "@thirdweb-dev/sdk/dist/declarations/src/contracts/classes/signature-drop";

/**
 * Hook for getting an instance of an `SignatureDrop` contract. This contract is meant to interface with ERC721 compliant NFTs that can be lazily minted.
 * @param contractAddress - the address of the NFT Drop contract, found in your thirdweb dashboard
 *
 * @example
 * ```javascript
 * import { useSignatureDrop } from '@thirdweb-dev/react'
 *
 * export default function Component() {
 *   const signatureDrop = await useSignatureDrop("<YOUR-CONTRACT-ADDRESS>")
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
 * @depreated use `useContract()` instead
 */
export function useSignatureDrop(contractAddress?: string) {
  showDeprecationWarning("useSignatureDrop()", "useContract<SignatureDrop>()");
  return useContract<SignatureDropImpl>(contractAddress).contract;
}
