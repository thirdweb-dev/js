import type { AbiParameterToPrimitiveType } from "abitype";
import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Represents the filters for the "StakeWithdrawn" event.
 */
export type StakeWithdrawnEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    type: "address";
    name: "account";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the StakeWithdrawn event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { stakeWithdrawnEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  stakeWithdrawnEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function stakeWithdrawnEvent(filters: StakeWithdrawnEventFilters = {}) {
  return prepareEvent({
    filters,
    signature:
      "event StakeWithdrawn(address indexed account, address withdrawAddress, uint256 amount)",
  });
}
