import type { BaseTransactionOptions } from "../../../../transaction/types.js";
import { getClaimParams } from "../../../../utils/extensions/drops/get-claim-params.js";
import { isGetContractMetadataSupported } from "../../../common/read/getContractMetadata.js";
import * as GeneratedClaim from "../../__generated__/IDrop1155/write/claim.js";
import { isClaimConditionSupported } from "../../__generated__/IDropSinglePhase1155/read/claimCondition.js";
import { isGetActiveClaimConditionSupported } from "../read/getActiveClaimCondition.js";

/**
 * @extension ERC1155
 */
export type ClaimToParams = {
  to: string;
  tokenId: bigint;
  quantity: bigint;
  from?: string;
  singlePhaseDrop?: boolean;
};

/**
 * Claim ERC1155 NFTs to a specified address
 * This method is only available on the `DropERC1155` contract.
 * @param options - The options for the transaction
 * @extension ERC1155
 * @example
 * ### Basic usage
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
 *
 * ### For Drops with allowlists
 * You need to specify the claimer address as the `from` param to avoid any issue with the allowlist
 * ```ts
 * const transaction = claimTo({
 *   contract,
 *   to: "0x...",
 *   tokenId: 0n,
 *   quantity: 1n,
 *   from: "0x...", // address of the one claiming
 * });
 * ```
 * @throws If no claim condition is set
 * @returns The prepared transaction
 */
export function claimTo(options: BaseTransactionOptions<ClaimToParams>) {
  return GeneratedClaim.claim({
    async asyncParams() {
      const params = await getClaimParams({
        contract: options.contract,
        from: options.from,
        quantity: options.quantity,
        singlePhaseDrop: options.singlePhaseDrop,
        to: options.to,
        tokenId: options.tokenId,
        type: "erc1155",
      });

      return {
        ...params,
        tokenId: options.tokenId,
      };
    },
    contract: options.contract,
  });
}

/**
 * Checks if the `claimTo` method is supported by the given contract.
 * @param availableSelectors An array of 4byte function selectors of the contract. You can get this in various ways, such as using "whatsabi" or if you have the ABI of the contract available you can use it to generate the selectors.
 * @returns A boolean indicating if the `claimTo` method is supported.
 * @extension ERC1155
 * @example
 * ```ts
 * import { isClaimToSupported } from "thirdweb/extensions/erc1155";
 *
 * const supported = isClaimToSupported(["0x..."]);
 * ```
 */
export function isClaimToSupported(availableSelectors: string[]) {
  return [
    // has to support the claim method
    GeneratedClaim.isClaimSupported(availableSelectors),
    // requires contractMetadata for claimer proofs
    isGetContractMetadataSupported(availableSelectors),
    // required to check if the contract supports the getActiveClaimCondition method
    isGetActiveClaimConditionSupported(availableSelectors) ||
      isClaimConditionSupported(availableSelectors),
  ].every(Boolean);
}
