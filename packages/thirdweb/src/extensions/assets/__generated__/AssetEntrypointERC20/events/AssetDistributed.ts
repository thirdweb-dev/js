import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AssetDistributed event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { assetDistributedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  assetDistributedEvent()
 * ],
 * });
 * ```
 */
export function assetDistributedEvent() {
  return prepareEvent({
    signature:
      "event AssetDistributed(address asset, uint256 recipientCount, uint256 totalAmount)",
  });
}
