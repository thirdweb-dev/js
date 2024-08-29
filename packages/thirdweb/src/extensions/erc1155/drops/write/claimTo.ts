import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { claim } from "../../__generated__/IDrop1155/write/claim.js";

/**
 * @extension ERC1155
 */
export type ClaimToParams = {
  to: string;
  tokenId: bigint;
  quantity: bigint;
  from?: string;
};

/**
 * Claim ERC1155 NFTs to a specified address
 * @param options - The options for the transaction
 * @extension ERC1155
 * @example
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc1155";
 * import { sendTransaction } from "thirdweb";
 *
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   tokenId: 0n,
 *   quantity: 1n,
 * });
 *
 * await sendTransaction({ transaction, account });
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
