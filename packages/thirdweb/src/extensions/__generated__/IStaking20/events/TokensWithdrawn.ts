import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensWithdrawn" event.
 */
export type TokensWithdrawnFilters = {
  staker: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "staker";
    type: "address";
  }>;
};

/**
 * Creates an event object for the TokensWithdrawn event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ISTAKING20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensWithdrawnEvent } from "thirdweb/extensions/IStaking20";
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
export function tokensWithdrawnEvent(filters: TokensWithdrawnFilters = {}) {
  return prepareEvent({
    signature: "event TokensWithdrawn(address indexed staker, uint256 amount)",
    filters,
  });
}
