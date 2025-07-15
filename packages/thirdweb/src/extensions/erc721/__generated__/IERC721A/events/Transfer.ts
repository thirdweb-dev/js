import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Transfer" event.
 */
export type TransferEventFilters = Partial<{
  from: AbiParameterToPrimitiveType<{
    type: "address";
    name: "from";
    indexed: true;
  }>;
  to: AbiParameterToPrimitiveType<{
    type: "address";
    name: "to";
    indexed: true;
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "tokenId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Transfer event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { transferEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferEvent({
 *  from: ...,
 *  to: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferEvent(filters: TransferEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    filters,
  });
}
