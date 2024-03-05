import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "Deleted" event.
 */
export type DeletedEventFilters = Partial<{
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
 * Creates an event object for the Deleted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension THIRDWEB
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { deletedEvent } from "thirdweb/extensions/thirdweb";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  deletedEvent({
 *  deployer: ...,
 *  deployment: ...,
 *  chainId: ...,
 * })
 * ],
 * });
 * ```
 */
export function deletedEvent(filters: DeletedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Deleted(address indexed deployer, address indexed deployment, uint256 indexed chainId)",
    filters,
  });
}
