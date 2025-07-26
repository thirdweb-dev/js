import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Added" event.
 */
export type AddedEventFilters = Partial<{
  deployer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "deployer";
    indexed: true;
  }>;
  deployment: AbiParameterToPrimitiveType<{
    type: "address";
    name: "deployment";
    indexed: true;
  }>;
  chainId: AbiParameterToPrimitiveType<{
    type: "uint256";
    name: "chainId";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the Added event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { addedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  addedEvent({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 * })
 * ],
 * });
 * ```
 */
export function addedEvent(filters: AddedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Added(address indexed deployer, address indexed deployment, uint256 indexed chainId, string metadataUri)",
    filters,
  });
}
