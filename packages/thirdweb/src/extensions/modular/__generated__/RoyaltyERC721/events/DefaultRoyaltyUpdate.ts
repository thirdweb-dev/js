import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "DefaultRoyaltyUpdate" event.
 */
export type DefaultRoyaltyUpdateEventFilters = Partial<{
  recipient: AbiParameterToPrimitiveType<{
    name: "recipient";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the DefaultRoyaltyUpdate event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { defaultRoyaltyUpdateEvent } from "thirdweb/extensions/modular";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  defaultRoyaltyUpdateEvent({
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function defaultRoyaltyUpdateEvent(
  filters: DefaultRoyaltyUpdateEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event DefaultRoyaltyUpdate(address indexed recipient, uint256 bps)",
    filters,
  });
}
