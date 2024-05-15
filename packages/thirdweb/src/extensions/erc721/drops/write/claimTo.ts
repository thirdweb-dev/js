import type { Address } from "abitype";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { claim } from "../../__generated__/IDrop/write/claim.js";
/**
 * Represents the parameters for claiming an ERC721 token.
 */
export type ClaimToParams = {
  to: Address;
  quantity: bigint;
  from?: Address;
};

/**
 * Claim ERC721 NFTs to a specified address
 * @param options - The options for the transaction
 * @extension ERC721
 * @example
 * ```ts
 * import { claimTo } from "thirdweb/extensions/erc721";
 * const tx = await claimTo({
 *   contract,
 *   to: "0x...",
 *   quantity: 1n,
 * });
 * ```
 * @throws If no claim condition is set
 * @returns A promise that resolves with the submitted transaction hash.
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return claim({
    contract: options.contract,
    asyncParams: () =>
      getClaimParams({
        type: "erc721",
        contract: options.contract,
        to: options.to,
        quantity: options.quantity,
        from: options.from,
      }),
  });
}
