import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Added" event.
 */
export type AddedEventFilters = Partial<{
  deployer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "deployer";
    type: "address";
  }>;
  deployment: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "deployment";
    type: "address";
  }>;
  chainId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "chainId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the Added event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```
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
      "event Added(address indexed deployer, address indexed deployment, uint256 indexed chainId)",
    filters,
  });
}
