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
  claimer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "claimer";
    type: "address";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "receiver";
    type: "address";
  }>;
};

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IDROPERC721_V3
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "thirdweb/extensions/IDropERC721_V3";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimConditionIndex: ...,
 *  claimer: ...,
 *  receiver: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(uint256 indexed claimConditionIndex, address indexed claimer, address indexed receiver, uint256 startTokenId, uint256 quantityClaimed)",
    filters,
  });
}
