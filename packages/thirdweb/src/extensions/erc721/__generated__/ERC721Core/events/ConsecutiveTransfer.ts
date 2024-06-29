import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "ConsecutiveTransfer" event.
 */
export type ConsecutiveTransferEventFilters = Partial<{
  fromTokenId: AbiParameterToPrimitiveType<{
    name: "fromTokenId";
    type: "uint256";
    indexed: true;
    internalType: "uint256";
  }>;
  from: AbiParameterToPrimitiveType<{
    name: "from";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    name: "to";
    type: "address";
    indexed: true;
    internalType: "address";
  }>;
}>;

/**
 * Creates an event object for the ConsecutiveTransfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
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
