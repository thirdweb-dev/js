import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensWithdrawn" event.
 */
export type TokensWithdrawnEventFilters = Partial<{
  staker: AbiParameterToPrimitiveType<{
    type: "address";
    name: "staker";
    indexed: true;
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensWithdrawn event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC1155
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensWithdrawnEvent } from "thirdweb/extensions/erc1155";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensWithdrawnEvent({
 *  staker: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensWithdrawnEvent(
  filters: TokensWithdrawnEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokensWithdrawn(address indexed staker, uint256 indexed tokenId, uint256 amount)",
    filters,
  });
}
