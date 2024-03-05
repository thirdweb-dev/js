import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "AirdropFailed" event.
 */
export type AirdropFailedEventFilters = Partial<{
  tokenAddress: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "tokenAddress";
    type: "address";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "tokenOwner";
    type: "address";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "recipient";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the AirdropFailed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { airdropFailedEvent } from "thirdweb/extensions/erc721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  airdropFailedEvent({
 *  tokenAddress: ...,
 *  tokenOwner: ...,
 *  recipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function airdropFailedEvent(filters: AirdropFailedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event AirdropFailed(address indexed tokenAddress, address indexed tokenOwner, address indexed recipient, uint256 tokenId)",
    filters,
  });
}
