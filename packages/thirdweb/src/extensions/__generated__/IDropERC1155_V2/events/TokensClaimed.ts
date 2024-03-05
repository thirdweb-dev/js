import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensClaimed" event.
 */
export type TokensClaimedFilters = {
  claimConditionIndex: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "claimConditionIndex";
    type: "uint256";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  claimer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "claimer";
    type: "address";
  }>;
};

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IDROPERC1155_V2
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "thirdweb/extensions/IDropERC1155_V2";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimConditionIndex: ...,
 *  tokenId: ...,
 *  claimer: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(uint256 indexed claimConditionIndex, uint256 indexed tokenId, address indexed claimer, address receiver, uint256 quantityClaimed)",
    filters,
  });
}
