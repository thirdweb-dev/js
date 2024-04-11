import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { padHex } from "../../../../utils/encoding/hex.js";
import { fetchProofsForClaimer } from "../../../../utils/extensions/drops/fetch-proofs-for-claimers.js";
import { claim } from "../../__generated__/IDrop1155/write/claim.js";
import { getActiveClaimCondition } from "../read/getActiveClaimCondition.js";

export type ClaimToParams = {
  to: Address;
  tokenId: bigint;
  quantity: bigint;
  from?: Address;
};

/**
 * Claim ERC721 NFTs to a specified address
 * @param options - The options for the transaction
 * @extension ERC721
 * @example
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc1155";
 * const tx = await claimTo({
 *   contract,
 *   to: "0x...",
 *   tokenId: 0n,
 *   quantity: 1n,
 * });
 * ```
 * @throws If no claim condition is set
 * @returns A promise that resolves with the submitted transaction hash.
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return claim({
    contract: options.contract,
    async asyncParams() {
      const cc = await getActiveClaimCondition({
        contract: options.contract,
        tokenId: options.tokenId,
      });
      let proofData = {
        currency: cc.currency,
        proof: [] as `0x${string}`[],
        quantityLimitPerWallet: cc.quantityLimitPerWallet,
        pricePerToken: cc.pricePerToken,
      };
      if (cc.merkleRoot !== padHex("0x", { size: 32 })) {
        const claimerProof = await fetchProofsForClaimer({
          contract: options.contract,
          claimer: options.from || options.to, // receiver and claimer can be different, always prioritize the claimer for allowlists
          merkleRoot: cc.merkleRoot,
        });

        if (claimerProof) {
          proofData = claimerProof;
        }
      }

      return {
        receiver: options.to,
        tokenId: options.tokenId,
        quantity: options.quantity,
        currency: cc.currency,
        pricePerToken: cc.pricePerToken,
        allowlistProof: proofData,
        data: "0x",
        overrides: {
          value: isNativeTokenAddress(cc.currency)
            ? cc.pricePerToken * BigInt(options.quantity)
            : 0n,
        },
      };
    },
  });
}
