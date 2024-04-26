import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensClaimed" event.
 */
export type TokensClaimedEventFilters = Partial<{
  claimer: AbiParameterToPrimitiveType<{
    name: "claimer";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    name: "receiver";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    name: "tokenId";
    type: "uint256";
    indexed: true;
    internalType: "uint256";
  }>;
}>;

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimer: ...,
 *  receiver: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(address indexed claimer, address indexed receiver, uint256 indexed tokenId, uint256 quantityClaimed)",
    filters,
  });
}
