import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "SignerRemoved" event.
 */
export type SignerRemovedEventFilters = Partial<{
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
 * Creates an event object for the SignerRemoved event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC4337
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { signerRemovedEvent } from "thirdweb/extensions/erc4337";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  signerRemovedEvent({
 *  account: ...,
 *  signer: ...,
 * })
 * ],
 * });
 * ```
 */
export function signerRemovedEvent(filters: SignerRemovedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event SignerRemoved(address indexed account, address indexed signer)",
    filters,
  });
}
