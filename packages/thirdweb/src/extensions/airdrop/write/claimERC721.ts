import type { BaseTransactionOptions } from "../../../transaction/types.js";
import type { Address } from "../../../utils/address.js";
import { fetchProofsERC721 } from "../../../utils/extensions/airdrop/fetch-proofs-erc721.js";
import { tokenMerkleRoot } from "../__generated__/Airdrop/read/tokenMerkleRoot.js";
import { claimERC721 as generatedClaimERC721 } from "../__generated__/Airdrop/write/claimERC721.js";

export type ClaimERC721Params = {
  tokenAddress: string;
  recipient: string;
};

/**
 * Claim airdrop of ERC721 tokens for allowlisted addresses. (Pull based airdrop)
 * @param options - The transaction options.
 * @example
 * ```ts
 * import { claimERC721 } from "thirdweb/extensions/airdrop";
 *
 * const tokenAddress = "0x..." // Address of airdropped tokens to claim
 * const recipient = "0x..."  // Address of the allowlisted recipient
 *
 * const claimTransaction = claimERC721({
 *    contract,
 *    tokenAddress,
 *    recipient
 * });
 *
 * await sendTransaction({ claimTransaction, account });
 *
 * ```
 * @extension Airdrop
 * @returns A promise that resolves to the transaction result.
 */
export function claimERC721(
  options: BaseTransactionOptions<ClaimERC721Params>,
) {
  return generatedClaimERC721({
    contract: options.contract,
    asyncParams: async () => {
      const merkleRoot = await tokenMerkleRoot({
        contract: options.contract,
        tokenAddress: options.tokenAddress,
      });

      const tokenAddress = options.tokenAddress;

      const merkleProof = await fetchProofsERC721({
        contract: options.contract,
        recipient: options.recipient,
        merkleRoot,
      });

      if (!merkleProof) {
        throw new Error("Proof not found for recipient address");
      }

      return {
        token: tokenAddress as Address,
        receiver: merkleProof.recipient as Address,
        tokenId: merkleProof.tokenId,
        proofs: merkleProof.proof,
      } as const;
    },
  });
}
