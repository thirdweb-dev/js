import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "TokensWithdrawn" event.
 */
export type TokensWithdrawnEventFilters = Partial<{
  staker: AbiParameterToPrimitiveType<{
    type: "address";
    name: "staker";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensWithdrawn event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensWithdrawnEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensWithdrawnEvent({
 *  staker: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensWithdrawnEvent(
  filters: TokensWithdrawnEventFilters = {},
) {
  return prepareEvent({
    filters,
    signature: "event TokensWithdrawn(address indexed staker, uint256 amount)",
  });
}
