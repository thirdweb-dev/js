import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensStaked" event.
 */
export type TokensStakedEventFilters = Partial<{
  staker: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "staker";
    type: "address";
  }>;
  tokenIds: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256[]";
    name: "tokenIds";
    type: "uint256[]";
  }>;
}>;

/**
 * Creates an event object for the TokensStaked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensStakedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensStakedEvent({
 *  staker: ...,
 *  tokenIds: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensStakedEvent(filters: TokensStakedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensStaked(address indexed staker, uint256[] indexed tokenIds)",
    filters,
  });
}
