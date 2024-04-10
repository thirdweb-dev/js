import type { Address } from "abitype";
import { isNativeTokenAddress } from "../../../../constants/addresses.js";
import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { padHex } from "../../../../utils/encoding/hex.js";
import { claim } from "../../__generated__/IDrop/write/claim.js";
import { getActiveClaimCondition } from "../read/getActiveClaimCondition.js";
/**
 * Represents the parameters for claiming an ERC721 token.
 */
export type ClaimToParams = {
  to: Address;
  quantity: bigint;
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
    asyncParams: async () => {
      const cc = await getActiveClaimCondition({
        contract: options.contract,
      });
      // TODO implement fetching merkle data
      if (cc.merkleRoot !== padHex("0x", { size: 32 })) {
        throw new Error("Allowlisted claims not implemented yet");
      }

      return {
        quantity: options.quantity,
        currency: cc.currency,
        receiver: options.to,
        allowlistProof: {
          currency: cc.currency,
          proof: [],
          quantityLimitPerWallet: cc.quantityLimitPerWallet,
          pricePerToken: cc.pricePerToken,
        },
        pricePerToken: cc.pricePerToken,
        data: "0x",

        // also set the value
        overrides: {
          value: isNativeTokenAddress(cc.currency)
            ? cc.pricePerToken * BigInt(options.quantity)
            : 0n,
        },
      };
    },
  });
}
