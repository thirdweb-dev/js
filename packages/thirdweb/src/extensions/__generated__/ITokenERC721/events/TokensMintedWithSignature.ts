import { prepareEvent } from "../../../../event/prepare-event.js";
import type { AbiParameterToPrimitiveType } from "abitype";

/**
 * Represents the filters for the "TokensMintedWithSignature" event.
 */
export type TokensMintedWithSignatureFilters = {
  signer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "signer";
    type: "address";
  }>;
  mintedTo: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "mintedTo";
    type: "address";
  }>;
  tokenIdMinted: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenIdMinted";
    type: "uint256";
  }>;
};

/**
 * Creates an event object for the TokensMintedWithSignature event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @extension ITOKENERC721
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensMintedWithSignatureEvent } from "thirdweb/extensions/ITokenERC721";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensMintedWithSignatureEvent({
 *  signer: ...,
 *  mintedTo: ...,
 *  tokenIdMinted: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensMintedWithSignatureEvent(
  filters: TokensMintedWithSignatureFilters = {},
) {
  return prepareEvent({
    signature:
      "event TokensMintedWithSignature(address indexed signer, address indexed mintedTo, uint256 indexed tokenIdMinted, (address to, address royaltyRecipient, uint256 royaltyBps, address primarySaleRecipient, string uri, uint256 price, address currency, uint128 validityStartTimestamp, uint128 validityEndTimestamp, bytes32 uid) mintRequest)",
    filters,
  });
}
