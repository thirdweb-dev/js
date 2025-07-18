import { prepareEvent } from "../../../../../event/prepare-event.js";

/**
 * Creates an event object for the AssetRewardClaimed event.
 * @returns The prepared event object.
 * @extension ASSETS
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { assetRewardClaimedEvent } from "thirdweb/extensions/assets";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  assetRewardClaimedEvent()
 * ],
 * });
 * ```
 */
export function assetRewardClaimedEvent() {
  return prepareEvent({
    signature: "event AssetRewardClaimed(address asset, address claimer)",
  });
}
