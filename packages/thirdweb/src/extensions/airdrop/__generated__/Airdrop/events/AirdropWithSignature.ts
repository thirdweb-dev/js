import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AirdropWithSignature event.
 * @returns The prepared event object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { airdropWithSignatureEvent } from "thirdweb/extensions/airdrop";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  airdropWithSignatureEvent()
 * ],
 * });
 * ```
 */
export function airdropWithSignatureEvent() {
  return prepareEvent({
    signature: "event AirdropWithSignature(address token)",
  });
}
