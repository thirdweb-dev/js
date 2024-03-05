import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensBurnedAndClaimed" event.
 */
export type TokensBurnedAndClaimedFilters = {
  originContract: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "originContract";
    type: "address";
  }>;
  tokenOwner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "tokenOwner";
    type: "address";
  }>;
  burnTokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "burnTokenId";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the TokensBurnedAndClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension IBURNTOCLAIM
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensBurnedAndClaimedEvent } from "thirdweb/extensions/IBurnToClaim";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensBurnedAndClaimedEvent({
 *  originContract: ...,
 *  tokenOwner: ...,
 *  burnTokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensBurnedAndClaimedEvent(
  filters: TokensBurnedAndClaimedFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokensBurnedAndClaimed(address indexed originContract, address indexed tokenOwner, uint256 indexed burnTokenId, uint256 quantity)",
    filters,
  });
}
