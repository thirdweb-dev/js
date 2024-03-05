import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ConsecutiveTransfer" event.
 */
export type ConsecutiveTransferEventFilters = Partial<{
  fromTokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "fromTokenId";
    type: "uint256";
  }>;
  from: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "to";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the ConsecutiveTransfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { consecutiveTransferEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  consecutiveTransferEvent({
 *  fromTokenId: ...,
 *  from: ...,
 *  to: ...,
 * })
 * ],
 * });
 * ```
 */
export function consecutiveTransferEvent(
  filters: ConsecutiveTransferEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event ConsecutiveTransfer(uint256 indexed fromTokenId, uint256 toTokenId, address indexed from, address indexed to)",
    filters,
  });
}
