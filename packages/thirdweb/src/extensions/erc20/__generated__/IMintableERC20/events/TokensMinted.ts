import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensMinted" event.
 */
export type TokensMintedEventFilters = Partial<{
  mintedTo: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "mintedTo";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the TokensMinted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensMintedEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensMintedEvent({
 *  mintedTo: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensMintedEvent(filters: TokensMintedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensMinted(address indexed mintedTo, uint256 quantityMinted)",
    filters,
  });
}
