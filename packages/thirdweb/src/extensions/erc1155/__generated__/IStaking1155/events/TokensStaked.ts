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
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the TokensStaked event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensStakedEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensStakedEvent({
 *  staker: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensStakedEvent(filters: TokensStakedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensStaked(address indexed staker, uint256 indexed tokenId, uint256 amount)",
    filters,
  });
}
