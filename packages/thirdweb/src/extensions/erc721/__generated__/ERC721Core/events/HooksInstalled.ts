import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "HooksInstalled" event.
 */
export type HooksInstalledEventFilters = Partial<{
  implementation: AbiParameterToPrimitiveType<{
    name: "implementation";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the HooksInstalled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { hooksInstalledEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  hooksInstalledEvent({
 *  implementation: ...,
 * })
 * ],
 * });
 * ```
 */
export function hooksInstalledEvent(filters: HooksInstalledEventFilters = {}) {
  return prepareEvent({
    signature:
      "event HooksInstalled(address indexed implementation, uint256 hooks)",
    filters,
  });
}
