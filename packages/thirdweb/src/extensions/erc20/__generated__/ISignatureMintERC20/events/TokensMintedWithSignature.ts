import { prepareEvent } from "../../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensMintedWithSignature" event.
 */
export type TokensMintedWithSignatureEventFilters = Partial<{
  signer: AbiParameterToPrimitiveType<{
    type: "address";
    name: "signer";
    indexed: true;
  }>;
  mintedTo: AbiParameterToPrimitiveType<{
    type: "address";
    name: "mintedTo";
    indexed: true;
  }>;
}>;

/**
 * Creates an event object for the TokensMintedWithSignature event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ERC20
 * @example
 * ```ts
 * import { getContractEvents } from "thirdweb";
 * import { tokensMintedWithSignatureEvent } from "thirdweb/extensions/erc20";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensMintedWithSignatureEvent({
 *  signer: ...,
 *  mintedTo: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensMintedWithSignatureEvent(
  filters: TokensMintedWithSignatureEventFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokensMintedWithSignature(address indexed signer, address indexed mintedTo, (address to, address primarySaleRecipient, uint256 quantity, uint256 price, address currency, uint128 validityStartTimestamp, uint128 validityEndTimestamp, bytes32 uid) mintRequest)",
    filters,
  });
}
