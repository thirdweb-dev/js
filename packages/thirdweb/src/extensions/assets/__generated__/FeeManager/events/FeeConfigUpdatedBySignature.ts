import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "FeeConfigUpdatedBySignature" event.
 */
export type FeeConfigUpdatedBySignatureEventFilters = Partial<{
  signer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "signer";
    indexed: true;
  }>;
  target: AbiParameterToPrimitiveType<{
    type: "address";
    name: "target";
    indexed: true;
  }>;
  action: AbiParameterToPrimitiveType<{
    type: "bytes4";
    name: "action";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the FeeConfigUpdatedBySignature event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { feeConfigUpdatedBySignatureEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  feeConfigUpdatedBySignatureEvent({
 *  signer: ...,
 *  target: ...,
 *  action: ...,
 * })
 * ],
 * });
 * ```
 */
export function feeConfigUpdatedBySignatureEvent(
  filters: FeeConfigUpdatedBySignatureEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event FeeConfigUpdatedBySignature(address indexed signer, address indexed target, bytes4 indexed action, address recipient, uint8 feeType, uint256 value)",
    filters,
  });
}
