import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the Airdrop event.
 * @returns The prepared event object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { airdropEvent } from "thirdweb/extensions/airdrop";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  airdropEvent()
 * ],
 * });
 * ```
 */
export function airdropEvent() {
  return prepareEvent({
    signature: "event Airdrop(address token)",
  });
}
