import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "WalletClaimCountUpdated" event.
 */
export type WalletClaimCountUpdatedFilters = {
  wallet: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "wallet";
    type: "address";
  }>;
};

/**
 * Creates an event object for the WalletClaimCountUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IDROPERC1155_V2
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { walletClaimCountUpdatedEvent } from "thirdweb/extensions/IDropERC1155_V2";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  walletClaimCountUpdatedEvent({
 *  wallet: ...,
 * })
 * ],
 * });
 * ```
 */
export function walletClaimCountUpdatedEvent(
  filters: WalletClaimCountUpdatedFilters = {},
) {
  return prepareEvent({
    signature:
      "event WalletClaimCountUpdated(uint256 tokenId, address indexed wallet, uint256 count)",
    filters,
  });
}
