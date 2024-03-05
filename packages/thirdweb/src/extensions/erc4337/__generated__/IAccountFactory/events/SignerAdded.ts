import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SignerAdded" event.
 */
export type SignerAddedEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  signer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the SignerAdded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { signerAddedEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  signerAddedEvent({
 *  account: ...,
 *  signer: ...,
 * })
 * ],
 * });
 * ```
 */
export function signerAddedEvent(filters: SignerAddedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event SignerAdded(address indexed account, address indexed signer)",
    filters,
  });
}
