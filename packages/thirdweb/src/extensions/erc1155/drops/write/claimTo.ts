import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { claim } from "../../__generated__/IDrop1155/write/claim.js";

export type ClaimToParams = {
  to: Address;
  tokenId: bigint;
  quantity: bigint;
  from?: Address;
};

/**
 * Claim ERC1155 NFTs to a specified address
 * @param options - The options for the transaction
 * @extension ERC1155
 * @example
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc1155";
 *
 * const tx = await claimTo({
 *   contract,
 *   to: "0x...",
 *   tokenId: 0n,
 *   quantity: 1n,
 * });
 * ```
 * @throws If no claim condition is set
 * @returns The prepared transaction
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return claim({
    contract: options.contract,
    async asyncParams() {
      const params = await getClaimParams({
        type: "erc1155",
        contract: options.contract,
        to: options.to,
        quantity: options.quantity,
        from: options.from,
        tokenId: options.tokenId,
      });

      return {
        ...params,
        tokenId: options.tokenId,
      };
    },
  });
}
