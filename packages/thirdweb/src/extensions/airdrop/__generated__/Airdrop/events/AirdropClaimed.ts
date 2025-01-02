import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AirdropClaimed event.
 * @returns The prepared event object.
 * @extension AIRDROP
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { airdropClaimedEvent } from "thirdweb/extensions/airdrop";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  airdropClaimedEvent()
 * ],
 * });
 * ```
 */
export function airdropClaimedEvent() {
  return prepareEvent({
    signature: "event AirdropClaimed(address token, address receiver)",
  });
}
